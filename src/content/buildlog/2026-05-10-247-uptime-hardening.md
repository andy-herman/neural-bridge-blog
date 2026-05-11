---
title: "True 24/7 uptime: caffeinate wrapper + auto-reload watcher + rotating logs"
date: 2026-05-10
kind: hardening
project: neural-bridge
links:
  - label: "PR #82 (caffeinate)"
    url: "https://github.com/andy-herman/neural-bridge/pull/82"
  - label: "PR #84 (auto-reload)"
    url: "https://github.com/andy-herman/neural-bridge/pull/84"
  - label: "PR #83 (rotating logs)"
    url: "https://github.com/andy-herman/neural-bridge/pull/83"
tags: [launchd, daemon, hardening]
---

Three reliability moves on the Discord daemon. `caffeinate -s -i` wraps the launchd entry so the Mac never silently sleeps the daemon's process tree even with `pmset` already configured. An auto-reload watcher runs every two minutes: `git pull main`, and if anything new landed, the daemon restarts itself. A rotating-file logger caps individual log files at 10 MB with seven backups, ceiling around 70 MB total, no more unbounded log growth on the Mac Mini.
