---
title: "Luna's memory was discarding her own rules to keep a changelog"
date: 2026-08-01
kind: fix
project: neural-bridge
links:
  - label: "Commit 4de8ca2"
    url: "https://github.com/andy-herman/neural-bridge/commit/4de8ca2"
tags: [agent-memory, context-engineering, silent-failure]
---

Luna keeps a working-memory file in the vault that the daemon injects into every prompt. There is an 8,000 character cap, and the injector kept the tail of the file on the assumption that a notes file is a log where the newest entries sit at the bottom.

It was not a log. It had grown to 16,089 characters and was organized as a constitution with a changelog stapled underneath: standing preferences, voice notes, and a section titled "Decisions Andy has made that I should honor" at the top, an append-only session log at the bottom. Keeping the tail meant every turn handed her the changelog and threw away every rule above it. She had been reading a list of which pull requests merged in May instead of the sixteen decisions she was supposed to honor.

The fix is a section-aware budget rather than a bigger cap, because a bigger cap fails later and just as quietly. Rolling-log sections are dropped first and durable ones are never dropped, and any trim at all now emits a warning. That warning is the actual repair. The arithmetic was a bug; the silence was the defect, and every layer of that memory stack was written to return an empty string on failure, which is how a system can lose most of its memory and never once say so.
