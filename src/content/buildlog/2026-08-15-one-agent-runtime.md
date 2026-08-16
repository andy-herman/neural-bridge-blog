---
title: "Four copies of the same pipeline, collapsed into one"
date: 2026-08-15
kind: release
project: neural-bridge
links:
  - label: "Commit 506cf6b"
    url: "https://github.com/andy-herman/neural-bridge/commit/506cf6b"
tags: [refactor, agents, architecture]
---

Every surface that talked to an agent ran its own copy of the same sequence: read the mention template, load the charter, build the prompt, get or create a session, look up tools and timeout and effort, call the model, retry once if the resume failed, touch the session, truncate the reply. Four copies existed, across the Discord daemon and three Telegram bridges, and the comments in them admitted it out loud: "mirrors handlers.py pattern", "Mirrors luna_bridge.py for plumbing".

Copy number four is how drift starts. Adding a single per-agent effort flag the day before meant threading the same change through three files by hand, and one of them was missed on the first pass.

`run_agent_turn` is now the only copy. Net 174 lines deleted. Two knobs keep the council room honest rather than forcing a fifth variant: a model override, and a stateless mode where each turn is rebuilt from the shared transcript so there is no session to resume and a failure must not trigger the retry.

What stayed with each transport is what genuinely differs: chunking, structured action and attachment parsing, delivery, and the memory-capture call, which sits after a confirmed successful send so it never fires for a reply nobody saw. Discord takes the untruncated output because it parses action blocks before anything is trimmed.

Twelve new tests cover the behaviors that used to live in four places: retry exactly once, never retry a fresh session, stateless skips the session store entirely, prefix prepending, and the model override. The live daemon was restarted onto the refactor rather than trusting the suite alone.
