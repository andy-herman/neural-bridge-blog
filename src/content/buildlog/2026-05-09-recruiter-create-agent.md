---
title: "Recruiter `create_agent` action: agents can spawn agents"
date: 2026-05-09
kind: feature
project: neural-bridge
links:
  - label: "PR #62"
    url: "https://github.com/andy-herman/neural-bridge/pull/62"
tags: [recruiter, automation, multi-agent]
---

The recruiter agent can now provision new specialist agents end-to-end. Emit a structured `create_agent` action and the daemon writes the plugin file, updates `KNOWN_AGENTS` in two places, bumps the plugin version, branches, commits, pushes, and opens a PR. Manual Discord-side steps (token, application, invite) stay with me on purpose — those involve secrets that should not be automated.
