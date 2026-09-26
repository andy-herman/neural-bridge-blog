---
title: Gemma GRC
description: A small, private compliance assistant on a Mac Mini. An open Gemma model is told to answer only from a governed library of my notes, course material and primary public regulatory texts, and to cite the passage behind every claim. A lab notebook measures whether any of it works.
status: active
started: 2026-08-02
tagline: A private compliance assistant on a Mac Mini, and the lab that measures it.
featured: 1
---

Gemma GRC is a governance, risk and compliance assistant on a Mac Mini on my desk. Questions are answered locally, with no network connection. A small open Gemma model works from a library of my notes, course material and primary public regulatory texts. It is told to cite the passage behind every claim and to say so when the library does not cover the question. Those are prompt instructions rather than enforced checks; in one measurement it followed the citation instruction on 48 of 50 answers.

It is also a lab. Every change is a run with the hypothesis written down first, one variable at a time, scored against a frozen question set by a judge from a different model family.

<figure class="not-prose my-10">
<a href="/images/projects/gemma-grc-lab-loop-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/gemma-grc-lab-loop-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/gemma-grc-lab-loop-light.svg" alt="The lab loop: write the hypothesis first and make one change, run the frozen question set, have a judge from another model family score it, read confidence intervals against the noise floor, then write the run note and the next hypothesis." width="796" height="145" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">The lab loop · <a href="/images/projects/gemma-grc-lab-loop-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a></figcaption>
</figure>

## How it works

<figure class="not-prose my-10 lg:-mx-24">
<a href="/images/projects/gemma-grc-data-flow-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/gemma-grc-data-flow-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/gemma-grc-data-flow-light.svg" alt="Gemma GRC data flow. At build time, on the Mac with no model involved, my notes pass a fail-closed confidentiality gate; labelled, flagged or bannered notes are held back with the reason logged. Cleared notes are chunked and redacted, and join primary public regulatory sources, fetched with their licence recorded, in a stamped and fingerprinted index. At query time, with no network, the index is checked against its corpus and model, a hybrid dense and keyword search finds passages, and Gemma 3 4B answers only from them, citing each claim or naming what is missing." width="1194" height="673" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">Build time and query time · <a href="/images/projects/gemma-grc-data-flow-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a></figcaption>
</figure>

My notes pass a scope check and a fail-closed confidentiality gate, then are chunked, redacted and stamped with a content-hash ID and a provenance class: public, own, or other (local only). Public regulatory texts come in on a separate lane that accepts only official hosts over https and records each text's licence. The default library is 7,167 chunks: 1,178 from my notes and 5,989 from public texts.

At query time, hybrid search fuses BGE embeddings with BM25 and keeps the top eight passages. There is no reranker; one made results worse when I tried it. As many passages as fit a fixed budget go to Gemma 3 4B, running locally, which answers with a bracketed citation per claim or names what is missing.

## What the lab found

- **Fine-tuning a model on my notes made it worse.** On a 1B model, fabrication rose from one answer in five to nearly half. It learned the register without the facts.
- **Retrieval was the biggest gain.** Answer quality rose by almost a full point on a five-point scale. That was measured on an earlier setup; the current one has not been measured end to end yet.
- **The one fine-tune that paid off was the search model**, about 120 times smaller than the language model. Fine-tuned for nine minutes, it put the right passage in the top four 79% of the time, up from 71%. The version in use now is a later, longer retrain.
- **Measurement was the hardest problem.** One judge passed nearly everything. Another missed the answer in its own source passage 62% of the time, until it was repaired. Even repaired, it misses about one in five.

## Governance

The ingestion pipeline is fail-closed. A note never enters the corpus if it has any of these:

- a classification, sensitivity, marking, handling or TLP label other than public;
- a classification line at the top of the note;
- a private or confidential flag or tag;
- a handling banner.

Line-ending or frontmatter quirks cannot open the gate. The provenance class decides where a chunk may go: only public text whose licence allows it, and my own published writing, may leave the machine or train a model that could. The search model tuned in August predates the gate and stays on this machine.

Chunk IDs are content hashes. The search index is stamped with the corpus and the model that built it, so it refuses to load against anything else.

My first gate read private flags but not classification labels. A self-audit found labelled notes in the local library and test set. None were published; the fail-closed gate is the fix.

## Writing

- [It Learned How I Sound, Not What I Know](/posts/it-learned-how-i-sound): what a small private model is actually good for in compliance work.
- [When the Instrument Is the Bottleneck](/research/when-the-instrument-is-the-bottleneck): the full lab write-up, with every run, its confidence interval and the instruments that failed.

## What's next

The public-text lane was finished on 2026-09-25: 58 official sources, including EU acts through CELLAR (EUR-Lex blocks scripts), UK legislation from legislation.gov.uk and NIST's OSCAL catalogues. Still to do:

- A new evaluation set, being built now: 360 or more questions with several correct passages each, candidates pooled from four retrievers and graded by a two-judge jury, with me adjudicating blind. Claim-level judging is a later phase and not built yet.
- An end-to-end re-baseline of the stack as it ships today.
- An A/B against Gemma 4 E4B, with Granite as a control.
- A fix for date questions. In the first canary checks the retriever found the right passage for 5 of 8 questions, and both AI Act date questions missed the article that sets when the Act applies. The model supplied a stale date, in one case citing passages with no date in them.
