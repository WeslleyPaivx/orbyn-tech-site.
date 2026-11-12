// ZANIVA DIGITAL — liga tudo, na ordem do template Sopro:
// 1) fontes e CSS; 2) assets do hero e da sala em paralelo, com a fonte do nome carregada;
// 3) gatilhos na ordem da página (o pin do case antes do Lenis); 4) abertura e refresh.
import '@fontsource/archivo-black/400.css';
import '@fontsource-variable/inter-tight';
import '@fontsource/jetbrains-mono/400.css';
import './styles/tokens.css';
import './styles/base.css';
import './sections/pages.css';
import './sections/servicos-h.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hero } from './motion/hero.js';
import { servicosH } from './motion/servicosH.js';
import { trabalhos } from './motion/trabalhos.js';
import { caseZoom } from './motion/case.js';
import { estudio } from './motion/estudio.js';
import { codeRain } from './motion/codeRain.js';
import { contato } from './motion/contato.js';
import { lines } from './motion/lines.js';
import { smoothScroll } from './motion/smooth.js';
import { menu } from './motion/menu.js';
import { intro } from './motion/intro.js';

// A folha de estilo chega com media="print" para não segurar a primeira tela (asyncCss no
// vite.config.js); aqui ela passa a valer. Até aqui, só a cortina aparece, pelo CSS crítico.
document.querySelectorAll('link[data-async-css]').forEach((link) => (link.media = 'all'));

gsap.registerPlugin(ScrollTrigger);
// F5 sempre volta ao topo: sem restauração do navegador nem a memória de scroll do ScrollTrigger,
// e a página sai rolada para o topo antes de recarregar.
history.scrollRestoration = 'manual';
ScrollTrigger.clearScrollMemory('manual');
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
addEventListener('beforeunload', () => scrollTo(0, 0));
scrollTo(0, 0);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let loader = document.querySelector('[data-loader]');

// Se a rede de segurança do CSS já tirou a cortina (JS lento), não há abertura.
if (loader && getComputedStyle(loader).visibility === 'hidden') {
  loader.remove();
  loader = null;
}
root.classList.replace('intro-on', 'intro-js');

const heroIn = document.querySelectorAll('[data-hero-in]');
if (loader && !reduced) gsap.set(heroIn, { opacity: 0, y: 14 });

async function boot() {
  const [caixa, image, sala] = await Promise.all([
    fetch('/infla/caixa.json').then((r) => r.json()),
    fetch('/infla/cheio.webp').then((r) => r.blob()).then((b) => createImageBitmap(b)),
    fetch('/img/sala.json').then((r) => r.json()),
    document.fonts.load('400 100px "Archivo Black"'),
  ]);

  hero({ section: document.querySelector('.hero'), image, caixa });
  servicosH({ section: document.querySelector('.sh'), reduced });
  trabalhos({ section: document.querySelector('.trabalhos'), reduced });
  caseZoom({ section: document.querySelector('.case'), box: sala, reduced });
  estudio({ section: document.querySelector('.estudio'), reduced });
  contato({ section: document.querySelector('.contato'), reduced });
  lines({ reduced });
  codeRain({ canvas: document.querySelector('.objetos__rain'), reduced, strength: 0.8 });
  codeRain({ canvas: document.querySelector('.pilha__rain'), reduced });

  const lenis = reduced ? null : smoothScroll();
  menu({ lenis, reduced });

  scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true });
  await intro({ loader, heroIn, reduced });
  root.classList.remove('intro-js');
  ScrollTrigger.refresh();
}

boot().catch((err) => {
  // Nunca deixar a cortina presa: sem os assets, a página aparece do mesmo jeito.
  console.error(err);
  loader?.remove();
  root.classList.remove('intro-js');
  gsap.set(heroIn, { opacity: 1, y: 0 });
});
