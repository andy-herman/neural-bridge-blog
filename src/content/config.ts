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

export const collections = { posts, projects, research };
