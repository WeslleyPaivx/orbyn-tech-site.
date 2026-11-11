// Estúdio: o pedestal sobe mais rápido que a página e a paisagem tem parallax dentro da moldura 16:9.
// Os dois presos ao scroll; o texto entra por tempo (lines.js).
import { gsap } from 'gsap';

export function estudio({ section, reduced }) {
  if (reduced) return;
  const media = section.querySelector('.estudio__media');
  const pedestal = section.querySelector('.estudio__pedestal');
  const img = section.querySelector('.estudio__frame img');
  const st = { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo(pedestal, { y: () => innerHeight * 0.12 }, { y: () => -innerHeight * 0.14, ease: 'none', scrollTrigger: st });
  gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { ...st } });
}
