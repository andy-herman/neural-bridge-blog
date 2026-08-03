---
title: "Per-agent effort levels: stop paying for reasoning nobody asked for"
date: 2026-08-01
kind: feature
project: neural-bridge
links:
  - label: "Commit 4de8ca2"
    url: "https://github.com/andy-herman/neural-bridge/commit/4de8ca2"
tags: [claude-5, cost, context-engineering]
---

The Claude 5 generation models think by default, and effort is a dial with five positions from `low` to `max`. The daemon was not setting it, so every turn ran at the default depth. Asking an assistant what is on the calendar was allocated the same reasoning budget as a threat model.

The fleet now carries an effort policy, one line per agent: `low` for conversational work and routing, `medium` for drafting and editing, `high` for research, security review, and PM triage. The autonomous coding loop runs at `high` and is the only thing in the house that has earned it. Invalid values are dropped rather than forwarded, because the CLI would warn and silently fall back, and a typo should not quietly change behavior.

Verified against the live path rather than assumed. Worth noting for anyone routing a fleet through a proxy: `claude-opus-5` is advertised by the Copilot endpoint but fails there with an assistant-prefill error, so the obvious upgrade would have taken every agent offline. The fleet stayed on 4.8.
