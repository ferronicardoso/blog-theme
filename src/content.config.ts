import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const blogDir = resolve(process.env.BLOG_DIR ?? './sample');
const dirUrl = (name: string) => pathToFileURL(resolve(blogDir, name) + '/');

// 2008-09-05-meu-post.md -> "meu-post" (mesmo permalink /:title do Jekyll)
const slugFromFile = ({ entry }: { entry: string }) =>
  entry.replace(/\.(md|mdx)$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: dirUrl('posts'), generateId: slugFromFile }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string().max(200).optional(),
    // Resposta direta de 1–2 frases, exibida no topo do post (útil para busca e mecanismos de resposta).
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: dirUrl('pages') }),
  schema: z.object({ title: z.string(), description: z.string().optional() }),
});

export const collections = { posts, pages };
