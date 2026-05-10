---
title: "compile.py Phase B core: rich concept writer + never-overwrite history"
date: 2026-05-09
kind: feature
project: neural-bridge
links:
  - label: "PR #67"
    url: "https://github.com/andy-herman/neural-bridge/pull/67"
tags: [compile, wiki, filing-gate]
---

A PROMOTE verdict now produces a real concept article instead of a slug-and-summary stub. Separate `claude -p` call after the gate decides, structured prose: intro, key points, how-we-use-it, open questions, related-concept wiki-links. Re-promoting an existing concept archives the prior version to `concepts/.history/<slug>/<timestamp>.md` first — audit trail the lint pass needs. Live runs append to `knowledge/log.md` and add wiki-links to `knowledge/index.md`. 47 tests passing.
