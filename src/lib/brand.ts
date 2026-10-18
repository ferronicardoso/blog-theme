import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Brand {
  name: string;
  tagline: string;
  description: string;
  url: string;
  lang: string;
  locale: string;
  author: { name: string; url?: string };
  logo: string; // caminho em public/, ex.: /images/logo.png
  logoAlt?: string;
  favicon: string;
  ogImage?: string; // imagem padrão de compartilhamento
  hero: { title: string; subtitle: string; image?: string };
  colors: {
    light: { primary: string; onPrimary: string; accent: string };
    dark: { primary: string; onPrimary: string; accent: string };
  };
  social: { github?: string; x?: string; facebook?: string; instagram?: string; whatsapp?: string };
  twitterHandle?: string;
  nav: { label: string; href: string }[];
  analytics?: { gtm?: string; ga4?: string };
  comments?: { facebook?: boolean };
  footerText?: string;
}

const blogDir = resolve(process.env.BLOG_DIR ?? './sample');
export const brand: Brand = JSON.parse(readFileSync(resolve(blogDir, 'brand.json'), 'utf-8'));
