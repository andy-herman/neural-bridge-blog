#!/usr/bin/env node
// Translate an English content file (.md / .mdx) into Korean.
//
// Reads src/content/<collection>/<slug>.<ext>, calls `claude -p` with the
// translation prompt at scripts/prompts/translate-to-korean.md, writes the
// Korean version to src/content/<collection>/ko/<slug>.<ext>.
//
// Usage:
//   node scripts/translate-to-korean.mjs <path>                # single file
//   node scripts/translate-to-korean.mjs --collection research # whole collection
//   node scripts/translate-to-korean.mjs --all                 # all collections
//   node scripts/translate-to-korean.mjs <path> --force        # re-translate
//   node scripts/translate-to-korean.mjs <path> --dry-run      # print plan only
//
// Idempotent: skips files where Korean sidecar exists unless --force.

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(REPO_ROOT, 'src', 'content');
const PROMPT_FILE = path.join(REPO_ROOT, 'scripts', 'prompts', 'translate-to-korean.md');

const KNOWN_COLLECTIONS = ['posts', 'research', 'projects', 'agents'];
const CLAUDE_MODEL = 'claude-sonnet-4-6';
const CLAUDE_TIMEOUT_MS = 600_000; // 10 min — long-form content

function fileExtension(p) {
  if (p.endsWith('.mdx')) return '.mdx';
  if (p.endsWith('.md')) return '.md';
  return '';
}

function koTargetPath(sourcePath) {
  const rel = path.relative(CONTENT_DIR, sourcePath);
  const parts = rel.split(path.sep);
  if (parts.length < 2) throw new Error(`Unexpected content path: ${sourcePath}`);
  const collection = parts[0];
  const slugParts = parts.slice(1);
  return path.join(CONTENT_DIR, collection, 'ko', ...slugParts);
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function translateFile(sourcePath, promptTemplate, opts) {
  const ext = fileExtension(sourcePath);
  if (!ext) throw new Error(`Source must be .md or .mdx: ${sourcePath}`);

  const target = koTargetPath(sourcePath);
  if (await fileExists(target) && !opts.force) {
    console.error(`  = ${path.relative(REPO_ROOT, sourcePath)} (Korean exists, skip; --force to re-translate)`);
    return { status: 'skipped' };
  }

  const source = await fs.readFile(sourcePath, 'utf-8');
  const prompt = promptTemplate.replace('{source_content}', source);

  if (opts.dryRun) {
    console.error(`  ? ${path.relative(REPO_ROOT, sourcePath)} (dry-run, ${prompt.length} char prompt → ${path.relative(REPO_ROOT, target)})`);
    return { status: 'dry-run' };
  }

  console.error(`  > ${path.relative(REPO_ROOT, sourcePath)} → ${path.relative(REPO_ROOT, target)}`);
  const t0 = Date.now();
  let stdout;
  try {
    const result = await execFileAsync(
      'claude',
      ['-p', prompt, '--output-format', 'text', '--model', CLAUDE_MODEL],
      { maxBuffer: 50 * 1024 * 1024, timeout: CLAUDE_TIMEOUT_MS },
    );
    stdout = result.stdout;
  } catch (err) {
    console.error(`  ! ${path.relative(REPO_ROOT, sourcePath)}: claude call failed — ${err.message}`);
    return { status: 'failed', error: err.message };
  }
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  // Strip stray code fence wrapping (defensive)
  let body = stdout.trimEnd();
  if (body.startsWith('```')) {
    const lines = body.split('\n');
    if (lines[0].startsWith('```')) lines.shift();
    if (lines.length && lines[lines.length - 1].startsWith('```')) lines.pop();
    body = lines.join('\n');
  }
  if (!body.startsWith('---')) {
    console.error(`  ! ${path.relative(REPO_ROOT, sourcePath)}: output doesn't start with frontmatter (---)`);
    return { status: 'failed', error: 'no-frontmatter' };
  }

  // Em-dash safety net. The prompt forbids them; if any slipped through,
  // strip them and log a warning. This is belt-and-suspenders for Andy's
  // strict voice rule.
  const emDashCount = (body.match(/[—–]/g) || []).length;
  if (emDashCount > 0) {
    console.error(`  ⚠ ${path.relative(REPO_ROOT, sourcePath)}: contains ${emDashCount} em/en dash(es); stripping`);
    body = body.replace(/—/g, ', ').replace(/–/g, ', ');
  }

  await fs.mkdir(path.dirname(target), { recursive: true });
  const tmp = target + '.tmp';
  await fs.writeFile(tmp, body + '\n');
  await fs.rename(tmp, target);
  console.error(`  ✓ ${path.relative(REPO_ROOT, target)} (${elapsed}s, ${body.length} chars${emDashCount > 0 ? `, ${emDashCount} dashes stripped` : ''})`);
  return { status: 'ok' };
}

async function listCollection(name) {
  const dir = path.join(CONTENT_DIR, name);
  let files;
  try {
    files = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return files
    .filter(e => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')))
    .map(e => path.join(dir, e.name));
}

async function main() {
  const args = process.argv.slice(2);
  const opts = { force: false, dryRun: false };
  const files = [];
  let collection = null;
  let all = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--all') all = true;
    else if (a === '--collection' && args[i + 1]) { collection = args[i + 1]; i++; }
    else files.push(path.resolve(a));
  }

  if (collection) {
    if (!KNOWN_COLLECTIONS.includes(collection)) {
      console.error(`Unknown collection: ${collection}. Known: ${KNOWN_COLLECTIONS.join(', ')}`);
      process.exit(1);
    }
    files.push(...await listCollection(collection));
  }
  if (all) {
    for (const c of KNOWN_COLLECTIONS) files.push(...await listCollection(c));
  }

  if (files.length === 0) {
    console.error('Usage: node scripts/translate-to-korean.mjs <path> | --collection <name> | --all');
    console.error('  --force      Re-translate even if Korean version exists');
    console.error('  --dry-run    Print plan, do not call Claude');
    process.exit(1);
  }

  const promptTemplate = await fs.readFile(PROMPT_FILE, 'utf-8');
  console.error(`Translating ${files.length} file(s) using prompt at ${path.relative(REPO_ROOT, PROMPT_FILE)}...`);

  const stats = { ok: 0, skipped: 0, failed: 0, dryRun: 0 };
  for (const f of files) {
    try {
      const result = await translateFile(f, promptTemplate, opts);
      if (result.status === 'ok') stats.ok++;
      else if (result.status === 'skipped') stats.skipped++;
      else if (result.status === 'failed') stats.failed++;
      else if (result.status === 'dry-run') stats.dryRun++;
    } catch (err) {
      console.error(`  ! ${path.relative(REPO_ROOT, f)}: ${err.message}`);
      stats.failed++;
    }
  }

  console.error(`\nDone. ok=${stats.ok} skipped=${stats.skipped} failed=${stats.failed} dry-run=${stats.dryRun}`);
  if (stats.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('translate-to-korean failed:', err);
  process.exit(1);
});
