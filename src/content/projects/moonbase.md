---
title: Moonbase
description: "A private 3D lunar workspace and Mac mini AI command deck for GitHub Copilot and Claude Desktop, featuring an upstairs Flight Director office, live session mini-dinosaur agents, and a persistent agent workbench."
status: active
started: 2026-09-28
tagline: "A virtual one-stop shop for live Mac mini AI work"
featured: 5
---

Moonbase is my private virtual workspace and lunar command center for the AI tools and agents running on my always-on Mac mini. Through a single Cloudflare Access and Moonbase Airlock login (`moonbase.neural-bridge.dev`), I can step into an expanded upstairs Flight Director office in First-Person View, use my live **GitHub Copilot** and **Claude Desktop** apps on dual desk monitors, mirror the full **Mac mini desktop** on a south-wall display, and watch the sessions and sub-agents I spin up work at desks on the downstairs floor as cute alien-dinosaur characters.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/moonbase/loft-first-person-unobstructed-2026-10-17.webp" class="block" target="_blank" rel="noopener">
<img src="/images/moonbase/loft-first-person-unobstructed-2026-10-17.webp" alt="The Upstairs Flight Director Office in First-Person View on October 17, with centered GitHub Copilot and Claude Desktop monitors above a custom Blender Mac mini M4, mechanical keyboard and mouse, desk companion mug, and rotating digital photo frame, plus the full Mac mini Desktop mirror on the south wall and sculpted three-toed dinosaur paws." width="1440" height="900" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">The Upstairs Flight Director Office in First-Person View on October 17. Centered GitHub Copilot and Claude Desktop monitors sit above a custom Blender Mac mini M4, mechanical keyboard and mouse, desk companion mug, and rotating digital photo frame, with the full Mac mini Desktop mirror on the south wall and sculpted three-toed dinosaur paws in the foreground. <a href="/images/moonbase/loft-first-person-unobstructed-2026-10-17.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

## The October 17 redo: Mac mini AI Command Deck and First-Person Flight Director Office

After shipping the [Persistent Agent Workbench](/posts/moonbase-persistent-agent-workbench/), daily testing made one thing clear: configuring isolated SDK profiles and multi-step approval forms got in the way of real output, especially when **GitHub Copilot** and **Claude Desktop** were already signed in and running on the same Mac mini.

In the October 17 release, we went [back to the drawing board](/posts/moonbase-back-to-the-drawing-board/) and rebuilt Moonbase around direct, zero-friction access to the live Mac mini host:

- **Expanded Upstairs Flight Director Office (`9.0m x 7.2m x 3.3m`) with Enclosure Cutaway:** Expanded the upstairs loft footprint and added automatic upper-enclosure cutaway (`setLoftCutaway(true)`) so glass walls and banners never block the desk or monitors.
- **First-Person View with Sculpted Dinosaur Paws (`dino-paw.glb`):** One-click eye-level First-Person View (`1st Person` button or `C` key) with pointer-lock mouse look and friendly three-toed alien-dinosaur paws sculpted in Blender via voxel remeshing and Laplacian smoothing.
- **Centered Dual AI App Monitors + Huge Wall Desktop Mirror:** Left desk monitor for **GitHub Copilot**, right desk monitor for **Claude Desktop**, and an ultrawide south-wall display mirroring the **entire Mac mini desktop**, complete with remote click and keyboard input forwarding.
- **Custom Blender Asset Desk and Virtual Rotating Photo Frame:** Four new procedural Blender GLB desk props (`mac-mini.glb`, `desk-keyboard-mouse.glb`, `digital-photo-frame.glb`, `desk-companion-kit.glb`) plus a live rotating photo frame (`/api/photo-frame`) that cycles through any picture folder on the Mac mini or uploaded from the browser.
- **Downstairs Live Session Mini Dinosaur Agents:** A non-intrusive `LiveSessionWatcher` tails `~/.copilot/session-state/` and `~/.claude/projects/` JSONL streams in real time so every active Copilot or Claude session claims a desk downstairs as a working mini dinosaur agent.

Read **[Moonbase: Back to the Drawing Board](/posts/moonbase-back-to-the-drawing-board/)** for the story behind the redesign and the **[Mac mini AI Command Deck Architecture Specification](/research/moonbase-mac-mini-command-deck-architecture/)** for the complete technical implementation.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/moonbase/loft-third-person-cutaway-2026-10-17.webp" class="block" target="_blank" rel="noopener">
<img src="/images/moonbase/loft-third-person-cutaway-2026-10-17.webp" alt="Third-person cutaway view of the expanded Upstairs Flight Director Office, framing the centered dual AI monitors, desk props, and south-wall Mac mini Desktop display." width="1440" height="900" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">Third-person cutaway view of the expanded Upstairs Flight Director Office, framing the centered dual AI monitors, desk props, and south-wall Mac mini Desktop display. <a href="/images/moonbase/loft-third-person-cutaway-2026-10-17.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/moonbase/virtual-photo-frame-modal-2026-10-17.webp" class="block" target="_blank" rel="noopener">
<img src="/images/moonbase/virtual-photo-frame-modal-2026-10-17.webp" alt="The Virtual Rotating Photo Frame modal connected to the 3D digital frame on the right wing of the Flight Director desk." width="1440" height="900" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">The Virtual Rotating Photo Frame modal (<code>/api/photo-frame</code>), connected to the 3D digital frame on the right wing of the Flight Director desk. <a href="/images/moonbase/virtual-photo-frame-modal-2026-10-17.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

