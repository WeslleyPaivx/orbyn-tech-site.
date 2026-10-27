import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * URL pública do site, usada em canonical, Open Graph, sitemap.xml e robots.txt.
 *
 * Ordem de prioridade:
 * 1. SITE_URL (defina na Vercel quando tiver domínio próprio, ex.: https://www.seudominio.com.br)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (preenchida automaticamente pela Vercel)
 * 3. http://localhost:4173 (apenas para desenvolvimento local)
 */
function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'http://localhost:4173';
}

/** Injeta a URL no index.html e gera sitemap.xml e robots.txt no build. */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'zaniva-seo-files',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl);
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
      const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles(resolveSiteUrl())],
  build: {
    target: 'es2020',
    cssMinify: true,
    // A orbe do manifesto (Three.js) fica em um arquivo separado, baixado só
    // quando a seção se aproxima da tela
    chunkSizeWarningLimit: 900,
  },
});
