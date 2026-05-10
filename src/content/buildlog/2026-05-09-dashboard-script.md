---
title: "Dashboard script: dated markdown reports from gh data"
date: 2026-05-09
kind: feature
project: neural-bridge
links:
  - label: "PR #72"
    url: "https://github.com/andy-herman/neural-bridge/pull/72"
tags: [tooling, reporting]
---

`scripts/dashboard.py` pulls GitHub state (open issues, recent PRs, label counts, kanban column placement) and writes a dated markdown report. Useful as input to senior-pm's weekly summary and as a snapshot I can drop into the vault. No new infra; just structured output from the data that's already there.