## Earlier milestones: Persistent Agent Workbench and Lunar Habitat

Moonbase preserves its earlier foundations alongside the new Command Deck:

- **October 13 (Persistent Agent Workbench):** Added versioned specialist profiles, registered-project workstreams, server-owned native runs, selected Markdown/text knowledge grants, exact tool decisions, and owner-reviewed memory. Read [the Workbench build article](/posts/moonbase-persistent-agent-workbench/) and [Workbench technical specification](/research/moonbase-workbench-technical-specification/).
- **September 29 (Original Lunar Habitat and Telemetry Bridge):** Adapted Agent Office into a Three.js lunar habitat with reproducible Blender alien-dinosaur characters, real `ptyhost` terminals, and a read-only observation feed for Neural Bridge bots. Read [Building Moonbase](/posts/building-moonbase/).

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/moonbase/workbench-live-desktop-2026-10-13.webp" class="block" target="_blank" rel="noopener">
<img src="/images/moonbase/workbench-live-desktop-2026-10-13.webp" alt="The October 13 2D Workbench interface at 1440px, preserved at /workbench alongside the 3D Command Deck." width="1440" height="1000" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">The October 13 2D Workbench interface, preserved at <code>/workbench</code> alongside the 3D Command Deck. <a href="/images/moonbase/workbench-live-desktop-2026-10-13.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/moonbase/workspace-overview.webp" class="block" target="_blank" rel="noopener">
<img src="/images/moonbase/workspace-overview.webp" alt="The downstairs lunar habitat floor, where mini alien-dinosaur workers reflect live GitHub Copilot and Claude sessions alongside real PTY terminals and observed Neural Bridge specialists." width="1920" height="1080" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">The downstairs lunar habitat floor, where mini alien-dinosaur workers now reflect live GitHub Copilot and Claude sessions alongside real PTY terminals and observed Neural Bridge specialists. <a href="/images/moonbase/workspace-overview.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

## What it is built from

- TypeScript and Node for the private Mac mini server (`dev.neural-bridge.moonbase`), `ptyhost` lifecycle, macOS screen-capture/input bridge, and JSONL live session watcher.
- Three.js for the walkable lunar habitat, expanded upstairs Flight Director office, automatic wall cutaway, and eye-level First-Person View.
- Reproducible Python-driven Blender 4.2 scripts and GLB assets for the alien-dinosaur residents, sculpted first-person dinosaur paws (`dino-paw.glb`), laboratory stations, and Flight Director desk hardware (`mac-mini.glb`, `desk-keyboard-mouse.glb`, `digital-photo-frame.glb`, `desk-companion-kit.glb`).
- Higgsfield and Kling concept studies used to guide Blender voxel-remesh sculpting, materials, and lighting.
- The Agent Office terminal, project, queue, board, and collaboration foundation, with its MIT attribution preserved.

<figure class="not-prose my-10 lg:-mx-24">
<div class="overflow-x-auto" tabindex="0" role="region" aria-label="Moonbase Mac mini AI Command Deck architecture diagram">
<a href="/images/projects/moonbase-command-deck-architecture-light.svg" class="block min-w-[1110px]" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/moonbase-command-deck-architecture-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/moonbase-command-deck-architecture-light.svg" alt="A remote browser signs in through Cloudflare Access and the Moonbase Airlock to reach the Upstairs Flight Director Office and Downstairs Main Floor on the Mac mini. Upstairs mirrors GitHub Copilot, Claude Desktop, and the full Mac mini display while running a live rotating photo frame; downstairs maps live Copilot and Claude sessions to mini dinosaur workers." width="1110" height="530" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
</div>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">Moonbase Mac mini AI Command Deck architecture. Scroll horizontally if needed, or open full size in <a href="/images/projects/moonbase-command-deck-architecture-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">light</a> or <a href="/images/projects/moonbase-command-deck-architecture-dark.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">dark</a>.</figcaption>
</figure>

## Current access

**[Enter Moonbase Command Deck](https://moonbase.neural-bridge.dev/room)** (sign-in required).

[Open 2D Workbench](https://moonbase.neural-bridge.dev/workbench) (sign-in required).

[Manage Moonbase settings](https://moonbase.neural-bridge.dev/admin) (sign-in required).

Moonbase is hosted on a dedicated Mac mini behind Cloudflare Access zero-trust authentication and an application Airlock sign-in (`moonbase.neural-bridge.dev`). There is no public unauthenticated demo.

## Prior art

Derived from
[Agent Office by AgentSystemLabs](https://github.com/AgentSystemLabs/agent-office/tree/44aecc1ecf175939bce2049123626aa2bcddd7e2)
under its
[MIT license](https://github.com/AgentSystemLabs/agent-office/blob/44aecc1ecf175939bce2049123626aa2bcddd7e2/LICENSE).
Moonbase preserves that foundation while developing its own characters,
environment, Mac mini AI Command Deck, and Neural Bridge observation layer.
