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
draft: true                  # cron flips to false at scheduled time
---
```

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
repoUrl: https://github.com/...
siteUrl: https://...
started: 2026-01-15
---
```

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
