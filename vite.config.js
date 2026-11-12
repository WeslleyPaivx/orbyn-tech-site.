import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * URL pública do site, usada em canonical, Open Graph, sitemap.xml e robots.txt.
 * 1. SITE_URL (defina na Vercel quando tiver domínio próprio)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (preenchida pela Vercel)
 * 3. http://localhost:4173 (desenvolvimento)
 */
function resolveSiteUrl() {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'http://localhost:4173';
}

/** Injeta a URL nas páginas e gera sitemap.xml e robots.txt no build. */
function seoFiles(siteUrl) {
  return {
    name: 'zaniva-seo-files',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl);
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const url = (path, freq, priority) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url('/', 'monthly', '1.0')}
${url('/privacidade', 'yearly', '0.3')}
${url('/termos', 'yearly', '0.3')}
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

/**
 * CSS crítico da home: só a cortina da abertura, que é tudo o que aparece até a página
 * estar pronta. A folha completa chega depois sem segurar a primeira pintura.
 *
 * A CSP exige o hash deste texto em vercel.json. Mudou uma vírgula aqui, o build falha e
 * mostra o hash novo para colar lá.
 */
const CRITICAL_CSS =
  'html,body{margin:0;background:#0d0718}' +
  '.loader{position:fixed;inset:0;z-index:200;display:none;place-items:center;background:#0d0718;color:#f8f5fd}' +
  '.intro-on .loader,.intro-js .loader{display:grid}' +
  '@keyframes loader-failsafe{to{visibility:hidden;opacity:0}}' +
  '.intro-on .loader{animation:loader-failsafe .01s 4s forwards}' +
  ".mono-z{font-family:'Archivo Black','Arial Black',sans-serif;font-weight:400;line-height:1;display:inline-flex;align-items:flex-start}" +
  '.mono-z i{display:inline-block;box-sizing:border-box;width:.34em;height:.34em;margin-left:.04em;margin-top:.06em;border:.09em solid currentColor;border-radius:50%}' +
  '.loader__s{font-size:9vw}' +
  ".loader__count{position:absolute;right:clamp(16px,1.6vw,28px);bottom:clamp(16px,1.6vw,28px);font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.04em;font-variant-numeric:tabular-nums}";

/**
 * Tira a folha de estilo do caminho da primeira pintura (só na home, onde a cortina cobre a
 * página; nas legais a folha carrega do jeito normal, senão o texto apareceria sem estilo).
 * - o CSS crítico vai embutido no <head>;
 * - a folha completa é pré-carregada com media="print" (não bloqueia); main.js a liga;
 * - a fonte do monograma é pré-carregada; sem JavaScript, um <noscript> carrega a folha.
 */
function asyncCss() {
  const hash = `'sha256-${createHash('sha256').update(CRITICAL_CSS).digest('base64')}'`;
  return {
    name: 'zaniva-async-css',
    apply: 'build',
    buildStart() {
      const vercel = readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8');
      if (!vercel.includes(hash)) {
        this.error(`O CSS crítico mudou. Troque o hash da style-src em vercel.json por ${hash}`);
      }
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.path.endsWith('/index.html')) return html;
        const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g)];
        if (links.length === 0) throw new Error('Nenhuma folha de estilo encontrada no index.html');
        for (const [tag, href] of links) {
          html = html.replace(
            tag,
            `<link rel="preload" as="style" href="${href}" crossorigin>\n` +
              `    <link rel="stylesheet" href="${href}" media="print" data-async-css crossorigin>\n` +
              `    <noscript><link rel="stylesheet" href="${href}" crossorigin></noscript>`,
          );
        }
        const font = Object.keys(ctx.bundle ?? {}).find((f) => /archivo-black-latin-400-normal[^/]*\.woff2$/.test(f));
        const fontTag = font ? `\n    <link rel="preload" as="font" type="font/woff2" href="/${font}" crossorigin>` : '';
        return html.replace('</title>', `</title>\n    <style>${CRITICAL_CSS}</style>${fontTag}`);
      },
    },
  };
}

export default defineConfig({
  plugins: [seoFiles(resolveSiteUrl()), asyncCss()],
  build: {
    target: 'es2020',
    // nada embutido como data: (a CSP só aceita fonte e imagem do próprio site)
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        privacidade: resolve(process.cwd(), 'privacidade.html'),
        termos: resolve(process.cwd(), 'termos.html'),
      },
    },
  },
});
