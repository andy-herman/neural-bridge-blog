---
title: "The tools she was documented to have, and never had"
date: 2026-08-16
kind: feature
project: neural-bridge
links:
  - label: "Commit 95f7133 (the CLIs)"
    url: "https://github.com/andy-herman/neural-bridge/commit/95f7133"
  - label: "Commit 170ec19 (setup doc corrections)"
    url: "https://github.com/andy-herman/neural-bridge/commit/170ec19"
  - label: "Commit b70a1c5 (duplicate detection)"
    url: "https://github.com/andy-herman/neural-bridge/commit/b70a1c5"
tags: [executive-assistant, oauth, google, agents]
---

Luna's charter said she owned my calendar and inbox. Her allowlist hand-enumerated eighteen connector tool names for Calendar, Gmail and Drive. I tested it and she answered `NO_CALENDAR_ACCESS`.

They had never worked. Auto-approving a tool does not create it, and app-level connectors are not loaded into a headless session at all. The charter had been describing a capability that did not exist, which is the same class of untruth as a monitoring dashboard reporting green over a dead process.

The replacement is two read-only CLIs plus a scoped shell, which is the pattern already working for the career agent. Standard library only: the rest of the codebase reaches HTTP with urllib, and this needs a token refresh and two GETs. A forty megabyte SDK was not worth it.

No send, no delete, no event creation. Not "not configured yet", absent. Gmail is draft-only by charter, and Google has no draft-without-send scope, so the request stays read-only and there is no write path at all. The old allowlist had granted event deletion with nothing authorizing it. Tests assert this at the argument-parser level, so adding a send command breaks the suite rather than passing review.

The most useful command is the one that lists threads I sent where nobody replied. On its first real run it surfaced a recruiter thread that had been silent nine days.

Two setup traps, both of which I wrote into my own instructions before hitting them. Internal audience is offered whenever the project sits under an organization, but the organization attaches to the project rather than to a consumer identity, so consent fails at the last step. And Testing publishing status works the day you set it up, then expires refresh tokens for sensitive scopes after seven days, which would have taken her dark every week. Both are now documented with their exact symptoms.

The first live conflict report flagged a flight against itself: the same flight sits on the calendar twice, once in English and once in Korean, occupying identical minutes. Duplicates are now told apart from clashes by requiring identical start and end plus a shared token that survives translation, such as a flight number. Two genuinely different meetings in one slot stay a conflict.
