---
title: Bellwether
description: A private compliance assistant for DORA, the UK Critical Third Parties regime and NIS2. Sixteen regulator personas score draft submissions, and an RFI reuse engine checks whether a prior answer still holds before a person approves it.
status: active
started: 2026-06-20
tagline: Reuse approved answers to regulators, after checking they still hold.
featured: 2
---

Bellwether is a private compliance assistant for operational-resilience regulation: DORA, including its oversight of critical ICT third parties, the UK Critical Third Parties regime and NIS2. It is not open source.

The main feature is RFI reuse. When a regulator's Request for Information arrives, Bellwether finds answers I have already approved that cover the same ground, then checks that each one is still true before a person can approve it again. Alongside that, sixteen regulator personas and a chief compliance officer (CCO) meta-assessor score draft submissions against primary regulatory text. Claude drafts; a model from a different family does the checking. All demo and calibration data uses a fictional firm.

## How it works

<figure class="not-prose my-10">
<a href="/images/projects/bellwether-data-flow-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/bellwether-data-flow-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/bellwether-data-flow-light.svg" alt="Bellwether data flow. Regulations, guidance and supervisor statements for DORA, the UK Critical Third Parties regime and NIS2 are parsed, deduplicated, embedded on the machine and stored by regime. A regulator&#x27;s request for information is matched against approved answers in the same regime. With no real match, a fresh draft is written from the corpus with gaps listed. An exact or partial match passes an age gate; old, event-driven or undated answers are re-grounded on the current corpus by an independent judge. A stale claim, missing evidence or a judge error blocks reuse and names the stale claim. Every path ends with a person confirming the answer is accurate as of today, and approved answers return to the library with a 12-month review-by date." width="799" height="1341" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">The regulatory corpus and RFI reuse · <a href="/images/projects/bellwether-data-flow-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a></figcaption>
</figure>

Regulatory documents enter the corpus through a duplicate check, are chunked and embedded on-device by a small ONNX model, and are stored in a private vector database tagged by framework. RFI reuse checks answers against that corpus.

An incoming RFI question is embedded locally and matched against the library of approved answers, searching only within its own regime. The top similarity score routes it to exact, partial or no overlap, with no LLM in that step. Exact and partial matches go through the staleness guardrail, which marks each answer blocked or reusable. Claude then drafts: the prior answer for an exact match, a reuse-and-gap map for a partial one, or a fresh draft from the corpus with gaps listed when nothing matches. Nothing is sent automatically. A person has to tick "confirm accurate as of today" before Use or Approve is enabled, and an approved answer goes back into the library with a 12-month review-by date.

Submission scoring runs separately. All 16 personas, each modelled on a different regulator, score a draft in parallel at temperature zero. Each score maps to one of five ordinal bands, and the scores combine as a weighted mean: EU-level regulators count 1.5 times as much as national ones, and a persona that fails is left out. The CCO then writes the synthesis.

## The staleness guardrail

The first stage is a deterministic age gate. Each answer gets a volatility class with its own time-to-live: 90 days for org structure and metrics, 365 days for policy and forward commitments. The gate escalates an answer that is over its time-to-live, in an event-driven class, of unknown age, or past its review-by date. Anything else is reusable without the more expensive second stage.

The second stage runs on escalated answers. A judge from a different model family re-grounds the answer against the current corpus for its regime, claim by claim, at temperature zero. A forward commitment whose date has passed counts as stale. If the corpus returns nothing for the regime, or the judge errors or replies empty, the check fails closed.

Only a claim found stale blocks reuse. A claim the judge cannot verify is marked unverified and never blocks on its own. The guardrail is advisory: it explains its verdict and leaves the decision to a person.

## What calibration found

I calibrate the guardrail on labelled prior answers, each marked fresh or stale with a reason, in three sets: clean, adversarial and borderline. The latest run, on 2026-08-15 with the current judge, covered 69 answers.

- **Overall, it catches almost every stale answer.** Catch rate 97.2%, false-fresh rate 3.1%, flag precision 94.6%.
- **One set still misses the bar.** On the clean set alone the false-fresh rate is 11.1%, above the 5% I set before automatic regeneration can be switched on. That feature is coded and off.
- **The first version over-flagged.** It blocked reuse on facts it could not verify, and precision on the adversarial set was 61%. Once an unverified claim could no longer block on its own, it rose to 92%.
- **The router's perfect score says little yet.** It put all 12 demo cases in the right overlap tier, but it was tuned on those same 12.

The published post reports an earlier run from 2026-07-18, with a different judge and 63 answers: 97% catch, 3.7% false-fresh, 88.9% precision. The judge and the answer set have both changed since, so the two are not a clean comparison.

## Writing

- [Don't answer the regulator from a blank page](/posts/rfi-reuse-temporal-guardrails): how the reuse engine and its staleness guardrail work, and how I calibrated them.

## What's next

- Correct factual errors in some of the persona charters.
- Refresh the UK CTP corpus, which predates the first designations in July 2026.
- Build the data-collection engine for CSV and email import, with event-driven staleness. It is designed, not built.
- Tag chunks by sensitivity and add a zero-retention option.
