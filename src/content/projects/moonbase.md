---
title: Moonbase
description: "A private persistent agent workbench with versioned specialists, selected knowledge, reviewable memory and an optional original Blender-built lunar habitat."
status: active
started: 2026-09-28
tagline: "A persistent home for owner-directed work"
featured: 5
---

Moonbase is a private persistent workbench and lunar workspace for the agents
behind Neural Bridge. Give a specialist a deliverable, leave it running,
return with direction and review what it actually produced. The server owns
execution; the room is optional.

The aim is not to make every agent look busy. It is to make work, evidence,
permissions and continuity legible without inventing activity.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/moonbase/workbench-live-desktop-2026-10-13.webp" class="block" target="_blank" rel="noopener">
<img src="/images/moonbase/workbench-live-desktop-2026-10-13.webp" alt="The actual private Moonbase Workbench at 1440px, with live-receipts controls and explicit unchecked GitHub Copilot and blocked Claude Agent readiness states." width="1440" height="1000" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">The actual local Workbench on October 13. Live authenticated receipts, four ungranted source templates and no active work. Copilot readiness is unchecked; the Claude Agent route remains auth-blocked. <a href="/images/moonbase/workbench-live-desktop-2026-10-13.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

## The persistent Workbench

The October release adds versioned specialist profiles, registered-project
workstreams, server-owned native runs, selected Markdown/text knowledge,
exact tool decisions, artifact/diff review and owner-approved scoped lessons.
The independent 2D interface works without entering the habitat or loading
WebGL. Existing PTY workers and missions retain their separate contracts.

Specialization means instructions, examples, evidence and reviewed memory,
not model-weight fine-tuning or adopting existing personal bots. Registering
a document does not include it everywhere; profile and workstream grants
both matter.

Read [the Workbench build article](/posts/moonbase-persistent-agent-workbench/)
and [technical specification](/research/moonbase-workbench-technical-specification/)
for the current architecture, evidence and limits. The
[original Moonbase article](/posts/building-moonbase/) covers the first habitat
and observation integration.

Actual desktop/mobile browser proof and protected configuration are complete,
with retained mission history preserved. The scoped-maintenance correction is
merged and controlled-fixture verified, but is source-only pending a future
supported helper/profile release. No new production model task was triggered
to make these screenshots. Discord notifications remain unconfigured without
an owner webhook destination.

## Workbench specialists and existing residents

**Workbench specialists** are versioned profiles for Moonbase-owned SDK runs,
starting with generic Engineering, Teaching, Research and Content templates.
The current templates are ungranted and unactivated; their names are not a
claim of four running agents.

**Managed coding workers** run at desks through the existing terminal,
worktree, and queue machinery.

**Observed Neural Bridge specialists** already run elsewhere. Moonbase reads
their real identities and optional, privacy-minimal execution observations.
Seeing one in the room does not create a new agent, grant permissions, or
prove that it is currently working.

Registry-only, fresh, stale, disconnected, and unavailable states remain
distinct. Model-process completion is not a claim of successful task delivery.

## The optional lunar habitat

Original alien-dinosaur residents still share the research habitat with real
terminals, project boards and collaborative tools. Three new original Blender
station types represent the task console, knowledge archive and review station;
their icons also appear in the practical Workbench.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/moonbase/workspace-overview.webp" class="block" target="_blank" rel="noopener">
<img src="/images/moonbase/workspace-overview.webp" alt="Historical September 29 Moonbase habitat capture with fourteen freshly observed registered identities and zero model subprocesses running, retaining the visible model-subprocess scope badge." width="1920" height="1080" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">Historical habitat evidence from September 29, with fourteen freshly observed registered identities and zero model subprocesses running at that capture. This image is not a new October workload demonstration. <a href="/images/moonbase/workspace-overview.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

## What it is built from

- TypeScript and Node for the private server and workspace lifecycle.
- Three.js for the walkable lunar environment.
- Reproducible Blender sources and GLB assets for the original residents.
- Five original Blender prop types used throughout the laboratory.
- The real Agent Office terminal, project, queue, board, and collaboration
  foundation, with its MIT attribution preserved.
- A bounded local observation feed rather than a second bot orchestrator.
- Official pinned SDK adapters and an owner-directed, versioned Workbench.
- Explicit selected-text retrieval and reviewed memory, not whole-vault ingestion.

Kling-assisted concept studies inform sculpting, materials, and lighting.
The application loads real Blender-exported models; generated concepts are
not presented as runtime screenshots.

<figure class="not-prose my-10 lg:-mx-24">
<div class="overflow-x-auto" tabindex="0" role="region" aria-label="Moonbase Workbench system-boundary diagram">
<a href="/images/projects/moonbase-workbench-architecture-light.svg" class="block min-w-[815px]" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/moonbase-workbench-architecture-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/moonbase-workbench-architecture-light.svg" alt="The private Workbench reaches authenticated actions and current SSE receipts. Versioned private records feed a server-owned supervisor and Moonbase-owned SDK sessions. Exact approved helpers reach a scoped worktree, and actual artifacts return for review. The optional room receives bounded projections and separate read-only Neural Bridge observations." width="815" height="673" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
</div>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">The Workbench owns only its own native sessions. Existing PTYs and observed specialists keep separate contracts. Scroll horizontally if needed, or open full size in <a href="/images/projects/moonbase-workbench-architecture-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">light</a> or <a href="/images/projects/moonbase-workbench-architecture-dark.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">dark</a>.</figcaption>
</figure>

## Current access

**[Open private Workbench](https://moonbase.neural-bridge.dev/workbench)** (sign-in required).

[Enter the optional lunar habitat](https://moonbase.neural-bridge.dev/room) (sign-in required).

[Manage Moonbase settings](https://moonbase.neural-bridge.dev/admin) (sign-in required).

Moonbase has a public address, but the workspace remains private. Cloudflare
Access and an application sign-in are required. There is no public operational
demo. The application runs locally, and its source repository remains private
while the build develops. Copilot production readiness requires an explicit
check; Claude SDK execution remains blocked pending permitted documented
authentication. Neither a subscription login workaround nor a new provider
account is part of the release.

The first real registry check discovered fourteen plugin roles and thirteen
Discord registrations, with zero runtime writers and every role honestly
unobserved. A subsequent private live pilot verified four independently
advancing sources and thirteen actual Discord connections. Telegram connectivity
remains unmeasured, and no model work was artificially triggered for the display.

The opt-in is now stored in private local configuration and has been verified
after the existing services restarted without the temporary login-session
setting. Their normal login startup reads that configuration; an actual machine
reboot was not part of the release checks. A fresh clone needs its own private
setting. The application itself remains a local workspace with authenticated
remote access.

## Prior art

Derived from
[Agent Office by AgentSystemLabs](https://github.com/AgentSystemLabs/agent-office/tree/44aecc1ecf175939bce2049123626aa2bcddd7e2)
under its
[MIT license](https://github.com/AgentSystemLabs/agent-office/blob/44aecc1ecf175939bce2049123626aa2bcddd7e2/LICENSE).
Moonbase preserves that foundation while developing its own characters,
environment, and Neural Bridge observation layer.
