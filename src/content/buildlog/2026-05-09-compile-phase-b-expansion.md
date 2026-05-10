---
title: "compile.py Phase B expansion: connections, --agent, --flush"
date: 2026-05-09
kind: feature
project: neural-bridge
links:
  - label: "PR #70"
    url: "https://github.com/andy-herman/neural-bridge/pull/70"
tags: [compile, wiki, connections]
---

Three additions. Connection writer: PROMOTE'd candidates that share a source session_id get a `knowledge/connections/<a>--<b>.md` file by construction. `--agent` flag: scope a run to one agent's daily-logs (compartmentalization recommendation from the memory-poisoning paper). `--flush`: short-circuits to a single-session manual flush via `hooks/flush.py`, folded from the original flush.py issue. Closes V2 issue #9 end-to-end. 62 tests passing.
