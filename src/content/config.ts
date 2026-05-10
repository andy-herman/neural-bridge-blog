import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    project: z.string().optional(),
    tags: z.array(z.string()).default([]),
    linkedinUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'paused', 'archived']),
    repoUrl: z.string().url().optional(),
    siteUrl: z.string().url().optional(),
    started: z.coerce.date(),
  }),
});

const research = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    abstract: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topic: z.enum([
      'ai-security',
      'agentic-ai-security',
      'development-playbooks',
      'compliance-risk',
    ]),
    tags: z.array(z.string()).default([]),
    status: z.enum(['working-paper', 'draft', 'published']).default('working-paper'),
    version: z.string().optional(),
    linkedinUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const buildlog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.enum([
      'milestone',  // major shipping moment (V1 ship, V2 ship, first post)
      'release',    // specific feature shipped end-to-end
      'feature',    // new capability landed
      'post',       // blog post / research published
      'hardening',  // operational reliability work
      'fix',        // bug fix worth surfacing
      'note',       // operational notes (setup, config, infra)
    ]).default('feature'),
    project: z.enum([
      'neural-bridge',
      'neural-bridge-blog',
      'seoul-eland-digest',
      'cross-cutting',
    ]).default('neural-bridge'),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).default([]),
    tags: z.array(z.string()).default([]),
    // Optional PR URL set by the auto-sync workflow for idempotency. Used as
    // a "this PR is already represented" marker so re-runs skip duplicates.
    // Hand-curated entries leave this unset.
    pr_url: z.string().url().optional(),
  }),
});

const agents = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),                          // kebab-case, matches plugin file slug
    display_name: z.string(),
    client_id: z.string(),                   // Discord application client_id (used by avatar script)
    role_tagline: z.string(),                // one-line role summary
    color: z.enum([
      'red', 'orange', 'yellow', 'green', 'blue',
      'purple', 'cyan', 'pink', 'white', 'magenta',
    ]),
    model: z.string(),
    tools: z.array(z.string()).default([]),
    plugin_file_url: z.string().url(),
    discord_mention: z.string(),             // e.g. "@ux-designer"
    does_not_own: z.string().optional(),     // sibling-disambiguation phrase
    operating_principles: z.array(z.string()).default([]),  // 3-5 highlights
    is_orchestrator: z.boolean().default(false),
  }),
});

export const collections = { posts, projects, research, buildlog, agents };
