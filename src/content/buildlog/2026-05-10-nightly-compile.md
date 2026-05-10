---
title: "Nightly compile job at 03:00 daily"
date: 2026-05-10
kind: feature
project: neural-bridge
links:
  - label: "PR #79"
    url: "https://github.com/andy-herman/neural-bridge/pull/79"
tags: [compile, launchd, automation]
---

The compile pass now runs unattended at 03:00 PT daily under launchd. Reads the new daily-logs since the last successful run, runs each candidate through the filing gate, calls the rich writer for PROMOTEs, archives any prior versions, surfaces shared-session connections, refreshes log.md and index.md, posts the Discord summary. The wiki is now a self-growing system; I just have to do work, and the substrate compiles overnight.
