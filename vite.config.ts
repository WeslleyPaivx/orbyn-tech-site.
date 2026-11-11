import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
  <url>
    <loc>${siteUrl}/privacidade</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${siteUrl}/termos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
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

/**
 * CSS crítico: só o que a cortina de carregamento precisa para aparecer.
 * É a única coisa visível até a página estar pronta, então é tudo o que a
 * primeira tela precisa. Valores copiados de index.css (tokens e .preloader).
 *
 * As regras entram nas MESMAS camadas do Tailwind, declaradas na mesma ordem:
 * assim, quando a folha completa chega, ela vence qualquer empate e nada do
 * visual muda.
 *
 * A CSP exige o hash deste texto em vercel.json. Mudou uma vírgula aqui, o
 * build falha e mostra o hash novo para colar lá.
 */
const CRITICAL_CSS =
  '@layer theme,base,components,utilities;' +
  "@layer base{html,body{margin:0;background-color:#080914;color:#f8f5fd;font-family:'Inter Variable','Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}}" +
  '@layer components{' +
  '.preloader{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background-color:#080914}' +
  '.preloader-column{display:flex;width:16rem;flex-direction:column;align-items:center;gap:1.5rem}' +
  '@media (min-width:768px){.preloader-column{width:20rem}}' +
  '.preloader-mark{font-size:40px;letter-spacing:-0.083em;font-weight:780;line-height:1;color:#f8f5fd}' +
  '.preloader-rule{position:relative;height:1px;width:100%;background:rgb(248 245 253/0.25)}' +
  '.preloader-fill{position:absolute;inset:0;background:#f096d7;transform:scaleX(0);transform-origin:left}' +
  '.preloader-readout{margin:0;font-size:11px;letter-spacing:0.28em;font-variant-numeric:tabular-nums;color:rgb(248 245 253/0.45)}' +
  '.preloader-bracket{position:absolute;box-sizing:border-box;width:2.5rem;height:2.5rem;border:0 solid rgb(240 150 215/0.55)}' +
  ".preloader-bracket[data-corner='tl']{top:2.5rem;left:2.5rem;border-top-width:1px;border-left-width:1px}" +
  ".preloader-bracket[data-corner='tr']{top:2.5rem;right:2.5rem;border-top-width:1px;border-right-width:1px}" +
  ".preloader-bracket[data-corner='bl']{bottom:2.5rem;left:2.5rem;border-bottom-width:1px;border-left-width:1px}" +
  ".preloader-bracket[data-corner='br']{bottom:2.5rem;right:2.5rem;border-bottom-width:1px;border-right-width:1px}" +
  '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border-width:0}' +
  '}';

/**
 * Tira a folha de estilo do caminho da primeira pintura.
 *
 * O navegador esperava o CSS inteiro antes de desenhar qualquer coisa. Agora:
 * - o CSS crítico (a cortina) vai embutido no <head>;
 * - a folha completa é pré-carregada em alta prioridade, mas com media="print",
 *   que não bloqueia a pintura; main.tsx a liga assim que roda;
 * - a fonte Inter (latim) é pré-carregada, para a marca na cortina já sair
 *   na tipografia certa;
 * - sem JavaScript, um <noscript> carrega a folha do jeito normal.
 */
function asyncCss(): Plugin {
  const hash = `'sha256-${createHash('sha256').update(CRITICAL_CSS).digest('base64')}'`;
  return {
    name: 'zaniva-async-css',
    apply: 'build',
    buildStart() {
      const vercel = readFileSync(new URL('./vercel.json', import.meta.url), 'utf8');
      if (!vercel.includes(hash)) {
        this.error(`O CSS crítico mudou. Troque o hash da style-src em vercel.json por ${hash}`);
      }
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
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

        const font = Object.keys(ctx.bundle ?? {}).find((file) =>
          /inter-latin-(opsz|wght)-normal[^/]*\.woff2$/.test(file),
        );
        const fontTag = font
          ? `\n    <link rel="preload" as="font" type="font/woff2" href="/${font}" crossorigin>`
          : '';

        return html.replace('</title>', `</title>\n    <style>${CRITICAL_CSS}</style>${fontTag}`);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles(resolveSiteUrl()), asyncCss()],
  build: {
    target: 'es2020',
    cssMinify: true,
    // A orbe do manifesto (Three.js) fica em um arquivo separado, baixado só
    // quando a seção se aproxima da tela
    chunkSizeWarningLimit: 900,
  },
});
