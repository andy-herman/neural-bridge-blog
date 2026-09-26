import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// Draft posts and research still build and deploy at their final URLs until
// the Monday publish cron flips them, so without a filter the sitemap lists
// them. The sitemap integration cannot query content collections, so read the
// draft flag from frontmatter here. The slug is the filename without its
// extension; Korean sidecars in ko/ have no routes of their own and are
// skipped. The post and research routes mark the same pages noindex.
function draftPaths(collection) {
  const dir = new URL(`./src/content/${collection}/`, import.meta.url);
  return readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .filter((file) => {
      const source = readFileSync(new URL(file, dir), 'utf-8');
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      // true, True and TRUE are all YAML booleans, and Astro reads them as such.
      return frontmatter.split(/\r?\n/).some((line) => /^draft:\s*(true|True|TRUE)\s*(#.*)?$/.test(line));
    })
    .map((file) => `/${collection}/${file.replace(/\.mdx?$/, '')}`);
}

const drafts = new Set([...draftPaths('posts'), ...draftPaths('research')]);

export default defineConfig({
  site: 'https://neural-bridge.dev',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !drafts.has(new URL(page).pathname.replace(/\/$/, '')),
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
