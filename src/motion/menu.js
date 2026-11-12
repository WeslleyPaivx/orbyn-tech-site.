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
    if (a.dataset.panel !== undefined) goToPanel(Number(a.dataset.panel));
    else goTo(hash);
  });

  // um item da lista de serviços leva direto ao painel dele no carrossel horizontal
  function goToPanel(i) {
    const sh = document.querySelector('.sh');
    const panel = sh?.querySelectorAll('.sh__panel')[i];
    if (!panel) return;
    if (sh.classList.contains('is-static')) {
      sh.scrollIntoView();
      sh.scrollTo({ left: panel.offsetLeft });
      return;
    }
    // preso, o scroll vertical anda 1:1 com o trilho: o painel i fica a i larguras do início do pin
    const start = sh.parentElement.classList.contains('pin-spacer') ? sh.parentElement.offsetTop : sh.offsetTop;
    const y = start + panel.offsetLeft + 2;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else scrollTo({ top: y });
  }
}
