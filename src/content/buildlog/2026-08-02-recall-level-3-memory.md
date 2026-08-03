---
title: "recall.py: local semantic search over sessions, decisions, and daily logs"
date: 2026-08-02
kind: feature
project: neural-bridge
links:
  - label: "Commit 8f6028c"
    url: "https://github.com/andy-herman/neural-bridge/commit/8f6028c"
tags: [memory, semantic-search, local-first]
---

Level 3 of the memory framework was deferred for months and is now filled. `recall.py` indexes vault Sessions, Memory, Daily notes and Meetings, the repo's `knowledge/`, daily logs and decisions, and Claude Code's own memory store, then answers semantic queries over all of it from one CLI.

It runs entirely on the machine: ChromaDB with a bundled ONNX MiniLM, the same local-only stack already used in Bellwether. Nothing is sent anywhere, which is the whole point given the index spans meeting notes and personal daily logs. Indexing is incremental against an mtime manifest, and near-empty template sections are filtered and deduped at index time so a folder of half-filled note templates does not drown the results. The database under `data/recall/` is gitignored and stays machine-local.

Queried through a user-level skill, so asking what was decided about something reaches three weeks of context that no longer fits in a conversation.
