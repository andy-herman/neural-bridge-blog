import { z } from 'astro/zod';
import fs from 'node:fs/promises';
import path from 'node:path';

const text = z.string().trim().min(1);
const stableId = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const jobDetail = z.object({
  label: text,
  text,
}).strict();

export const agentJobSchema = z.object({
  id: stableId,
  title: text,
  summary: text,
  trigger: jobDetail,
  deliverable: jobDetail,
  scope: jobDetail,
  approval_boundary: jobDetail,
  example_request: jobDetail,
}).strict();

export const agentProfileSchema = z.object({
  id: stableId,
  display_name: text,
  role_tagline: text,
  description: text.optional(),
  color: z.enum([
    'red', 'orange', 'yellow', 'green', 'blue',
    'purple', 'cyan', 'pink', 'white', 'gray', 'magenta',
  ]),
  client_id: text.optional(),
  discord_mention: text.optional(),
  // Retained for existing frontmatter, not evidence of an effective runtime model.
  model: text.optional(),
  plugin_file_url: z.string().url().optional(),
  tools: z.array(z.string()).default([]),
  does_not_own: z.string().optional(),
  operating_principles: z.array(z.string()).default([]),
  is_orchestrator: z.boolean().default(false),
  jobs: z.array(agentJobSchema).default([]).superRefine((jobs, context) => {
    const ids = new Set();
    jobs.forEach((job, index) => {
      if (ids.has(job.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Job IDs must be unique within a profile',
          path: [index, 'id'],
        });
      }
      ids.add(job.id);
    });
  }),
});

export const AGENT_COLOR_HEX = {
  red: '#dc2626',
  orange: '#ea580c',
  yellow: '#ca8a04',
  green: '#16a34a',
  blue: '#2563eb',
  purple: '#9333ea',
  cyan: '#0891b2',
  pink: '#db2777',
  white: '#a8a29e',
  gray: '#78716c',
  magenta: '#c026d3',
};

/**
 * @param {{ id: string, jobs: { id: string }[] }} profile
 * @param {{ id: string, jobs: { id: string }[] }} translation
 */
export function assertAgentTranslationMatches(profile, translation) {
  if (profile.id !== translation.id) {
    throw new Error(`Agent translation ID must match ${profile.id}`);
  }
  if (profile.jobs.length !== translation.jobs.length ||
      profile.jobs.some((job, index) => job.id !== translation.jobs[index]?.id)) {
    throw new Error(`Agent translation job IDs and order must match ${profile.id}`);
  }
}

/**
 * @param {string} [directory]
 * @returns {Promise<Set<string>>}
 */
export async function getAgentAvatarIds(directory = path.resolve('./public/agents')) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return new Set(entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.png'))
      .map(entry => entry.name.slice(0, -4)));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return new Set();
    }
    throw error;
  }
}
