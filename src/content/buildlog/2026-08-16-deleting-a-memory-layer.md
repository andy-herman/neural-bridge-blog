---
title: "Deleting a memory layer on the evidence"
date: 2026-08-16
kind: hardening
project: neural-bridge
links:
  - label: "Commit 4b56023 (the retirement)"
    url: "https://github.com/andy-herman/neural-bridge/commit/4b56023"
  - label: "Commit 1536dec (spending the reclaim)"
    url: "https://github.com/andy-herman/neural-bridge/commit/1536dec"
tags: [memory, telemetry, context-engineering, agents]
---

The weekly lessons digest was supposed to compress each week into what the agents should carry forward. It ran every Monday at four, wrote a file per agent, and every agent prepended the newest one to every turn.

I instrumented it two weeks ago. Over its measured lifetime it resolved for one request in seven, because exactly one agent ever had a digest directory. The other six turns in seven paid a four thousand character budget slot to look up a file that was not there, and got back an empty string that was indistinguishable from success.

So it is gone. The one real digest went into that agent's notes first, into the durable region rather than the session log, because it held her own correct diagnosis of the calendar bug I fixed yesterday. She had written it a week before I confirmed it. That was worth keeping; the machinery around it was not.

The reclaimed budget went straight back out the door, which is the part I did not expect. Her notes file had grown to 17.6k against an 8k cap, and the section-aware budgeter was doing exactly what it was designed to do: drop the rolling log first, then start eating durable content. It was losing about 2.7k of the durable half on every single turn, including part of the section that holds the rules I have explicitly given her. Durable-first ordering was correct. There was simply not enough room for it to matter. The cap is now 12k, funded entirely by the digest removal, so the per-turn prompt is smaller than it was that morning.

The general lesson is not that the digest was a bad idea. It is that I could only delete it because I had measured it. Before the telemetry existed I would have argued about whether it was useful, and the honest answer is that neither of us could have known.
