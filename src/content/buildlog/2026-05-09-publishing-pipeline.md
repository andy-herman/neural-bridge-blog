---
title: "Publishing pipeline online: Sunday prep, Monday publish"
date: 2026-05-09
kind: release
project: cross-cutting
links:
  - label: "PR #64 (Sunday prep job)"
    url: "https://github.com/andy-herman/neural-bridge/pull/64"
  - label: "PR neural-bridge-blog#3 (cron reschedule)"
    url: "https://github.com/andy-herman/neural-bridge-blog/pull/3"
tags: [publishing, content, launchd, automation]
---

Weekly cadence wired up. Sunday 18:00 PT a launchd job picks the next queued draft, generates a LinkedIn variant via `claude -p` against my actual voice corpus, and posts a Discord brief listing the three artifacts (blog body + LinkedIn variant + X draft) for my Sunday/Monday review. Monday 18:00 PT a GitHub Actions cron flips `draft: true` → published; Vercel auto-deploys. Most of the plumbing was already wired before I noticed; the gap was the cadence and the LinkedIn voice generation.
