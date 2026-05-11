---
title: "Discord orchestrator goes live with nine specialists"
date: 2026-05-09
kind: milestone
project: neural-bridge
links:
  - label: "PR #59 (action protocol)"
    url: "https://github.com/andy-herman/neural-bridge/pull/59"
  - label: "PR #60 (cross-agent handoff)"
    url: "https://github.com/andy-herman/neural-bridge/pull/60"
tags: [discord, orchestrator, multi-agent]
---

Nine bot identities, one daemon, one asyncio loop. Mention any agent in `#neural-bridge` and the right specialist responds. Agents can emit a structured `actions` JSON block to file issues, comment, label, close, no Bash, no shell, audit trail per call. Cross-agent handoff via @-mention propagation, capped at five turns per Andy-initiated thread to prevent runaway chains.
