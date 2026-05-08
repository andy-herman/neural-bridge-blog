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

export const collections = { posts, projects };
