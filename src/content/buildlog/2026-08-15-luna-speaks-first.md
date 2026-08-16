---
title: "An assistant that speaks first, and watches the right thing"
date: 2026-08-15
kind: feature
project: neural-bridge
links:
  - label: "Commit d791c6c (proactive check-ins)"
    url: "https://github.com/andy-herman/neural-bridge/commit/d791c6c"
  - label: "Commit 0acebb2 (commitment board)"
    url: "https://github.com/andy-herman/neural-bridge/commit/0acebb2"
tags: [agents, proactive, executive-assistant]
---

Luna could only ever answer. Every surface she had required me to start the conversation, and the Discord fleet went ten weeks without a single mention because of exactly that. An assistant who never speaks first is a tool you have to remember to pick up.

She now has two scheduled check-ins. The load-bearing design decision is that staying silent is a first-class outcome: a check-in that fires daily regardless becomes noise, noise gets muted, and a muted assistant is strictly worse than none. Silence is recorded as a success, because deciding there is nothing worth saying is different from failing to run, and the canary watches for the difference.

The first version opened with fleet health. Agent uptime is devops wearing a persona, not executive assistance. What an assistant actually watches is the commitment board, so that is now the primary context and fleet health appears only when something is actionable.

The board turned out to be carrying two regulator-escalated items seventeen days overdue while Luna had been silent for twelve weeks. That is the entire gap, in one line.

Parsing it correctly took two attempts. The kanban date trigger is usually the date a card was ADDED, not when it is due, and the real deadline is written into the card text. Reading the trigger as a due date marked a card saying "Prep for the regulator's first annual review by 2028-01" as thirty-three days overdue, and produced twenty false alarms on a board of twenty-two. An assistant that cries wolf on its first run is muted by its second. The trigger is not used consistently either, so the rule is now that a future date cannot be an added date, and an explicit in-text deadline always wins.

Verified live: she leads with the escalated items, names the deliverables, recommends drafting both that morning, and says explicitly what can wait.
