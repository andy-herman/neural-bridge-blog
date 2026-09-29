import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// Draft articles and unlisted projects keep their routes but stay out of the
// sitemap. This integration cannot query content collections, so read each
// collection's visibility flag from frontmatter. Slugs are filenames without
// extensions; Korean sidecars have no routes of their own and are skipped.
// The corresponding page routes also mark hidden entries noindex.
function hiddenPaths(collection, flag) {
  const dir = new URL(`./src/content/${collection}/`, import.meta.url);
  const hiddenFlag = new RegExp(`^${flag}:\\s*(true|True|TRUE)\\s*(#.*)?$`);
  return readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .filter((file) => {
      const source = readFileSync(new URL(file, dir), 'utf-8');
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      // true, True and TRUE are all YAML booleans, and Astro reads them as such.
      return frontmatter.split(/\r?\n/).some((line) => hiddenFlag.test(line));
    })
    .map((file) => `/${collection}/${file.replace(/\.mdx?$/, '')}`);
}

const hidden = new Set([
  ...hiddenPaths('posts', 'draft'),
  ...hiddenPaths('research', 'draft'),
  ...hiddenPaths('projects', 'unlisted'),
]);

export default defineConfig({
  site: 'https://neural-bridge.dev',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !hidden.has(new URL(page).pathname.replace(/\/$/, '')),
    }),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      wrap: true,
    },
  },
});
