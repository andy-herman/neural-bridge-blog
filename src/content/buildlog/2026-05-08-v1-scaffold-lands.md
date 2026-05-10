---
title: "V1 scaffold lands: plugin marketplace, three specialist agents, wiki skeleton"
date: 2026-05-08
kind: milestone
project: neural-bridge
links:
  - label: "neural-bridge repo"
    url: "https://github.com/andy-herman/neural-bridge"
tags: [v1, scaffold, plugin-marketplace]
---

The first version of Neural Bridge ships as a Claude Code plugin marketplace. Three specialist agents (research, teaching-prep, content) live in `plugins/neural-bridge-core/agents/`, the wiki skeleton is in `knowledge/`, and ADRs cover the early design decisions. The hooks and compile pipeline are stubs at this point — the substrate is real but not yet alive.
