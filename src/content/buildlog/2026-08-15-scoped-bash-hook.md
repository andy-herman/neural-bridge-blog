---
title: "Scoping an agent's shell before granting it"
date: 2026-08-15
kind: hardening
project: neural-bridge
links:
  - label: "Commit c0b0656 (the hook)"
    url: "https://github.com/andy-herman/neural-bridge/commit/c0b0656"
  - label: "Commit 2c292a3 (the grant)"
    url: "https://github.com/andy-herman/neural-bridge/commit/2c292a3"
tags: [security, hooks, permissions, agents]
---

Luna needed shell access to reach her calendar and inbox CLIs. Granting Bash grants the entire shell, which is a far larger permission than "read my calendar", so the constraint shipped first and the grant second. The permission was narrow from its first minute rather than retrofitted later.

The distinction that matters: `--allowedTools` auto-approves a tool, it does not constrain what the tool is asked to do. Bash on that list means any command. A PreToolUse hook returning exit 2 is the only mechanical enforcement point.

It has to be per-agent, because hooks fire for every headless session launched from the repo. One allowlist shaped for Luna would have broken the career agent's database CLI and the loop engineer's test runner. The daemon now stamps an agent id into the subprocess environment, in exactly one place: a call site that forgot it would silently hand an agent the whole shell.

Chaining, redirection and substitution are rejected before matching. Without that, appending a semicolon and a destructive command to an allowed one passes a prefix check. Fourteen of the thirty-two tests are attempts to defeat it that way.

The fail-open is stated rather than hidden: an unstamped process is an interactive human session and is not constrained, because constraining it would break ordinary work in the repo.

Verified through the real harness rather than only in tests. Asked to run `ls /tmp` as Luna, the command was blocked, never executed, and the model was told why. Asked to run her own calendar CLI, it reached the CLI, which then failed closed with a clear message and a pointer to the setup doc.

The same commit removed eighteen hand-enumerated connector tool names from her allowlist. None of them had ever resolved. A test now fails if any agent lists one again.
