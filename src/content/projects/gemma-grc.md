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
- **Retrieval was the biggest gain, and the end-to-end baseline confirms it.** On 589 test questions (Run 011), 82% of claims were supported by a right passage, against 23% when the same model answered from memory. With the library it declines 57% of the questions it cannot answer; from memory, 3.5%.
- **The one fine-tune that paid off was the search model**, about 120 times smaller than the language model. Fine-tuned for nine minutes, it put the right passage in the top four 79% of the time, up from 71%. The version in use now is a later, longer retrain.
- **Measurement was the hardest problem.** One judge passed nearly everything. Another missed the answer in its own source passage 62% of the time, until it was repaired. Even repaired, it misses about one in five.
- **The grader needed as much testing as the model.** The first scoring of that baseline judged an answer's opening line as an unsupported claim and read canary dates too literally. Fixed and rescored, answers with an unsupported claim fell from 36% to 25%, and most of what remains is a single sentence of commentary.
- **Prompt wording did not fix refusals.** Telling the model to check that the passages answer the exact question raised refusals by 3.5 points on 227 questions the library cannot answer, an interval that includes zero. A quoted refusal sentence was worse: the 4B model opened nearly every answer with it, then answered anyway.

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
- [The Law Moved in July. My Assistant Didn't.](/posts/the-law-moved-in-july): the library of primary texts, the test set and the canaries for facts that changed in 2026.
- [Before I Fixed the Model, I Had to Fix the Grader](/posts/fixed-the-grader-first): the first end-to-end baseline, the grader's faults and the prompt experiments.

## What's next

Done since the public-text lane was finished on 2026-09-25:
- a 749-question test set with several correct passages per question;
- an end-to-end baseline;
- a router for questions about when rules apply, after which both AI Act date canaries pass;
- claim-level judging, tested on 272 controls before use;
- two prompt experiments.

Still to do:

- My blind audit of 100 graded pairs, then freezing the test set.
- An A/B against Gemma 4 E4B behind the same library, running now. Granite as a control comes after.
- Fewer answers to questions the library cannot answer, and tighter citations.
- Retrieval: stemming for keyword search, an embedding trial and a clean retrain of the search model.
