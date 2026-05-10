#!/usr/bin/env node
// Fetch agent avatars from the Discord API and save to public/agents/<id>.png.
//
// Reads src/content/agents/*.md for client_ids, queries Discord's /users/<id>
// endpoint for each (needs any bot token to authenticate), downloads the
// avatar PNG at 512x512, and writes to public/agents/<id>.png.
//
// Token resolution order:
//   1. DISCORD_BOT_TOKEN env var
//   2. macOS keychain: `security find-generic-password -s "neural-bridge-discord-bot-recruiter" -a $USER -w`
//      (any bot's token works for read-only API queries; recruiter is the default)
//
// Usage:
//   node scripts/fetch-agent-avatars.mjs                  # all agents
//   node scripts/fetch-agent-avatars.mjs --only ux-designer,echo
//   node scripts/fetch-agent-avatars.mjs --token-from senior-pm   # use a different bot's token
//
// Idempotent: writes files atomically, skips agents that already have a fresh
// avatar (same hash) on disk.

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const AGENTS_DIR = path.join(REPO_ROOT, 'src', 'content', 'agents');
const OUTPUT_DIR = path.join(REPO_ROOT, 'public', 'agents');
const HASH_FILE = path.join(OUTPUT_DIR, '.avatar-hashes.json');

// ---------- frontmatter parsing ----------

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return {};
  const lines = raw.split(/\r?\n/);
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { endIdx = i; break; }
  }
  if (endIdx === -1) return {};
  const fmLines = lines.slice(1, endIdx);
  const data = {};
  for (const line of fmLines) {
    if (!line.trim() || line.startsWith('#')) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return data;
}

// ---------- token resolution ----------

async function tokenFromKeychain(service) {
  try {
    const { stdout } = await execFileAsync('security', [
      'find-generic-password', '-s', service, '-a', process.env.USER, '-w',
    ]);
    return stdout.trim();
  } catch {
    return null;
  }
}

async function resolveToken(tokenFromAgentId = 'recruiter') {
  if (process.env.DISCORD_BOT_TOKEN) return process.env.DISCORD_BOT_TOKEN;
  const service = `neural-bridge-discord-bot-${tokenFromAgentId}`;
  const tok = await tokenFromKeychain(service);
  if (!tok) {
    throw new Error(
      `No Discord token found. Set DISCORD_BOT_TOKEN env var, or store one in keychain at "${service}".`
    );
  }
  return tok;
}

// ---------- Discord API ----------

async function fetchUser(clientId, token) {
  const res = await fetch(`https://discord.com/api/v10/users/${clientId}`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Discord API ${res.status} for ${clientId}: ${await res.text()}`);
  }
  return res.json();
}

async function downloadAvatar(url, target) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Avatar download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // Atomic write: write to temp file then rename
  const tmp = target + '.tmp';
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, target);
}

// ---------- hash cache ----------

async function readHashCache() {
  try {
    const raw = await fs.readFile(HASH_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeHashCache(cache) {
  await fs.writeFile(HASH_FILE, JSON.stringify(cache, null, 2) + '\n');
}

// ---------- main ----------

async function main() {
  const args = process.argv.slice(2);
  let onlyIds = null;
  let tokenFromAgent = 'recruiter';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--only' && args[i + 1]) {
      onlyIds = new Set(args[i + 1].split(',').map(s => s.trim()));
      i++;
    } else if (args[i] === '--token-from' && args[i + 1]) {
      tokenFromAgent = args[i + 1];
      i++;
    }
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const cache = await readHashCache();

  const files = await fs.readdir(AGENTS_DIR);
  const agents = [];
  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const raw = await fs.readFile(path.join(AGENTS_DIR, f), 'utf-8');
    const fm = parseFrontmatter(raw);
    if (!fm.id || !fm.client_id) {
      console.warn(`Skipping ${f}: missing id or client_id`);
      continue;
    }
    if (onlyIds && !onlyIds.has(fm.id)) continue;
    agents.push({ id: fm.id, client_id: fm.client_id, display_name: fm.display_name });
  }

  if (agents.length === 0) {
    console.error('No agents to fetch.');
    process.exit(1);
  }

  const token = await resolveToken(tokenFromAgent);
  console.error(`Fetching avatars for ${agents.length} agents (token-from=${tokenFromAgent})...`);

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const agent of agents) {
    try {
      const user = await fetchUser(agent.client_id, token);
      if (!user.avatar) {
        console.error(`  - ${agent.id}: no custom avatar set; using Discord default`);
        // Skip — let CSS render a placeholder. Or could fetch /embed/avatars/N.png.
        failed += 1;
        continue;
      }
      if (cache[agent.id] === user.avatar) {
        console.error(`  = ${agent.id}: cached (${user.avatar.slice(0, 8)}...)`);
        skipped += 1;
        continue;
      }
      const url = `https://cdn.discordapp.com/avatars/${agent.client_id}/${user.avatar}.png?size=512`;
      const target = path.join(OUTPUT_DIR, `${agent.id}.png`);
      await downloadAvatar(url, target);
      cache[agent.id] = user.avatar;
      console.error(`  + ${agent.id}: ${user.avatar.slice(0, 8)}... -> ${path.relative(REPO_ROOT, target)}`);
      fetched += 1;
    } catch (err) {
      console.error(`  ! ${agent.id}: ${err.message}`);
      failed += 1;
    }
  }

  await writeHashCache(cache);
  console.error(`\nDone. fetched=${fetched} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('fetch-agent-avatars failed:', err);
  process.exit(1);
});
