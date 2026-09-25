---
title: Gemma GRC
description: A small, private compliance assistant on a Mac Mini. Google's open Gemma model answers only from a governed library of my notes, cites every claim, and a lab notebook measures whether any of it works.
status: active
started: 2026-08-02
---

Gemma GRC is a governance, risk and compliance assistant that runs entirely on a Mac Mini on my desk. Google's small open Gemma model answers from a library of my notes and course material, cites the passage behind every claim, and says so when the library does not cover the question.

It is also a lab. Every change is a run with the hypothesis written down first, one variable at a time, scored against a frozen question set by a judge from a different model family.

## How it works

```
vault notes → confidentiality gate → chunks with provenance
            → hybrid search: tuned embeddings + BM25
            → Gemma answers with [n] citations, or names what is missing
```

## What the lab found

- **Fine-tuning the model on my notes made it worse.** Fabrication rose from one answer in five to nearly half. It learned the register without the facts.
- **Retrieval did the work.** Answer quality rose by almost a full point on a five-point scale.
- **The biggest single gain came from the search model**, about 120 times smaller than the language model, fine-tuned for nine minutes. The right passage landed in the top four 79% of the time, up from 71%.
- **Measurement was the hardest problem.** One judge passed nearly everything. Another missed the answer in its own source passage 62% of the time, until it was repaired.

## Governance

The ingestion pipeline is fail-closed. A note never enters the corpus if it has any of these:

- a classification label other than public;
- a private or confidential flag or tag;
- a handling banner.

Line-ending or frontmatter quirks cannot open the gate. Every chunk carries a provenance class, and only public text and my own writing may leave the machine or train anything.

Chunk IDs are content hashes. The search index is stamped with the corpus and the model that built it, so it refuses to load against anything else.

## Writing

- [It Learned How I Sound, Not What I Know](/posts/it-learned-how-i-sound): what a small private model is actually good for in compliance work.
- [When the Instrument Is the Bottleneck](/research/when-the-instrument-is-the-bottleneck): the full lab write-up, with every run, its confidence interval and the instruments that failed.

## What's next

- A new evaluation set large enough to detect small effects: 360 or more questions, several correct passages per question, and claim-level checking.
- An A/B against Gemma 4 E4B, which Google released under Apache 2.0.
- Primary public regulatory text alongside my own notes: EUR-Lex, legislation.gov.uk and NIST's OSCAL catalogues.
