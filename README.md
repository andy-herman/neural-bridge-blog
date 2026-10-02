# neural-bridge.dev

Build-in-public hub for [Neural Bridge](https://github.com/andy-herman/neural-bridge) — the personal multi-agent AI substrate — plus other projects in the same orbit.

Live at [neural-bridge.dev](https://neural-bridge.dev). Auto-deploys on push to `main` via Vercel.

## What's running

- **Astro 5** + content collections, Tailwind + typography
- **MDX** for posts and research papers (cross-postable to LinkedIn)
- **Vercel** auto-deploy on push to `main` (~60s from push to live)
- **Scheduled publishing**: weekly cron flips one queued draft → published every Monday 18:00 PT
- **X-draft generator**: on every publish, opens a labeled GitHub issue (`tweet-draft`) with a ready-to-paste tweet
- **Sunday-prep job** (lives in the [neural-bridge repo](https://github.com/andy-herman/neural-bridge), runs on Andy's Mac Mini): picks the upcoming draft, generates a LinkedIn variant via Claude using a voice corpus, posts a Discord briefing in `#neural-bridge`

## Content collections

```
src/content/
  posts/        Build-in-public posts (project: neural-bridge or other)
  research/     Working papers (have abstract, topic enum, version)
  projects/     Project hub entries (status: active / paused / archived)
  agents/       Public agent profiles, with Korean sidecars in agents/ko/
```

The Astro schema is in `src/content/config.ts` — Zod-validated on build.

## Publishing flow

1. Drop a `.mdx` file in `src/content/posts/` or `src/content/research/`.
2. Set `draft: true` and a `pubDate` for the Monday it should publish.
3. Push to main. Vercel deploys it but the page renders as draft (excluded from indexes).
4. The Sunday cron picks the next eligible draft, generates LinkedIn + X drafts, posts a Discord brief.
5. Monday 18:00 PT, the publish cron flips `draft: false` and pushes. Vercel re-deploys live.

To publish out-of-band, just set `draft: false` and push.

### Post frontmatter (`src/content/posts/*.mdx`)

```yaml
---
title: "Post title"
description: "Short description for the index + meta tags"
pubDate: 2026-05-11
project: neural-bridge       # optional — links to a project hub entry
tags: [tag1, tag2]
linkedinUrl: https://...     # optional — set after cross-posting
banner: ../../assets/banners/<slug>.jpg   # optional — 16:9, 1920 x 1080 ideal
bannerAlt: "What the image shows"         # required when banner is set
draft: true                  # cron flips to false at scheduled time
---
```

A banner sits at the top of the post, and a 1200px JPEG of it becomes the post's
social preview (`og:image`, a large X card). Put the file in `src/assets/banners/`;
Astro resizes it and serves modern formats. Keep the subject centred: LinkedIn and X
crop previews to about 1.91:1 and 2:1.

### Research frontmatter (`src/content/research/*.mdx`)

```yaml
---
title: "Working paper title"
description: "Index + meta description"
abstract: "Long-form abstract for the paper detail page"
pubDate: 2026-05-11
topic: "agentic-ai-security"  # enum: ai-security | agentic-ai-security | development-playbooks | compliance-risk
tags: [research, ...]
status: "working-paper"       # or draft / published
version: "v0.1"
draft: true
---
```

### Project frontmatter (`src/content/projects/*.md`)

```yaml
---
title: "Project Name"
description: "One-line description"
status: active                # or paused / archived
unlisted: false               # optional; hide from discovery without removing the URL
repoUrl: https://github.com/...
siteUrl: https://...
started: 2026-01-15
---
```

Set `unlisted: true` to hide a project from the Projects page, home and Writing
feeds, featured navigation, and sitemap. Its existing URL still works with
`noindex, nofollow`; this is not access control. Keep the flag consistent in
English and Korean entries. The default is `false`, independent of project status.

### Agent profile contract (`src/content/agents/*.md`)

The agent schema lives in `src/lib/agent-profiles.mjs` and is used by the content
collection and native Node tests. A profile requires a stable kebab-case `id`,
`display_name`, `role_tagline`, and a supported palette `color`. Its route is
`/agents/<id>`; keep legacy IDs, especially `teaching-prep`, unchanged. Korean
sidecars match the English filename, share its ID, and render at the same URL.
An optional owner-reviewed `description` appears beside the role and supplies
page metadata; older profiles fall back to their existing role tagline.

`client_id`, `discord_mention`, `model`, and `plugin_file_url` are optional.
Discord metadata is not a prerequisite for a profile or a portrait. Existing
`public/agents/<id>.png` files remain usable without a Discord account; missing
portraits use a decorative display-name initial, with neutral gray for Loid.
Avatar refresh only processes
profiles with a `client_id` and never removes existing portraits.

Legacy `model` values remain accepted for compatibility but are not displayed:
a configured or charter-declared model does not establish the model used by an
actual invocation. Profile metadata does not configure a runtime, grant tools,
route requests, or establish availability. Do not infer those claims from a
profile's presence or ordering.

Optional `jobs[]` defaults to an empty array. Each job requires a unique, stable
`id`, `title`, `summary`, and these five details: `trigger`, `deliverable`,
`scope`, `approval_boundary`, and `example_request`. Each detail is an object
with a nonempty `label` and `text`. Labels are content, not hard-coded interface
copy: supply owner-reviewed English and Korean versions alongside each brief.
Translate titles, summaries, labels, and text, but preserve IDs and job order.
The build rejects mismatched profile IDs or job IDs/order in a Korean sidecar.
The directory retains alphabetical profile ordering, lists job titles, and
uses the same language toggle as profiles. Profiles without a Korean sidecar
keep their English directory copy rather than an empty card.
Profiles show every job before the longer biography. Legacy scope/tools and
principle sections render only when they have content.

All new public agent wording must come from the owner-reviewed, vault-first
brief. Do not copy private charters, memories, paths, chats, or telemetry into
these fields. Luna, Loid, Professor, and the directory introduction/recruiter
footer use the reviewed English/Korean companion brief. The other eleven
profiles retain their existing copy. Professor keeps the `teaching-prep` URL
and an explicit INFO 310A scope. Loid has no invented account metadata, source
link, model claim, or generated portrait. No public interaction entry point,
live availability badge, or runtime permission change is implied.

Run `npm run test:agents` to type-check and build the site, then check schema
compatibility, escaped bilingual job-card rendering, optional transport metadata,
avatar fallback behavior, all thirteen legacy URLs with their Korean variants
and portraits, and the additional `/agents/loid` profile. Avatar-script fixtures
are offline and must not contact Discord or overwrite real portraits.
`npm run check` runs the Astro type diagnostics separately.

## Workflows

- `.github/workflows/scheduled-publish.yml` — Monday 18:00 PT, picks next eligible draft and flips it
- `.github/workflows/tweet-on-publish.yml` — on push to main, drafts an X tweet and opens a `tweet-draft` GitHub issue (skip with `[skip-tweet]` in commit message)
- `.github/workflows/sync-buildlog.yml` — placeholder for V2 build-log sync from project repos

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Vault sync helper

`npm run sync-paper -- "<vault file path>"` mirrors a research draft from the Obsidian vault into `src/content/research/`. Strips vault-only artifacts (H1 title, "Published version" callouts) and translates frontmatter to the Astro schema. Caveat: slug derivation can produce ugly results (`2026-05-09-foo` → `05-09-foo`); rename the resulting file before pushing if needed.

## License

MIT — see [LICENSE](LICENSE).
