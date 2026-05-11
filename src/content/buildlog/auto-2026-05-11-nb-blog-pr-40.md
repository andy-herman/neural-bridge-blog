---
title: "Skip Korean sidecars + dedupe against existing open issues"
date: 2026-05-11
kind: fix
project: neural-bridge-blog
pr_url: "https://github.com/andy-herman/neural-bridge-blog/pull/40"
links:
  - label: "PR #40"
    url: "https://github.com/andy-herman/neural-bridge-blog/pull/40"
tags: [auto-sync]
---

Today's content-cleanup wind-down generated **12 spurious tweet-draft issues** because the tweet-on-publish workflow re-emitted drafts every time an already-published article was modified in place (em-dash sweep, editorial pass) and treated Korean sidecar files as separate publishes despite the inline-toggle…
