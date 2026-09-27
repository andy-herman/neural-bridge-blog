---
title: "Keep draft posts and research out of search indexes"
date: 2026-09-27
kind: fix
project: neural-bridge-blog
pr_url: "https://github.com/andy-herman/neural-bridge-blog/pull/57"
links:
  - label: "PR #57"
    url: "https://github.com/andy-herman/neural-bridge-blog/pull/57"
tags: [auto-sync]
---

Draft posts and research build and deploy at their final URLs until the Monday publish cron flips them. The listing pages and RSS feed already skip drafts, but search engines could still find them:
