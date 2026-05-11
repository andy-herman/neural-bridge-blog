---
title: "Add Korean sidecar for prompt-injection-as-compliance-risk"
date: 2026-05-11
kind: note
project: neural-bridge-blog
pr_url: "https://github.com/andy-herman/neural-bridge-blog/pull/45"
links:
  - label: "PR #45"
    url: "https://github.com/andy-herman/neural-bridge-blog/pull/45"
tags: [auto-sync]
---

Generates the Korean translation for the June 1 prompt-injection article ahead of time so the 한국어 toggle works on day one and we avoid betting on the May 31 Sunday-prep cron hitting a clean `claude -p` invocation.
