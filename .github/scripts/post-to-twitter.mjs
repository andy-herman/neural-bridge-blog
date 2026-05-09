// Post a single tweet for each newly-published content file.
//
// Usage: node post-to-twitter.mjs <file1> [file2] ...
//
// Reads frontmatter from each file, builds a tweet (title + description +
// URL, truncated to 280 chars), and posts via Twitter API v2 with OAuth 1.0a
// User Context.
//
// Skips:
//   - Files marked draft: true
//   - Posts older than 7 days (avoids re-posting on edits)

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { TwitterApi } from 'twitter-api-v2';

const SITE = 'https://neural-bridge.dev';
const TWITTER_HANDLE = 'Neural_Bridge_';
const URL_TWITTER_LENGTH = 23; // Twitter t.co URLs always count as 23 chars
const MAX_TWEET = 280;
const MAX_AGE_DAYS = 7;

function buildTweet({ title, description, url, contentType }) {
  const prefix = contentType === 'research' ? '📄 New research' : '🆕 New post';
  const titleLine = `${prefix}: ${title}`;

  // Reserve = double-newline (2) + double-newline (2) + url length
  const overhead = titleLine.length + 4 + URL_TWITTER_LENGTH;
  const bodyMax = MAX_TWEET - overhead;

  let body = description ?? '';
  if (body.length > bodyMax) {
    body = body.slice(0, Math.max(0, bodyMax - 1)).trimEnd() + '…';
  }

  return `${titleLine}\n\n${body}\n\n${url}`;
}

async function main() {
  const files = process.argv.slice(2).filter(Boolean);
  if (files.length === 0) {
    console.log('No files to process');
    return;
  }

  const required = ['TWITTER_APP_KEY', 'TWITTER_APP_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing required env var: ${key}`);
      process.exit(1);
    }
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

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

      console.log(`POST (${tweet.length} chars): ${file}`);
      console.log('---');
      console.log(tweet);
      console.log('---');

      const result = await client.v2.tweet(tweet);
      console.log(`OK: https://x.com/${TWITTER_HANDLE}/status/${result.data.id}`);
    } catch (err) {
      console.error(`FAIL: ${file}: ${err.message}`);
      if (err.data) {
        console.error('Twitter API response:', JSON.stringify(err.data, null, 2));
      }
      process.exitCode = 1;
    }
  }
}

main();
