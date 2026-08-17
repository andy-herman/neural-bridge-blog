---
title: "The agent that said it could not, and could"
date: 2026-08-16
kind: fix
project: neural-bridge
links:
  - label: "Commit 04843f1 (the prefetch)"
    url: "https://github.com/andy-herman/neural-bridge/commit/04843f1"
  - label: "Commit 1f8247d (the charter pass)"
    url: "https://github.com/andy-herman/neural-bridge/commit/1f8247d"
tags: [agents, context-engineering, executive-assistant, prompting]
---

I asked for a summary of my day. She told me she could not reach the calendar or the inbox in that session. I ran both commands by hand about thirty seconds later and they worked fine.

This is a fabrication, and it is the more expensive of the two directions. Inventing a meeting wastes a minute of my time. Inventing a limitation loses the task outright and quietly teaches me the assistant is less capable than it is, which is the kind of lesson that compounds. I had spent the previous day removing the opposite failure, a charter describing tools that did not exist. This was the same untruth pointed the other way.

I tried to write my way out of it three times. A rule saying to attempt a tool before declaring it missing. A section naming the two surfaces she actually runs on, since she had claimed Telegram belonged to a different agent. Adding Bash to the tool list at the top of her Tools section, which had omitted it while the next paragraph told her to run CLIs with Bash. That contradiction was real and worth fixing regardless.

It went from always to sometimes, and then it stopped improving. On the phrasing that triggered it hardest she still refused five times out of five.

That is the signal that prompting was the wrong instrument. A model deciding whether it is permitted to look is a decision that should not exist in the first place.

So the state now arrives already fetched. Today, the next seven days, and the threads I am waiting on get pulled before the turn starts and sit at the top of her prompt. She is not asked whether she can reach the calendar. The calendar is in front of her. The same prompt that failed five times now answers with real data three times out of three.

Cached for five minutes, because conversation comes in bursts. Never blocks a turn, and a broken inbox still leaves her the calendar. When a fetch genuinely fails, the block says so in words she can repeat to me, which is the honest version of the sentence she had been inventing.

Part of the cause was mine. A lesson I had migrated into her notes that same morning told her to distinguish "not authorized" from "not present in this surface." Reasonable diagnosis, except I had given her no step that said to test first, so she was classifying failures she had never actually observed. It now reads: run it, then classify what the error says.
