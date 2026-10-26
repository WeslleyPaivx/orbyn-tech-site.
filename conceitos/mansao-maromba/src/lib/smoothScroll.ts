import { clamp, reduced } from './env';

/**
 * Rolagem suave com inércia no mouse/trackpad (desktop), no estilo do site de referência.
 * No celular fica a rolagem nativa do sistema, que já tem inércia e é a mais fluida ali.
 */
export interface Smooth {
  scrollTo(y: number, immediate?: boolean): void;
}

let instance: Smooth | null = null;

export function setupSmoothScroll(): Smooth | null {
  const fine = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(pointer: coarse)').matches;
  if (reduced || !fine) return null;

  const html = document.documentElement;
  let target = window.scrollY;
  let current = window.scrollY;
  let raf = 0;
  let active = false;
  const LERP = 0.11;

  const max = () => Math.max(0, html.scrollHeight - window.innerHeight);
  const locked = () => html.classList.contains('intro-lock') || html.classList.contains('menu-open');

  const tick = () => {
    current += (target - current) * LERP;
    if (Math.abs(target - current) < 0.4) {
      current = target;
      active = false;
    }
    window.scrollTo(0, current);
    raf = active ? requestAnimationFrame(tick) : 0;
  };
  const start = () => {
    active = true;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || locked()) return;
      // Rolagem lateral (trilho de produtos) segue nativa
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
      if (!active) target = current = window.scrollY;
      target = clamp(target + e.deltaY * unit, 0, max());
      start();
    },
    { passive: false },
  );

  // Teclado, barra de rolagem ou âncoras: acompanha sem brigar
  window.addEventListener(
    'scroll',
    () => {
      if (!active) target = current = window.scrollY;
    },
    { passive: true },
  );

  instance = {
    scrollTo(y: number, immediate = false) {
      target = clamp(y, 0, max());
      if (immediate) {
        current = target;
        window.scrollTo(0, target);
        return;
      }
      if (!active) current = window.scrollY;
      start();
    },
  };
  return instance;
}

/** Rola até uma posição, suave quando possível. */
export function scrollToY(y: number) {
  if (instance) instance.scrollTo(y);
  else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
}

/** Links internos (#secao) passam pela mesma rolagem suave. */
export function smoothAnchors(offset: () => number) {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a || a.hasAttribute('data-explore')) return;
    const id = a.getAttribute('href')!.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - (id === 'inicio' ? 0 : offset());
    scrollToY(y);
    history.replaceState(null, '', `#${id}`);
  });
}
