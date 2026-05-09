#!/usr/bin/env node
// Find a scheduled draft (draft: true, pubDate <= today UTC) and publish it.
// Picks the oldest pubDate first if multiple are eligible.
// Updates pubDate to today's UTC date so the tweet workflow's age check
// passes and the rendered "published on" date is accurate.
//
// Outputs `file` and `title` via GITHUB_OUTPUT for downstream steps.
//
// Pure Node.js, zero external dependencies.

import fs from 'node:fs/promises';
import path from 'node:path';

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) {
    return { data: {} };
  }
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

    // Skip multiline block scalars; we only need the leaf scalar fields here
    if (value === '|' || value === '|-' || value === '|+') {
      i++;
      while (i < fmLines.length && (fmLines[i].startsWith('  ') || fmLines[i] === '')) i++;
      continue;
    }

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key === 'draft') {
      data[key] = value === 'true';
    } else {
      data[key] = value;
    }
    i++;
  }
  return { data };
}

async function main() {
  const dirs = ['src/content/posts', 'src/content/research'];
  const candidates = [];

  // Use UTC for the comparison; pubDates without time default to 00:00:00 UTC.
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  // For comparison, treat pubDate as the start of that UTC day; eligible if
  // that start is <= today's date.
  const todayDateOnly = new Date(todayStr + 'T00:00:00Z');

  for (const dir of dirs) {
    let files;
    try {
      files = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const f of files) {
      if (!f.endsWith('.mdx') && !f.endsWith('.md')) continue;
      const filepath = path.join(dir, f);
      const raw = await fs.readFile(filepath, 'utf-8');
      const { data } = parseFrontmatter(raw);

      if (data.draft !== true) continue;

      // Treat pubDate strings as YYYY-MM-DD (UTC midnight)
      const pubDateRaw = data.pubDate;
      if (!pubDateRaw) continue;
      const pubDate = new Date(/^\d{4}-\d{2}-\d{2}$/.test(pubDateRaw)
        ? pubDateRaw + 'T00:00:00Z'
        : pubDateRaw);
      if (Number.isNaN(pubDate.getTime())) continue;
      if (pubDate > todayDateOnly) continue;  // not yet due

      candidates.push({ filepath, data, raw, pubDate });
    }
  }

  if (candidates.length === 0) {
    console.log('No scheduled drafts ready to publish.');
    return;
  }

  candidates.sort((a, b) => a.pubDate - b.pubDate);
  const chosen = candidates[0];

  // Flip draft to false and update pubDate to today
  let updated = chosen.raw.replace(/^draft:\s*true\s*$/m, 'draft: false');
  updated = updated.replace(/^pubDate:.+$/m, `pubDate: "${todayStr}"`);

  await fs.writeFile(chosen.filepath, updated, 'utf-8');

  const title = chosen.data.title || path.basename(chosen.filepath, path.extname(chosen.filepath));

  console.log(`✓ Published: ${title}`);
  console.log(`  File: ${chosen.filepath}`);
  console.log(`  Original pubDate: ${chosen.data.pubDate} → ${todayStr}`);
  if (candidates.length > 1) {
    console.log(`  ${candidates.length - 1} more draft(s) waiting in queue.`);
  }

  // Emit GitHub Actions outputs for the next steps
  const ghOutput = process.env.GITHUB_OUTPUT;
  if (ghOutput) {
    const cleanTitle = title.replace(/[\r\n]+/g, ' ').replace(/"/g, '\\"');
    const cleanPath = chosen.filepath.replace(/\\/g, '/');
    await fs.appendFile(ghOutput, `file=${cleanPath}\ntitle=${cleanTitle}\n`);
  }
}

main().catch(err => {
  console.error('✗ Scheduled publish failed:', err.message);
  process.exit(1);
});
