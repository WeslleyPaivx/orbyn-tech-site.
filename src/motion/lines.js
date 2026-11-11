// Entradas de texto por tempo: as linhas sobem da máscara quando chegam na tela e descem ao voltar
// para cima, para entrar de novo. Rótulos sem linha só sobem um pouco e aparecem.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function lines({ reduced }) {
  if (reduced) return;
  document.querySelectorAll('[data-lines]').forEach((el) => {
    const inner = el.querySelectorAll('.ln > span');
    const targets = inner.length ? inner : [el];
    const hidden = inner.length ? { yPercent: 110 } : { opacity: 0, y: 14 };
    const shown = inner.length ? { yPercent: 0 } : { opacity: 1, y: 0 };
    gsap.set(targets, hidden);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => gsap.to(targets, { ...shown, duration: 1.1, ease: 'expo.out', stagger: 0.07, overwrite: true }),
      onLeaveBack: () => gsap.to(targets, { ...hidden, duration: 0.4, ease: 'power3.in', overwrite: true }),
    });
  });
}
