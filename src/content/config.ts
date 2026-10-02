import { defineCollection, z } from 'astro:content';
import { agentProfileSchema } from '../lib/agent-profiles.mjs';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        project: z.string().optional(),
        tags: z.array(z.string()).default([]),
        linkedinUrl: z.string().url().optional(),
        draft: z.boolean().default(false),
        // Optional banner: a 16:9 image (1920 x 1080 is ideal) in src/assets/banners/,
        // referenced relative to the post file (../../assets/banners/<slug>.jpg). It
        // sits at the top of the post and becomes the post's social preview image.
        banner: image().optional(),
        bannerAlt: z.string().optional(),
      })
      .refine((d) => !d.banner || (d.bannerAlt ?? '').trim().length > 0, {
        message: 'bannerAlt is required when banner is set',
        path: ['bannerAlt'],
      }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'paused', 'archived']),
    unlisted: z.boolean().default(false),
    repoUrl: z.string().url().optional(),
    siteUrl: z.string().url().optional(),
    started: z.coerce.date(),
    // Short line shown under the title in the nav's Projects menu.
    tagline: z.string().optional(),
    // Set to list the project in the nav's Projects menu; lower sorts first.
    featured: z.number().int().optional(),
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
      'gemma-grc',
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
  schema: agentProfileSchema,
});

export const collections = { posts, projects, research, buildlog, agents };
