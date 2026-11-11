/**
 * Gera o HTML final de cada página a partir de dist/index.html.
 *
 * Roda depois de `vite build` (cliente) e `vite build --ssr` (servidor):
 * importa o render() gerado em dist-ssr/ e grava o resultado dentro do
 * <div id="root">.
 *
 * - dist/index.html        a home
 * - dist/privacidade.html  servida em /privacidade (cleanUrls na Vercel)
 * - dist/termos.html       servida em /termos
 *
 * Se algo der errado, o build falha — melhor do que publicar uma página vazia
 * achando que está pré-renderizada.
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const EMPTY_ROOT = '<div id="root"></div>';

const { render, legalPages } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

if (!template.includes(EMPTY_ROOT)) {
  throw new Error('dist/index.html não tem <div id="root"></div> para preencher.');
}

const siteUrl = template.match(/<link rel="canonical" href="([^"]*?)\/?"/)?.[1];
if (!siteUrl) throw new Error('Canonical não encontrado em dist/index.html.');

/** Troca um trecho que TEM de existir; se não existir, o build para. */
function swap(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Pré-renderização: não achei ${label}.`);
  return html.replace(pattern, replacement);
}

const escapeAttr = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

function renderPage(urlPath) {
  // Sem os atributos style="": a CSP (style-src sem 'unsafe-inline') os
  // bloqueia e enche o console de erros. Robôs não precisam deles, e o React
  // os aplica de novo ao montar a página no navegador.
  const appHtml = render(urlPath).replace(/ style="[^"]*"/g, '');
  if (!appHtml || appHtml.length < 500) {
    throw new Error(`Pré-renderização suspeita em ${urlPath}: só ${appHtml?.length ?? 0} caracteres.`);
  }
  return template.replace(EMPTY_ROOT, `<div id="root">${appHtml}</div>`);
}

// Home
await writeFile(path.join(dist, 'index.html'), renderPage('/'));
console.log('Pré-renderizado: /');

// Páginas legais
for (const [urlPath, meta] of Object.entries(legalPages)) {
  let html = renderPage(urlPath);
  const url = `${siteUrl}${urlPath}`;
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);

  html = swap(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, 'o <title>');
  html = swap(html, /(<meta\s+name="description"\s+content=")[^"]*/, `$1${description}`, 'a description');
  html = swap(html, /(<link rel="canonical" href=")[^"]*/, `$1${url}`, 'o canonical');
  html = swap(html, /(<meta property="og:url" content=")[^"]*/, `$1${url}`, 'o og:url');
  html = swap(html, /(<meta property="og:title" content=")[^"]*/, `$1${title}`, 'o og:title');
  html = swap(html, /(<meta\s+property="og:description"\s+content=")[^"]*/, `$1${description}`, 'o og:description');
  html = swap(html, /(<meta name="twitter:title" content=")[^"]*/, `$1${title}`, 'o twitter:title');
  html = swap(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*/, `$1${description}`, 'o twitter:description');

  // Sem a cortina: ela espera a paisagem do hero, que não existe aqui.
  html = swap(html, /\s*<!--\s*Cortina de carregamento[\s\S]*?-->/, '', 'o comentário da cortina');
  html = swap(html, /\s*<div data-preloader[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/, '', 'a cortina');
  // Nem o poster do hero, que esta página não usa.
  html = swap(html, /\s*<!-- O poster do hero[^>]*-->\s*<link rel="preload" as="image"[^>]*>/, '', 'o preload do poster');

  // Sem cortina para cobrir a página, a folha de estilo volta a ser carregada
  // do jeito normal: senão o texto apareceria sem estilo até o JavaScript rodar.
  html = swap(
    html,
    /<link rel="preload" as="style" href="([^"]+)" crossorigin>\s*<link rel="stylesheet" href="\1" media="print" data-async-css crossorigin>\s*<noscript><link rel="stylesheet" href="\1" crossorigin><\/noscript>/,
    '<link rel="stylesheet" href="$1" crossorigin>',
    'a folha de estilo',
  );

  await writeFile(path.join(dist, `${urlPath.slice(1)}.html`), html);
  console.log(`Pré-renderizado: ${urlPath}`);
}

await rm(ssrDir, { recursive: true, force: true });
