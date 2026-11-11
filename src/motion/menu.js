// Menu: cortina roxo-noite de tela cheia que desce, itens subindo um a um, o "+" vira "×".
// Fecha no Esc ou num link, que rola até a seção pelo Lenis. Os links de âncora da página também.
import { gsap } from 'gsap';

export function menu({ lenis, reduced }) {
  const btn = document.querySelector('.nav__menu');
  const label = btn.querySelector('.nav__menu-label');
  const plus = btn.querySelector('.nav__plus');
  const panel = document.getElementById('menu');
  const items = panel.querySelectorAll('.menu__txt');
  let open = false;

  const goTo = (hash) => {
    const target = hash === '#topo' ? 0 : document.querySelector(hash);
    if (target === null) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else if (target === 0) scrollTo({ top: 0 });
    else target.scrollIntoView();
  };

  function setOpen(next) {
    open = next;
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Fechar' : 'Menu';
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    if (open) lenis?.stop();
    else lenis?.start();
    const d = reduced ? 0 : 1;
    gsap.to(plus, { rotation: open ? 45 : 0, duration: 0.5 * d, ease: 'expo.out' });
    if (open) {
      gsap.set(panel, { visibility: 'visible' });
      gsap.to(panel, { clipPath: 'inset(0 0 0% 0)', duration: 0.8 * d, ease: 'expo.inOut', overwrite: true });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1 * d, ease: 'expo.out', stagger: 0.06, delay: 0.3 * d });
    } else {
      gsap.to(panel, {
        clipPath: 'inset(0 0 100% 0)', duration: 0.7 * d, ease: 'expo.inOut', overwrite: true,
        onComplete: () => gsap.set(panel, { visibility: 'hidden' }),
      });
    }
  }

  btn.addEventListener('click', () => setOpen(!open));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  // âncoras: menu, nav, cards e "voltar ao topo" rolam pelo Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (hash.length < 2) return;
    e.preventDefault();
    if (open) setOpen(false);
    goTo(hash);
  });
}
