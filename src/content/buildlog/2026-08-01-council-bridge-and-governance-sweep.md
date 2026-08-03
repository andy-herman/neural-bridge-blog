---
title: "Council bridge committed, and a rule that contradicted itself"
date: 2026-08-01
kind: note
project: neural-bridge
links:
  - label: "Commit 0b44385 (council bridge)"
    url: "https://github.com/andy-herman/neural-bridge/commit/0b44385"
  - label: "Commit 9c3a553 (em-dash sweep)"
    url: "https://github.com/andy-herman/neural-bridge/commit/9c3a553"
tags: [agents, telegram, governance]
---

The council bridge puts both advisors, one on Claude and one on a separate runtime, in a single Telegram room with a cheap router deciding who should answer each message. Twenty kilobytes of finished code had been sitting untracked for three weeks, one accidental delete from gone, so it is committed now. Committing is not activating: it still needs the manual bot setup steps, and the launchd job stays out of the installer until those are done.

The other half is smaller and more embarrassing. There is a hard no-em-dash rule for everything these agents write, stated plainly inside the persona file. The governing documents around it contained nine em-dashes in one charter and ten in another. The rule was arriving alongside twenty counter-examples on every single read. The sweep script now takes a path so it can run against any agent's files, with an exclusion for the one legitimate case: the line that states the rule has to be able to show the character.

Output was already clean. The inputs were not, which is a reminder that context is not only what you tell a model, it is everything you hand it while telling.
