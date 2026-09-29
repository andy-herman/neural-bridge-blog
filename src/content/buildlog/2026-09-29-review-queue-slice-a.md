---
title: "The review queue is live: agent work now comes to me"
date: 2026-09-29
kind: release
project: neural-bridge
links:
  - label: "PR #175"
    url: "https://github.com/andy-herman/neural-bridge/pull/175"
  - label: "PR #176"
    url: "https://github.com/andy-herman/neural-bridge/pull/176"
  - label: "Design and runbook"
    url: "https://github.com/andy-herman/neural-bridge/blob/main/docs/REVIEW_QUEUE.md"
  - label: "Project page"
    url: "/projects/neural-bridge"
tags: [neural-bridge, review-queue, telegram, phase-1]
---

Phase 1 of the August roadmap, first slice. The agents worked; what they lacked was a trigger. Every one of them waited for me to start the conversation, and the Discord fleet sat unused for weeks.

Now agent output that needs me lands in one local queue. Luna's Telegram bot sends each item as a card with buttons, and every decision and its outcome goes into an append-only event log. Two kinds of item are live:

- **Captures**, from the filing gate's quarantine. Filing one opens a pull request that moves it into the wiki and merges it. Rejecting one removes it. Both take a second tap.
- **Alerts**, from the memory canary, the deploy watcher and the scheduled-output watchdogs. For the first week they are collected but not sent as cards, so nothing arrives twice.

On its first night the queue sent eight capture cards, for concepts that had sat in quarantine since 2026-05-10. Nothing had ever asked anyone to decide them.

The queue checks itself. Every day a probe item goes through the whole lifecycle, and the pusher's heartbeat must be fresh. A separate watcher alerts directly if the queue stops delivering, because a queue that has stopped cannot report its own failure. The health check had a bug of its own, found during deployment: two checks in the same second shared a probe key, and the second reported a healthy queue as broken. PR #176 fixed it.

The measure after four weeks: decisions per week, median time to decision and how many items expire unread.
