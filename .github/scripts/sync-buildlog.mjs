#!/usr/bin/env node
// Sync newly merged PRs from neural-bridge + neural-bridge-blog into the
// buildlog content collection.
//
// Behavior:
//   1. Read existing buildlog entries to extract `pr_url` values from frontmatter.
//   2. Fetch the most recent N merged PRs from each upstream repo (default 50).
//   3. For each PR not already represented, generate a buildlog markdown file
//      at src/content/buildlog/auto-<repo-slug>-pr-<N>.md.
//   4. Print the count of entries written; exit 0.
//
// Idempotent: skips PRs already represented (by exact PR URL match in the
// existing entries' `pr_url` frontmatter).
//
// Skips:
//   - Bot-authored PRs (Dependabot, GitHub Actions, etc.)
//   - PRs whose title starts with "chore("
//   - PRs whose title starts with "Bump " (Dependabot fallback)
//
// Kind inference (from PR title prefix):
//   - "feat(daemon|launchd|caffeinate|reload|logging|hardening):" → hardening
//   - "feat(...):"                                                → feature
//   - "fix(...):"                                                 → fix
//   - "docs(...):"                                                → note
//   - everything else                                             → note
//
// Project inference: derived from which repo the PR came from.
//
// Pure Node.js, zero external dependencies (calls `gh` via execFile).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const REPOS = [
  { slug: 'andy-herman/neural-bridge', short: 'nb', project: 'neural-bridge' },
  { slug: 'andy-herman/neural-bridge-blog', short: 'nb-blog', project: 'neural-bridge-blog' },
];

const FETCH_LIMIT = 50;
const BUILDLOG_DIR = path.resolve('src/content/buildlog');

const HARDENING_SCOPES = /\bfeat\((?:daemon|launchd|caffeinate|reload|logging|hardening|launchctl|launch|infra)[^)]*\)/i;

// ---------- frontmatter parsing (minimal) ----------

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) return { data: {} };
  const lines = raw.split(/\r?\n/);
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { endIdx = i; break; }
  }
  if (endIdx === -1) return { data: {} };
  const fmLines = lines.slice(1, endIdx);
  const data = {};
  let i = 0;
  while (i < fmLines.length) {
    const line = fmLines[i];
    if (!line.trim() || line.startsWith('#')) { i++; continue; }
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) { i++; continue; }
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
    i++;
  }
  return { data };
}

// ---------- existing entries ----------

async function existingPRUrls() {
  const out = new Set();
  let files;
  try {
    files = await fs.readdir(BUILDLOG_DIR);
  } catch {
    await fs.mkdir(BUILDLOG_DIR, { recursive: true });
    return out;
  }
  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const raw = await fs.readFile(path.join(BUILDLOG_DIR, f), 'utf-8');
    const { data } = parseFrontmatter(raw);
    if (data.pr_url) {
      out.add(data.pr_url);
    }
    // Also detect hand-curated entries that link to the same PR via the
    // links[] array. Cheap regex over the full markdown body — won't be
    // perfect but keeps idempotency reasonable for the common case.
    const linkMatches = raw.matchAll(/url:\s*["']?(https:\/\/github\.com\/[^"'\s]+\/pull\/\d+)["']?/g);
    for (const m of linkMatches) out.add(m[1]);
  }
  return out;
}

// ---------- gh API call ----------

async function fetchMergedPRs(repoSlug, limit) {
  const args = [
    'pr', 'list',
    '--repo', repoSlug,
    '--state', 'merged',
    '--limit', String(limit),
    '--json', 'number,title,body,mergedAt,url,author,baseRefName',
  ];
  try {
    const { stdout } = await execFileAsync('gh', args, { maxBuffer: 1024 * 1024 * 10 });
    return JSON.parse(stdout);
  } catch (err) {
    console.error(`gh pr list failed for ${repoSlug}:`, err.stderr || err.message);
    return [];
  }
}

// ---------- entry generation ----------

function inferKind(title) {
  if (HARDENING_SCOPES.test(title)) return 'hardening';
  if (/^feat\([^)]*\)\s*:/i.test(title)) return 'feature';
  if (/^fix\([^)]*\)\s*:/i.test(title)) return 'fix';
  if (/^docs\([^)]*\)\s*:/i.test(title)) return 'note';
  return 'note';
}

function shouldSkip(pr) {
  if (!pr.title) return true;
  if (/^chore\b/i.test(pr.title)) return true;
  if (/^Bump\s+\w/.test(pr.title)) return true;
  // Skip bot authors
  const login = (pr.author && pr.author.login) || '';
  if (/\b(dependabot|github-actions|renovate|bot)\b/i.test(login)) return true;
  return false;
}

