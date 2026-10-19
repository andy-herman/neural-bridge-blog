---
title: Bellwether
description: A private compliance workbench for DORA, the UK Critical Third Parties regime, NIS2, and the Korea Network Act. Combines regime-isolated RFI reuse, a fail-closed cross-family staleness guardrail, an independence-discounted Data Hub semantic layer, 4-route multi-question engagement triage, and 19 regulator personas.
status: active
started: 2026-06-20
tagline: Closed-loop regulatory RFI reuse, temporal staleness guardrails, and canonical fact verification across DORA, UK CTP, NIS2, and Korea.
featured: 2
---

Bellwether is a private regulatory verification, RFI historical reuse, and supervisory submission workbench for Critical Third Party Providers (CTPPs) operating under **DORA**, the **UK Critical Third Parties (UK CTP)** regime, **NIS2**, and South Korea's **Information and Communications Network Act (Korea Network Act)**. It is not open source.

Bellwether is built on four integrated pillars:
1. **RFI Reuse Engine & 4-Route Engagement Workbench (`src/rfi_reuse/`):** Matches single questions or 20-to-50 question supervisory packs against a regime-isolated vector library, classifies every item into **Routes A / B / C / D** (with an **Incident Path gate** and a **Route D legal privilege lock**), runs a **Fail-Closed Temporal Staleness Guardrail** on an independent model family, and exports submissions with a **W3C PROV-JSON Evidence Appendix**.
2. **The Regulatory Semantic Layer - Data Hub (`src/data_hub/`):** Scores canonical golden facts with independence-discounted corroboration (`derived_from` root-ancestor deduplication) and additive human verification uplift, injects golden facts into the staleness judge, scans the corpus for self-contradictions, and automatically flags dependent RFI answers stale when a canonical fact changes.
3. **19-Regulator Sufficiency Panel (`src/orchestrator/`, `src/personas/`):** Nineteen supervisory personas (8 DORA, 3 UK CTP, 5 NIS2, and 3 Korea Network Act: MSIT, KISA, and KCC/PIPC) plus a Chief Compliance Officer (CCO) synthesizer evaluate drafts against primary statutory text.
4. **3-Ring Evidence Narrative, Firm Voice & Korea Art. 45-3 Governance (`src/narrative/`, `src/voice_agent/`, `src/korea/`):** Drafts, challenges (against 35 principles), and promotes long-form submissions with Evidence Ring (`Ring 1/2/3`) watermarks, alongside dedicated UK CTP Box 2 Self-Assessment and Korea Article 45-3 Local Security Committee (8 statutory topics + subsidiary entity separation) portals.

<figure class="not-prose my-10">
<a href="/images/projects/bellwether-v3-architecture-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/bellwether-v3-architecture-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/bellwether-v3-architecture-light.svg" alt="Bellwether v3.0 closed-loop architecture connecting the Data Hub Semantic Layer, Multi-Question 4-Route Engagement Workbench, Fail-Closed Temporal Staleness Guardrail, Role-Routed Gemini 4 Argon and Claude 5.5 models, and Universal Library Promotion." width="960" height="720" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">Bellwether v3.0 closed-loop architecture · <a href="/images/projects/bellwether-v3-architecture-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a></figcaption>
</figure>

## Writing

- [Bellwether v3.0: From Single-Question RFI Triage to a Closed-Loop Regulatory Workbench](/posts/bellwether-v3-closed-loop-regulatory-workbench): the full system audit, Gemini 4 Argon role routing, User vs. Admin UX split, 3D Blender regulation emblems, and Phases 1-3 buildout (Data Hub, 4-Route Engagement Pack, Korea Art. 45-3 Portal, and 4-Regime Crosswalk).
- [Don't answer the regulator from a blank page](/posts/rfi-reuse-temporal-guardrails): how the reuse engine and its staleness guardrail work, and how I calibrated them.
- [The law moved in July](/posts/the-law-moved-in-july): what happened when two contradictory UK CTP designation briefs lived in the same corpus, and why corpus self-contradiction scanning matters.
- [Green for ten weeks](/posts/green-for-ten-weeks): calibrating the independence-discounted Data Hub trust equation on the 18-case GShoe benchmark.

## How it works

<figure class="not-prose my-10">
<a href="/images/projects/bellwether-data-flow-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/bellwether-data-flow-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/bellwether-data-flow-light.svg" alt="Bellwether data flow. Regulations, guidance and supervisor statements for DORA, the UK Critical Third Parties regime and NIS2 are parsed, deduplicated, embedded on the machine and stored by regime." width="799" height="1341" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">The regulatory corpus and RFI reuse pipeline · <a href="/images/projects/bellwether-data-flow-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a></figcaption>
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

## Shipped in v3.0 (October 2026)

- **Multi-Model Role Routing & Gemini 4 Argon:** Role-scoped routing across `author` (`gemini-4-argon` / `claude-opus-5-5`), `judge` (`gemini-2.5-pro`), `eval` (`gemini-3.1-pro-preview` / `claude-sonnet-5-5`), and `fast/scan` (`gemini-3.8-flash`), with ephemeral prompt caching and an in-memory ONNX embedding LRU cache.
- **Regulatory Semantic Layer (Data Hub) & Corpus Contradiction Scanner:** Live independence-discounted trust scoring across canonical facts (`100%` accuracy on the 18-case GShoe benchmark), direct injection of golden facts into the staleness judge, and automatic cross-regime `ResponseLibrary.flag_stale()` propagation.
- **Multi-Question Engagement Pack & 4-Route Triage (`Routes A/B/C/D`):** Upload 20-to-50 question packs, screen for active incident reporting clocks, lock privileged Route D legal items from indexing, repair stale claims inline, and export submission packages with a **W3C PROV-JSON Evidence Appendix**.
- **Korea Network Act (`KOREA_NETWORK_ACT`) & Art. 45-3 Committee Portal:** Three dedicated Korean supervisory personas (`MSIT`, `KISA`, `KCC/PIPC`), subsidiary entity separation, an 8-topic Local Information Security Committee & RACI tracker, and an *"Entity answers; Corp supplies evidence"* voice validator.
- **4-Regime Obligation & Incident Clock Comparator:** Side-by-side statutory crosswalk across DORA (4h), UK CTP (immediate), NIS2 (24h), and the Korea Network Act (24h KISA + 72h PIPC).

