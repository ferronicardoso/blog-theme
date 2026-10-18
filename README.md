# blog-theme

Tema Astro compartilhado pelo **C# Brasil** e pelo **Ninja Python**. O tema não contém conteúdo: cada blog fornece uma pasta com a estrutura abaixo e aponta para ela com `BLOG_DIR`.

```
<blog>/
  brand.json     nome, cores, logo, hero, redes sociais, menu, analytics
  posts/         YYYY-MM-DD-slug.md  (URL final: /slug)
  pages/         sobre.md etc.  (URL final: /sobre)
  public/        images/, contents/, CNAME, favicon — copiado como está
```

## Uso

```shell
npm install
BLOG_DIR=../csharpbrasil.github.io npm run dev      # desenvolvimento
BLOG_DIR=../csharpbrasil.github.io npm run build    # astro build + índice de busca (Pagefind)
```

Logo e imagem principal da home ficam em `public/` do blog e são referenciados em `brand.json` (`logo`, `hero.image`, `ogImage`). Sem `hero.image`, a home usa um fundo gerado por CSS com as cores da marca.

## Front matter dos posts

Obrigatórios: `title`, `date`. Opcionais: `description` (SEO e cards), `summary` (resposta direta exibida no topo), `tags`, `image`, `updated`, `draft`.
