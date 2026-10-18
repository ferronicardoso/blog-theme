import type { APIContext } from 'astro';
import { brand } from '../lib/brand';
import { getPosts, postDescription, postUrl } from '../lib/posts';

// Índice em Markdown para consumo por LLMs (convenção llmstxt.org; sem garantia de uso por buscadores).
export async function GET(context: APIContext) {
  const posts = await getPosts();
  const base = context.site!;
  const lines = [
    `# ${brand.name}`,
    '',
    `> ${brand.description}`,
    '',
    '## Artigos',
    '',
    ...posts.map((p) => `- [${p.data.title}](${new URL(postUrl(p), base).href}): ${(p.data.summary ?? postDescription(p)).replace(/\s+/g, ' ')}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
