import { getCollection, type CollectionEntry } from 'astro:content';
import { brand } from './brand';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/c#/g, 'c-sharp')
    .replace(/f#/g, 'f-sharp')
    .replace(/\+\+/g, 'pp')
    .replace(/\.net/g, 'dotnet')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Tags do front matter sem duplicatas (ex.: ['C#', 'C#']), preservando a ordem. */
export function uniqueTags(post: Post): { name: string; slug: string }[] {
  const seen = new Set<string>();
  const out: { name: string; slug: string }[] = [];
  for (const name of post.data.tags) {
    const slug = slugifyTag(name);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      out.push({ name, slug });
    }
  }
  return out;
}

export function groupByTag(posts: Post[]) {
  const map = new Map<string, { name: string; slug: string; posts: Post[] }>();
  for (const post of posts) {
    for (const t of uniqueTags(post)) {
      const entry = map.get(t.slug) ?? { ...t, posts: [] };
      entry.posts.push(post);
      map.set(t.slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

export function readingMinutes(body = ''): number {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Texto simples do Markdown, para descrição quando o post não tem `description`. */
export function plainText(md = ''): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+.*$/gm, ' ')
    .replace(/[*_`>#|~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function postDescription(post: Post): string {
  if (post.data.description) return post.data.description;
  const text = plainText(post.body);
  return text.length > 155 ? text.slice(0, text.lastIndexOf(' ', 155)).trimEnd() + '…' : text;
}

export function postUrl(post: Post): string {
  return `/${post.id}`;
}

const dateFmt = new Intl.DateTimeFormat(brand.lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => dateFmt.format(d);

/** Relacionados: posts com mais tags em comum; desempata pelo mais recente. */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const mine = new Set(uniqueTags(post).map((t) => t.slug));
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, score: uniqueTags(p).filter((t) => mine.has(t.slug)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.date.valueOf() - a.p.data.date.valueOf())
    .slice(0, limit)
    .map((x) => x.p);
}

export const PAGE_SIZE = 12;
