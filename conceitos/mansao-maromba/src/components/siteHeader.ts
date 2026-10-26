import { $, $$ } from '../lib/env';

/** Cabeçalho fixo: fundo aparece ao rolar; menu do celular abre em tela cheia. */
export function setupHeader() {
  const header = $('.site-header');
  const burger = $<HTMLButtonElement>('.burger');
  const menu = $('#menu');
  const html = document.documentElement;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-solid', window.scrollY > 40);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setOpen = (open: boolean) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    html.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      ($('a', menu) as HTMLAnchorElement).focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      window.setTimeout(() => {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, 380);
    }
  };

  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  $$<HTMLAnchorElement>('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && html.classList.contains('menu-open')) {
      setOpen(false);
      burger.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setOpen(false));

  // Link ativo conforme a seção na tela
  const links = $$<HTMLAnchorElement>('.nav a');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const id = `#${e.target.id}`;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  ['inicio', 'original-zero', 'produtos', 'modos', 'conceito'].forEach((id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}