function cleanTitle(title) {
  // Drop conventional-commit prefix: "feat(scope): foo" → "foo"
  // Capitalize first letter for nicer rendering.
  const stripped = title.replace(/^[a-z]+\([^)]*\)\s*:\s*/i, '').replace(/^[a-z]+\s*:\s*/i, '');
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

function firstParagraph(body) {
  if (!body) return '';
  // Collapse Windows line endings, drop heading lines and the PR template's
  // "## Summary" boilerplate so the first real paragraph wins.
  const norm = body.replace(/\r\n/g, '\n').trim();
  const lines = norm.split('\n');
  const start = [];
  let inPara = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (inPara) break;
      continue;
    }
    if (t.startsWith('#')) continue;            // skip headings
    if (t.startsWith('<!--')) continue;         // skip HTML comments
    inPara = true;
    start.push(t);
  }
  let para = start.join(' ').trim();
  // Drop leading "**Summary.**" markers etc.
  para = para.replace(/^\*\*[^*]+\*\*\s*\.?\s*/, '');
  // Unescape common escape sequences that GitHub stores in PR bodies (when
  // someone pasted from a context that pre-escaped backticks/quotes).
  // Preserves real backslashes by handling `\\` last.
  para = para
    .replace(/\\`/g, '`')
    .replace(/\\"/g, '"')
    .replace(/\\\*/g, '*')
    .replace(/\\_/g, '_')
    .replace(/\\\\/g, '\\');
  // Cap at 320 chars for buildlog tightness.
  if (para.length > 320) {
    para = para.slice(0, 320).replace(/\s+\S*$/, '') + '…';
  }
  return para;
}

function dateOnly(iso) {
  return iso.slice(0, 10); // YYYY-MM-DD
}

function escapeYamlString(s) {
  // Wrap in double quotes, escape inner double-quotes and backslashes.
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function renderEntry(pr, repo) {
  const kind = inferKind(pr.title);
  const date = dateOnly(pr.mergedAt);
  const title = cleanTitle(pr.title);
  const body = firstParagraph(pr.body) || `Merged via ${pr.url.split('/').slice(-2).join('/')}.`;
  const fm = [
    '---',
    `title: ${escapeYamlString(title)}`,
    `date: ${date}`,
    `kind: ${kind}`,
    `project: ${repo.project}`,
    `pr_url: ${escapeYamlString(pr.url)}`,
    'links:',
    `  - label: ${escapeYamlString('PR #' + pr.number)}`,
    `    url: ${escapeYamlString(pr.url)}`,
    'tags: [auto-sync]',
    '---',
    '',
    body,
    '',
  ].join('\n');
  return fm;
}

function entryFilename(pr, repo) {
  const date = dateOnly(pr.mergedAt);
  return `auto-${date}-${repo.short}-pr-${pr.number}.md`;
}

// ---------- main ----------

async function main() {
  const known = await existingPRUrls();
  console.error(`Known PR URLs already in buildlog: ${known.size}`);

  let written = 0;
  const writtenPaths = [];

  for (const repo of REPOS) {
    console.error(`Fetching merged PRs from ${repo.slug}...`);
    const prs = await fetchMergedPRs(repo.slug, FETCH_LIMIT);
    console.error(`  ${prs.length} merged PRs fetched.`);

    for (const pr of prs) {
      if (known.has(pr.url)) continue;
      if (shouldSkip(pr)) continue;
      if (pr.baseRefName && pr.baseRefName !== 'main') continue;

      const filename = entryFilename(pr, repo);
      const target = path.join(BUILDLOG_DIR, filename);
      // Defensive: if file exists from a prior run not yet committed, skip.
      try {
        await fs.access(target);
        continue;
      } catch { /* file doesn't exist; proceed */ }

      const content = renderEntry(pr, repo);
      await fs.writeFile(target, content, 'utf-8');
      writtenPaths.push(filename);
      written += 1;
    }
  }

  console.error(`Wrote ${written} new buildlog entries.`);
  for (const p of writtenPaths) console.error(`  + ${p}`);

  if (process.env.GITHUB_OUTPUT) {
    await fs.appendFile(process.env.GITHUB_OUTPUT, `count=${written}\n`);
  }
  process.exitCode = 0;
}

main().catch(err => {
  console.error('sync-buildlog failed:', err);
  process.exitCode = 1;
});
