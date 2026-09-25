---
title: "Gemma GRC: a fail-closed gate on what the corpus may contain"
date: 2026-09-25
kind: hardening
project: gemma-grc
links:
  - label: "Project page"
    url: "/projects/gemma-grc"
tags: [gemma-grc, governance, data-classification, provenance, testing]
---

The ingestion gate used to recognise one marking convention. A notes vault accumulates several, so the gate is now fail-closed. A note with any of these never enters the corpus:
- a classification label other than public;
- a private or confidential flag or tag;
- a handling banner near the top;
- a `Classification:` header line.

Two details mattered more than the rules. A note saved with Windows line endings would have defeated the frontmatter match and walked straight past the labels, so line endings and malformed frontmatter are normalised before the gate reads anything. And banner matching has to tell a marking from a topic: "Restricted transfers" and "Confidential computing" are headings, not labels.

Every chunk now carries a provenance class. Only public text and my own writing may reach a cloud teacher, and the cloud path is fail-closed: a corpus without the flag sends nothing.

Chunk IDs are content hashes, so a re-ingest cannot silently re-point evaluation labels.

The search index is stamped with the corpus and the model that built it. Loading an old index against the wrong embedding model used to fail silently. It now refuses, with a cosine of 0.59 as the evidence.

There are 26 tests. Turning the classification check off makes six of them fail. An independent scan, written separately from the gate, finds no marked note in the build.
