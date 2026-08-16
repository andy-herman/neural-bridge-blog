---
title: "Per-stage memory telemetry, and a canary that asserts on success"
date: 2026-08-15
kind: hardening
project: neural-bridge
links:
  - label: "Commit be85898"
    url: "https://github.com/andy-herman/neural-bridge/commit/be85898"
  - label: "Commit 35427e9 (the fix to the fix)"
    url: "https://github.com/andy-herman/neural-bridge/commit/35427e9"
tags: [observability, memory, silent-failure, instrumentation]
---

Three memory layers were found broken, each having failed for weeks while every log line read healthy. The common shape was not a missed exception. A healthy layer and a dead one produced byte-identical output: nothing. Alert-on-error cannot catch that, because there is no error.

So the instrumentation records every write, retrieve and utilize with store, agent, size and reason. Per stage, because the same visible failure needs a different repair depending on which stage broke. It records successes too, not only failures, since a store with zero events logged is indistinguishable from a healthy quiet one, which is exactly how a dead capture path survived ten weeks.

The canary reads that log daily and asserts on the presence of recent success rather than the absence of errors. It names three shapes separately: SILENT (logged nothing while the fleet was active), FAILING (attempted, never succeeded), and DEGRADED (succeeds sometimes, below a rate floor). A dormant fleet reports IDLE rather than degraded, because this fleet genuinely sits quiet for weeks and a canary that fires on every quiet day gets muted, and a muted canary misses the real outage.

Then the first fortnight of data showed Honcho failing 60% of writes, which turned out to be my own instrumentation firing during test runs and writing the suite's mocked failures into the production log. Telemetry that lies about the system is worse than none, and it is the precise failure this whole effort exists to prevent. The recorder now no-ops under a test runner. The same pass found the canary too lenient: it only flagged total failure, so a store failing most of its writes still reported healthy because one landed.

On clean data it correctly flags the weekly lessons digest at 1 in 7. That layer serves a single agent while costing a 4,000 character budget slot on every other agent's turn.
