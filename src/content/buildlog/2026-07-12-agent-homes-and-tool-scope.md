---
title: "Agent vault homes consolidated, and a documented Bash exemption"
date: 2026-07-12
kind: note
project: neural-bridge
links:
  - label: "Commit c42ef8f (vault homes)"
    url: "https://github.com/andy-herman/neural-bridge/commit/c42ef8f"
  - label: "Commit 20f8e8d (Bash exemption)"
    url: "https://github.com/andy-herman/neural-bridge/commit/20f8e8d"
tags: [agents, vault, tool-permissions]
---

Agent home folders moved under a single `Agents/` parent in the vault, with casing normalized so the directory names actually agree with each other. The charters, the daemon path constants, and the folders on disk are now consistent, which they were not: one agent's charter pointed at a path that had been renamed underneath it.

Separately, a policy test that asserted no agent may hold `Bash` in mention mode had been failing since the career-strategist agent legitimately gained it. That agent runs a journal CLI as its core function, so the grant is deliberate and scoped. The test now carries a single documented exemption with the reason attached, rather than sitting red and teaching everyone to ignore a red suite. An assertion that is expected to fail is not a test, it is a comment.
