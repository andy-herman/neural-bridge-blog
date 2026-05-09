import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).map(p => ({
    type: 'post',
    slug: p.slug,
    data: p.data,
  }));
  const research = (await getCollection('research', ({ data }) => !data.draft)).map(p => ({
    type: 'research',
    slug: p.slug,
    data: p.data,
  }));

  const all = [...posts, ...research]
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'neural-bridge.dev',
    description: 'Build-in-public hub for Neural Bridge and other projects.',
    site: context.site,
    items: all.map((item) => ({
      title: item.type === 'research' ? `[Research] ${item.data.title}` : item.data.title,
      description: item.data.description,
      pubDate: item.data.pubDate,
      link: `/${item.type === 'research' ? 'research' : 'posts'}/${item.slug}/`,
    })),
  });
}
