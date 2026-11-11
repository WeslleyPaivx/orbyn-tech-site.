// Abertura: tela roxo-noite com o "Z°"; o anel enche como balão enquanto a contagem desce de 100 a 000,
// estufa, estoura e a cortina sobe. Nav, nome e textos do hero entram juntos.
import { gsap } from 'gsap';

export function intro({ loader, heroIn, reduced }) {
  if (!loader || reduced) {
    loader?.remove();
    gsap.set(heroIn, { opacity: 1, y: 0 });
    return Promise.resolve();
  }
  const ring = loader.querySelector('.loader__s i');
  const count = loader.querySelector('.loader__count');
  const n = { v: 100 };

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        loader.remove();
        resolve();
      },
    });
    tl.fromTo(ring, { scale: 0.2 }, { scale: 1, duration: 1.6, ease: 'elastic.out(1, 0.45)' }, 0)
      .to(n, {
        v: 0,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => (count.textContent = String(Math.round(n.v)).padStart(3, '0')),
      }, 0)
      .to(ring, { scale: 1.35, duration: 0.22, ease: 'power2.out' })
      .to(ring, { scale: 0, duration: 0.16, ease: 'power3.in' })
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '+=0.05')
      .fromTo(heroIn, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }, '-=0.45');
  });
}
