---
title: Neural Bridge
description: A personal multi-agent system on a Mac Mini, built in public since 2026-05-08. Thirteen specialist agents hand work to each other, and agent output that needs my decision now lands in one review queue.
status: active
repoUrl: https://github.com/andy-herman/neural-bridge
started: 2026-05-08
tagline: Thirteen specialist agents on a Mac Mini, built to earn daily use.
featured: 4
---

Neural Bridge is a personal multi-agent system, built in public since 2026-05-08. It runs locally on a Mac Mini under launchd. Thirteen specialist agents answer @-mentions on Discord: luna, research, teaching-prep, content, social, senior-pm, recruiter, automation-engineer, security-reviewer, docs-editor, librarian, echo and ux-designer. They can hand work to each other, and Luna, the executive assistant, is also reachable on Telegram. Each one has its own page under [Agents](/agents).

On 2026-08-02 a deep-research pass found the project past "build the capability" and stalled before "earns daily use." The agents worked, but every one of them waited for me to start the conversation, and the Discord fleet sat unused for weeks. The diagnosis was a trigger-source and surface problem, not a model or capability problem.

The roadmap that came out of it puts instrumentation before surface change, and surface change before proactivity. Phase 0 instruments the memory stack, then consolidates its stores. In Phase 1 the entry point stops being thirteen personas I have to summon and becomes one review queue, where agent work lands for a decision. Phase 2 puts a cheap non-LLM gate in front of anything proactive. Phase 3 hardens the loop engineer.

## How it works

Each agent writes cheap per-session daily logs. A nightly compile step proposes shared concept articles for a markdown wiki. Every candidate passes a filing gate that answers PROMOTE, QUARANTINE or REJECT. The gate checks for imperative AI-directed language (prompt injection), untraceable claims and concept-worthiness. Quarantined candidates wait for a human.

The first slice of Phase 1, the review queue, went live on 2026-09-29. The bots stay online through Phase 1, but agent output that needs me now lands in one local queue. Luna's Telegram bot sends each item as a card with buttons, and every decision and its outcome goes into an append-only event log.

Two kinds of item are live:

- **Captures**, from the filing gate's quarantine. Filing one opens a pull request that moves it into the wiki and merges it. Rejecting one removes it.
- **Alerts**, from the memory canary, the deploy watcher and the scheduled-output watchdogs. For a one-week shadow period they are collected but not yet sent as cards, so nothing arrives twice.

Anything that publishes or deletes takes a second tap.

<figure class="not-prose my-10 lg:-mx-24">
<a href="/images/projects/neural-bridge-review-queue-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/neural-bridge-review-queue-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/neural-bridge-review-queue-light.svg" alt="The review queue. Producers (the filing gate's quarantined captures, the memory canary, the deploy watcher and the scheduled-output watchdogs) write into one queue on the Mac. The queue keeps items and an append-only event log, and checks itself daily with a probe item and the pusher's heartbeat; if the queue stops delivering, a separate watcher alerts directly. Luna sends each item to Telegram as a card with buttons, and I decide. Anything that publishes or deletes takes a second tap. Filing a capture opens a pull request that moves it into the wiki and merges it; rejecting one removes it. An alert is acknowledged." width="1086" height="356" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">How work reaches me now · <a href="/images/projects/neural-bridge-review-queue-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a></figcaption>
</figure>

On its first night the queue sent eight capture cards for concepts that had sat in quarantine since 2026-05-10. Nothing had ever asked anyone to decide them.

The queue checks itself daily: a probe item goes through the whole lifecycle, and the pusher's heartbeat must be fresh. A separate watcher alerts directly if the queue stops delivering, because a queue that has stopped cannot report its own failure.

After four weeks I will judge it on three numbers: decisions per week, median time to decision and how many items expire unread. The roadmap's own research could not establish an evaluation method, so these are the first real measure of whether the change works. ([REVIEW_QUEUE.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/REVIEW_QUEUE.md))

A loop engineer daemon picks up GitHub issues labelled agent-ready, implements each one in its own isolated git worktree and opens a draft pull request for review. ([LOOP_ENGINEER.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/LOOP_ENGINEER.md))

An outbound guard, built between 2026-09-25 and 2026-09-28, screens every route by which agent output reaches GitHub or the public wiki, so text from my private notes cannot be published by an agent. A git pre-push hook screens every push as a catch-all. ([OUTBOUND_GUARD.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/OUTBOUND_GUARD.md))

## What broke silently

The lesson of the project so far: a healthy component and a dead one produced the same output, which was nothing.

- **A conversation-capture path was dead from 2026-05-27 to 2026-08-02**, while its logs looked healthy.
- **Luna's notes file silently discarded the half that held her operating rules.** Post: [My assistant was deleting her own rules to make room for a changelog](/posts/tuned-for-a-model-that-no-longer-exists).
- **The deploy watcher that pulls merged code onto the Mac exited with an error every two minutes** from 2026-05-13 to 2026-09-25, without writing a log line. It was fixed on 2026-09-25.

In Phase 0, per-stage memory telemetry and a daily read-back canary shipped on 2026-08-15. The canary asserts that each memory layer is still succeeding, rather than waiting for errors. The memory stores were consolidated in September 2026. ([MEMORY_CONSOLIDATION.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/MEMORY_CONSOLIDATION.md))

## Writing

- [Why I'm building Neural Bridge](/posts/2026-05-08-why-im-building-neural-bridge): the original motivation.
- [V2 ships: the substrate runs itself now](/posts/2026-05-10-v2-ships): session-end capture, daily logs and the compile step.
- [My assistant was deleting her own rules to make room for a changelog](/posts/tuned-for-a-model-that-no-longer-exists): one of the silent failures above.
- [Memory Poisoning in Personal Agentic AI Substrates](/research/memory-poisoning-in-personal-agentic-ai-substrates): the threat model behind the filing gate.
- [I built a filing gate to keep my AI from poisoning its own memory. It caught my own injection.](/research/memory-poisoning-sequel-filing-gate): how the gate works and what it checks for.

## What's next

- Alerts become cards after the shadow week.
- Slice B: questions agents leave at the end of a session become cards I answer in Telegram, and the answer lands in that agent's progress log for its next session.
- Slice C: the loop engineer's draft pull requests become review cards.
- Then Phase 2: a cheap non-LLM gate in front of anything proactive.
