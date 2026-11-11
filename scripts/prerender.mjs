/**
 * Coloca o HTML da página dentro do <div id="root"> de dist/index.html.
 *
 * Roda depois de `vite build` (cliente) e `vite build --ssr` (servidor):
 * importa o render() gerado em dist-ssr/ e grava o resultado no HTML final.
 * Se algo der errado, o build falha — melhor do que publicar uma página vazia
 * achando que está pré-renderizada.
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'dist', 'index.html');
const ssrDir = path.join(root, 'dist-ssr');
const ssrEntry = path.join(ssrDir, 'entry-server.js');

const EMPTY_ROOT = '<div id="root"></div>';

const { render } = await import(pathToFileURL(ssrEntry).href);
// Sem os atributos style="": a CSP (style-src sem 'unsafe-inline') os bloqueia
// e enche o console de erros. Robôs não precisam deles, e o React os aplica de
// novo ao montar a página no navegador.
const appHtml = render().replace(/ style="[^"]*"/g, '');

if (!appHtml || appHtml.length < 500) {
  throw new Error(`Pré-renderização suspeita: só ${appHtml?.length ?? 0} caracteres.`);
}

const template = await readFile(htmlPath, 'utf8');
if (!template.includes(EMPTY_ROOT)) {
  throw new Error('dist/index.html não tem <div id="root"></div> para preencher.');
}

await writeFile(htmlPath, template.replace(EMPTY_ROOT, `<div id="root">${appHtml}</div>`));
await rm(ssrDir, { recursive: true, force: true });

console.log(`Pré-renderizado: dist/index.html (+${(appHtml.length / 1024).toFixed(1)} kB de HTML)`);
