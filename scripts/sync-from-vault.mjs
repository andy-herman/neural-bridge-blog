#!/usr/bin/env node
// Sync a research paper from the Obsidian vault to the blog repo.
//
// Usage:
//   node scripts/sync-from-vault.mjs "<absolute path to vault .md file>"
//   npm run sync-paper -- "<absolute path to vault .md file>"
//
// What it does:
//   1. Reads the vault file's YAML frontmatter and body
//   2. Strips vault-only artifacts (the H1 title, "Published version:" callout)
//   3. Converts wiki-links [[Page Name]] → "Page Name" plain text
//   4. Translates frontmatter fields from vault convention to Astro schema
//   5. Determines slug from the `canonical` URL (preferred) or filename
//   6. Writes the result to src/content/research/<slug>.mdx
//
// Pure Node.js, no external dependencies. Run from the blog repo root.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------- minimal YAML frontmatter parser (handles the subset we use) ----------

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) {
    return { data: {}, content: raw };
  }
  const lines = raw.split(/\r?\n/);
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { endIdx = i; break; }
  }
  if (endIdx === -1) return { data: {}, content: raw };

  const fmLines = lines.slice(1, endIdx);
  const content = lines.slice(endIdx + 1).join('\n');

  const data = {};
  let i = 0;
  while (i < fmLines.length) {
    const line = fmLines[i];
    if (!line.trim() || line.startsWith('#')) { i++; continue; }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) { i++; continue; }

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Multiline block scalar: `key: |`
    if (value === '|' || value === '|-' || value === '|+') {
      i++;
      const blockLines = [];
      while (i < fmLines.length && (fmLines[i].startsWith('  ') || fmLines[i] === '')) {
        blockLines.push(fmLines[i].replace(/^  /, ''));
        i++;
      }
      data[key] = blockLines.join('\n').trim();
      continue;
    }

    // Inline arrays [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1)
        .split(',')
        .map(s => s.trim())
        .map(s => (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))
          ? s.slice(1, -1)
          : s)
        .filter(Boolean);
      i++;
      continue;
    }

    // Quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    data[key] = value;
    i++;
  }

  return { data, content };
}

// ---------- minimal YAML stringifier (for the subset we emit) ----------

function stringifyFrontmatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      const items = value.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(', ');
      lines.push(`${key}: [${items}]`);
    } else if (typeof value === 'string' && value.includes('\n')) {
      lines.push(`${key}: |`);
      for (const ln of value.split('\n')) {
        lines.push(`  ${ln}`);
      }
    } else if (typeof value === 'string') {
      const escaped = value.replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else if (value instanceof Date) {
      lines.push(`${key}: ${value.toISOString().slice(0, 10)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

// ---------- slug helpers ----------

function slugFromCanonical(canonical) {
  if (!canonical) return null;
  const m = canonical.match(/\/research\/([^/]+)\/?$/);
  return m ? m[1] : null;
}

function slugFromFilename(filePath) {
  return path.basename(filePath, path.extname(filePath))
    .toLowerCase()
    .replace(/^\d+\s*-\s*/, '')      // strip "01 - " ordering prefix
    .replace(/[^a-z0-9]+/g, '-')     // non-alnum → hyphen
    .replace(/^-+|-+$/g, '');        // trim hyphens
}

// ---------- main ----------

async function main() {
  const vaultPath = process.argv[2];
  if (!vaultPath) {
    console.error('Usage: node scripts/sync-from-vault.mjs "<vault file path>"');
    process.exit(1);
  }

  const raw = await fs.readFile(vaultPath, 'utf-8');
  const { data: fm, content } = parseFrontmatter(raw);

  let body = content;

  // Strip "Published version:" callout block (vault-only context)
  body = body.replace(/^>\s*Published version:[^\n]*\n+/m, '');

  // Extract title from H1 if frontmatter doesn't have one, then strip the H1
  // (Astro's research detail layout renders the title from frontmatter, not body)
  const h1Match = body.match(/^#\s+(.+)$/m);
  const title = fm.title || h1Match?.[1]?.trim() || '(untitled)';
  body = body.replace(/^#\s+.+\n+/m, '');

  // Strip working-paper / draft subtitle lines if present
  body = body.replace(/^\*\*Working paper.+\*\*\n+/mi, '');
  body = body.replace(/^\*\*Draft.+\*\*\n+/mi, '');

  // Convert wiki-links: [[Page|Display]] → Display ; [[Page]] → Page
  body = body.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  body = body.replace(/\[\[([^\]]+)\]\]/g, '$1');

  // Strip "(vault note)" parentheticals
  body = body.replace(/\s*\(\s*vault note\s*\)/g, '');

  // Determine slug
  const slug = slugFromCanonical(fm.canonical) || slugFromFilename(vaultPath);

  // Build blog frontmatter
  const blogFm = {
    title,
    description: fm.description || '',
    abstract: fm.abstract || undefined,
    pubDate: fm.created || fm.pubDate,
    updatedDate: fm.updated || undefined,
    topic: fm.topic,
    tags: fm.tags || [],
    status: fm.status || 'working-paper',
    version: fm.version || undefined,
    linkedinUrl: fm.linkedinUrl || undefined,
    // Default to draft. Only publish when the vault file explicitly sets
    // `draft: false` in frontmatter — keeps publishing an intentional act.
    draft: fm.draft === 'false' ? false : true,
  };

  const output = stringifyFrontmatter(blogFm) + '\n\n' + body.trim() + '\n';

  // Resolve output path relative to script location
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(scriptDir, '..', 'src', 'content', 'research', `${slug}.mdx`);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, output, 'utf-8');

  console.log('✓ Synced vault paper to blog');
  console.log(`  Source : ${vaultPath}`);
  console.log(`  Target : ${outputPath}`);
  console.log(`  Title  : ${title}`);
  console.log(`  Topic  : ${fm.topic ?? '(none)'}`);
  console.log(`  Slug   : ${slug}`);
  console.log(`  Status : ${blogFm.status} ${blogFm.version ?? ''}`);
}

main().catch(err => {
  console.error('✗ Sync failed:', err.message);
  process.exit(1);
});
