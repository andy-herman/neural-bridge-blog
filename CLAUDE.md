# CLAUDE.md

Astro 5 + MDX + Tailwind site behind neural-bridge.dev. Push to `main` auto-deploys via Vercel (~60s). Content lives in `src/content/`, validated on build by the Zod schemas in `src/content/config.ts`. If frontmatter does not match the schema exactly, the build fails and the deploy fails with it.

## Commands

- `npm run dev` starts the dev server at http://localhost:4321 (also registered as the "blog" config in `.claude/launch.json`).
- `npm run build` runs the production build, including Zod validation. Run it before pushing content changes.
- `npm run preview` serves the built site.
- `npm run sync-paper -- "<vault file path>"` mirrors a research draft from the Obsidian vault into `src/content/research/` (see `scripts/sync-from-vault.mjs`). It strips the H1 title and "Published version" callouts, flattens wiki-links, and translates vault frontmatter to the Astro schema. Slug comes from the vault `canonical` URL when present, otherwise the filename. Caveat: filename-derived slugs can be ugly (the prefix-stripper turns `2026-05-09-foo` into `05-09-foo`); rename the output file before pushing if needed.

## Content collections and required frontmatter

Five collections are defined in `src/content/config.ts`: `posts`, `research`, `projects`, `buildlog`, `agents`.

`posts` (`src/content/posts/*.mdx`, build-in-public posts):
- Required: `title`, `description`, `pubDate`.
- Optional: `updatedDate`, `project` (string linking to a project hub entry), `tags` (defaults `[]`), `linkedinUrl` (must be a valid URL), `draft` (defaults `false`).

`research` (`src/content/research/*.mdx`, working papers):
- Required: `title`, `description`, `pubDate`, `topic` (enum: `ai-security`, `agentic-ai-security`, `development-playbooks`, `compliance-risk`).
- Optional: `abstract`, `updatedDate`, `tags`, `status` (enum `working-paper` / `draft` / `published`, defaults `working-paper`), `version`, `linkedinUrl`, `draft` (defaults `false`).

`projects` (`src/content/projects/*.md`, project hub entries):
- Required: `title`, `description`, `status` (enum: `active`, `paused`, `archived`), `started` (date).
- Optional: `repoUrl`, `siteUrl` (valid URLs).

`buildlog` entries are mostly written by the daily sync workflow (`.github/workflows/sync-buildlog.yml` + `.github/scripts/sync-buildlog.mjs`); it never overwrites existing files and uses the `pr_url` field for idempotency. Hand-curated entries leave `pr_url` unset. `agents` entries power the agent roster pages; `scripts/fetch-agent-avatars.mjs` reads their `client_id` fields.

## Publish flow

Posts and research publish through a queue, not by hand:

1. Add the `.mdx` file with `draft: true` and `pubDate` set to the Monday it should publish (that is the convention: pubDate = target Monday).
2. Push to main. Vercel deploys it, but draft content is excluded from indexes.
3. A Sunday-prep job in the separate neural-bridge repo picks the upcoming draft and generates LinkedIn/X drafts for review.
4. `.github/workflows/scheduled-publish.yml` runs Tuesday 01:00 UTC (Monday 17:00 PST / 18:00 PDT). `scheduled-publish.mjs` finds drafts with `pubDate <= today`, picks the oldest pubDate, flips `draft: false`, updates `pubDate` to the actual publish date, and pushes with `[skip-tweet]` in the commit message.
5. The same workflow then runs `draft-tweet.mjs` directly to open the tweet-draft issue for the freshly published piece.

Only one draft publishes per run; the rest wait for the next Monday. Manual dispatch from the Actions tab also works.

## Tweet drafts and [skip-tweet]

`.github/workflows/tweet-on-publish.yml` fires on any push to main that touches `src/content/posts/**` or `src/content/research/**`. It does not post to X; it opens a GitHub issue labeled `tweet-draft` with ready-to-paste text. It skips drafts, skips posts older than 7 days, and skips entirely when the commit message contains `[skip-tweet]`. Use `[skip-tweet]` on any content-touching commit that should not generate a tweet issue (typo fixes, reformatting, frontmatter tweaks).

## Hard rules

- Never set `draft: false` by hand unless explicitly asked. The Monday cron owns publishing; flipping it manually publishes immediately and skips the whole prep pipeline.
- Never rename a published post or paper file. The filename is the slug is the URL; changing it breaks live links, the RSS feed, and the `canonical` mapping used by sync-paper.
- Match the Zod schema in `src/content/config.ts` exactly. Unknown enum values, malformed URLs, or missing required fields fail the build.
- URL-typed fields (`linkedinUrl`, `repoUrl`, `siteUrl`, `plugin_file_url`, `pr_url`) must be full valid URLs or omitted entirely.

## Writing style for content

Plain tight prose. No em-dashes anywhere. No emojis.
