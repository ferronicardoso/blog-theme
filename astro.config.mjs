import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// O conteúdo de cada blog (posts, páginas, brand.json, public/) fica fora do tema.
const blogDir = resolve(process.env.BLOG_DIR ?? './sample');
const brand = JSON.parse(readFileSync(resolve(blogDir, 'brand.json'), 'utf-8'));

export default defineConfig({
  site: brand.url,
  publicDir: resolve(blogDir, 'public'),
  // Posts em /slug.html (servido como /slug); índices em /pasta/ — mantém as URLs do Jekyll.
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (url) => !/\/(busca|404)\/?$/.test(url) })],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      langAlias: { promql: 'text', logql: 'text', dockerfile: 'docker' },
    },
  },
});
