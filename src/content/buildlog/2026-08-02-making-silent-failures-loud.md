---
title: "Making silent failures loud: Honcho capture, in-flight mentions, dead links"
date: 2026-08-02
kind: hardening
project: neural-bridge
links:
  - label: "Commit 0836967 (Honcho warnings)"
    url: "https://github.com/andy-herman/neural-bridge/commit/0836967"
  - label: "Commit 025ceb3 (in-flight mention recovery)"
    url: "https://github.com/andy-herman/neural-bridge/commit/025ceb3"
  - label: "Commit 23e81fd (link lint)"
    url: "https://github.com/andy-herman/neural-bridge/commit/23e81fd"
tags: [observability, hardening, silent-failure, honcho]
---

Three fixes in one day, all the same shape: something had been broken for weeks while the code looked healthy.

The Neural Bridge to Honcho capture path had been dead from May 27 to Aug 2. Failures were swallowed at debug level, so one agent sat frozen at ten stored messages while every log line said fine. Failures now surface at warning, and the first successful submit in a process logs at info, so the logs positively confirm the path works instead of merely not complaining.

A bot restart twelve seconds into a handoff killed the in-flight call with no reply, no retry, and no trace. Mentions are now registered in `scripts/.inflight_mentions.json` and cleared on completion; anything left over at startup gets a short notice posted to the affected channel by the owning agent, so the person who asked knows to re-send.

Plus fourteen broken-link lint findings cleared and the Honcho integration docs refreshed to match reality.

The pattern is worth naming, because it showed up three separate times in two days across three unrelated subsystems. Degrading to a quiet no-op keeps a daemon from crashing, and it is the correct local decision every time. Stacked together, they build a system that can lose most of its function and never say a word. Log the degradation.
