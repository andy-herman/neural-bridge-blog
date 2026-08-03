---
title: "The loop engineer: an agent that claims its own issues and opens draft PRs"
date: 2026-07-12
kind: feature
project: neural-bridge
links:
  - label: "PR #159 (first autonomous PR)"
    url: "https://github.com/andy-herman/neural-bridge/pull/159"
  - label: "PR #161 (written by the loop itself)"
    url: "https://github.com/andy-herman/neural-bridge/pull/161"
  - label: "Runbook"
    url: "https://github.com/andy-herman/neural-bridge/blob/main/docs/LOOP_ENGINEER.md"
tags: [autonomous-agents, loop-engineering, worktree, verification]
---

The squad-discussion pipeline has been filing GitHub issues for months, and nothing consumed them. `scripts/loop_engineer/` closes that loop: a separate launchd daemon polls for `agent-ready` issues, claims one via an atomic GitHub label swap, implements it in a per-issue `git worktree` with a fresh `claude -p` session, and opens a draft PR. Worktree isolation matters because the daemon shares one clone with an auto-reload watcher, and a loop switching branches underneath it would corrupt that view.

Three gates decide whether a PR opens, and all of them are computed by the daemon rather than self-reported by the agent: existing tests may not be edited or deleted, the diff must stay under a line cap, and the change must introduce no new test failures against a baseline measured on the clean checkout before the agent touches anything. That last one is deliberate. The repo baseline is not green, so an absolute pass would have rejected every issue forever. Budget ceilings per run, per day, and per attempt are the kill switch.

It ran end to end twice. The second time it implemented a `--status` flag for its own queue, added a test for it, and opened PR #161.
