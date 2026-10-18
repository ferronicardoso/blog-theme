import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { brand } from '../lib/brand';
import { getPosts, postDescription, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: brand.name,
    description: brand.description,
    site: context.site!,
    trailingSlash: false,
    customData: `<language>${brand.lang}</language>`,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: postDescription(p),
      link: postUrl(p),
      categories: p.data.tags,
    })),
  });
}
