#!/usr/bin/env node
// Build a tweet draft for each newly-published content file.
//
// Does NOT call the X API. Instead, for each file it:
//   1. Prints the tweet text to stdout (visible in the Actions log)
//   2. Appends a section to $GITHUB_STEP_SUMMARY (rendered on the run page)
//   3. Creates a GitHub issue with the tweet text and a `tweet-draft` label
//      so it lands in your inbox as a "post this on X manually" reminder
//
// We're in this mode because the X API moved to a metered credits model
// and the @Neural_Bridge_ account has no posting credits on its current
// tier. When that changes, restore the API call from git history and
// remove the issue-creation step.
//
// Usage: node draft-tweet.mjs <file1> [file2] ...
//
// Skips:
//   - Files marked draft: true
//   - Posts older than 7 days (avoids drafting on edits to old posts)

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';

const SITE = 'https://neural-bridge.dev';
const URL_TWITTER_LENGTH = 23;
const MAX_TWEET = 280;
const MAX_AGE_DAYS = 7;

function buildTweet({ title, description, url, contentType }) {
  const prefix = contentType === 'research' ? '📄 New research' : '🆕 New post';
  const titleLine = `${prefix}: ${title}`;
  const overhead = titleLine.length + 4 + URL_TWITTER_LENGTH;
  const bodyMax = MAX_TWEET - overhead;
  let body = description ?? '';
  if (body.length > bodyMax) {
    body = body.slice(0, Math.max(0, bodyMax - 1)).trimEnd() + '…';
  }
  return `${titleLine}\n\n${body}\n\n${url}`;
}

async function appendStepSummary(text) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  await fs.appendFile(summaryPath, text + '\n', 'utf-8');
}

function ensureLabelExists() {
  // Create the label idempotently. `gh label create` fails non-fatally
  // if the label already exists; we swallow that error.
  try {
    execFileSync('gh', [
      'label', 'create', 'tweet-draft',
      '--color', '1d76db',
      '--description', 'Tweet draft pending manual post to @Neural_Bridge_',
    ], { stdio: 'pipe' });
  } catch {
    // already exists or another non-fatal error; ignore
  }
}

async function createIssue({ tweet, title, url }) {
  if (!process.env.GITHUB_TOKEN && !process.env.GH_TOKEN) {
    console.log('SKIP issue creation: no GITHUB_TOKEN/GH_TOKEN');
    return;
  }
  ensureLabelExists();
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'tweet-'));
  const bodyFile = path.join(tmp, 'body.md');
  const issueBody = [
    `**Tweet draft for:** [${title}](${url})`,
    '',
    'Copy the block below and post it from @Neural_Bridge_ on X. Close this issue once posted.',
    '',
    '```',
    tweet,
    '```',
    '',
    `_${tweet.length} / ${MAX_TWEET} chars_`,
  ].join('\n');
  await fs.writeFile(bodyFile, issueBody, 'utf-8');
  try {
    execFileSync('gh', [
      'issue', 'create',
      '--title', `Tweet draft: ${title}`,
      '--body-file', bodyFile,
      '--label', 'tweet-draft',
    ], { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to create issue (continuing): ${err.message}`);
  }
}

async function main() {
  const files = process.argv.slice(2).filter(Boolean);
  if (files.length === 0) {
    console.log('No files to process');
    return;
  }

  await appendStepSummary('## Tweet drafts\n');

  for (const file of files) {
    try {
      const raw = await fs.readFile(file, 'utf-8');
      const { data } = matter(raw);

      if (data.draft) {
        console.log(`SKIP (draft): ${file}`);
        continue;
      }

      const pubDate = new Date(data.pubDate);
      if (Number.isNaN(pubDate.getTime())) {
        console.warn(`SKIP (invalid pubDate): ${file}`);
        continue;
      }
      const ageInDays = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
      if (ageInDays > MAX_AGE_DAYS) {
        console.log(`SKIP (${ageInDays.toFixed(1)} days old): ${file}`);
        continue;
      }

      const isResearch = file.replace(/\\/g, '/').includes('src/content/research/');
      const slug = path.basename(file, path.extname(file));
      const url = isResearch
        ? `${SITE}/research/${slug}`
        : `${SITE}/posts/${slug}`;

      const tweet = buildTweet({
        title: data.title,
        description: data.description,
        url,
        contentType: isResearch ? 'research' : 'post',
      });

      console.log(`DRAFT (${tweet.length} chars): ${file}`);
      console.log('---');
      console.log(tweet);
      console.log('---');

      await appendStepSummary([
        `### ${data.title}`,
        '',
        '```',
        tweet,
        '```',
        '',
        `_${tweet.length} / ${MAX_TWEET} chars_`,
        '',
      ].join('\n'));

      await createIssue({ tweet, title: data.title, url });
    } catch (err) {
      console.error(`FAIL: ${file}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
