// Estúdio: as fotos dos fundadores têm um parallax leve dentro do círculo, e a segunda sobe um pouco
// mais rápido que a página. Os dois presos ao scroll; o texto entra por tempo (lines.js).
import { gsap } from 'gsap';

export function estudio({ section, reduced }) {
  if (reduced) return;
  const fundadores = section.querySelector('.fundadores');
  const st = { trigger: fundadores, start: 'top bottom', end: 'bottom top', scrub: true };
  section.querySelectorAll('.fundador__foto img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { ...st } });
  });
  const segundo = section.querySelector('.fundador--2');
  gsap.fromTo(segundo, { y: () => innerHeight * 0.06 }, { y: () => -innerHeight * 0.06, ease: 'none', scrollTrigger: { ...st } });
}
