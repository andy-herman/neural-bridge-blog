# neural-bridge.dev

Build-in-public hub for [Neural Bridge](https://github.com/andy-herman/neural-bridge) and other projects.

> 🚧 V1 scaffold. Not yet deployed.

## Stack

- [Astro 5](https://astro.build/) + content collections
- [Tailwind CSS](https://tailwindcss.com/) + typography plugin
- MDX for posts (LinkedIn-portable)
- [Vercel](https://vercel.com/) for hosting
- [Buttondown](https://buttondown.email/) for email subscribers (wiring TBD)

## Structure

```
src/
  content/
    posts/      MDX posts (cross-postable to LinkedIn)
    projects/   Build-in-public project hub entries
  pages/        Astro pages (home, posts, projects, buildlog, about)
  components/   Shared layout + UI
  styles/       global.css (Tailwind directives)
public/         static assets
.github/
  workflows/    build-log sync from project repos (V2)
```

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Writing a post

Drop a `.mdx` file in `src/content/posts/`. Frontmatter:

```yaml
---
title: "Post title"
description: "Short description for the index + meta tags"
pubDate: 2026-05-08
project: neural-bridge       # optional — links to a project hub entry
tags: [tag1, tag2]
linkedinUrl: https://...     # optional — set after cross-posting
draft: true                  # set to false to publish
---
```

Posts are plain Markdown — they render the same on the blog and on LinkedIn. No special syntax required.

## Adding a project to the hub

Drop a `.md` file in `src/content/projects/`. Frontmatter:

```yaml
---
title: "Project Name"
description: "One-line description"
status: active               # or paused / archived
repoUrl: https://github.com/...
siteUrl: https://...
started: 2026-01-15
---
```

## Email subscriptions

Form points at Buttondown. Set `BUTTONDOWN_FORM` in `.env` (or replace the placeholder URL in `src/components/Subscribe.astro`).

## Deployment

Push to `main`. Vercel auto-deploys.

## License

MIT
