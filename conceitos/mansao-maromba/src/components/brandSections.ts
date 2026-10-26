import { gsap } from 'gsap';
import { $, $$, reduced } from '../lib/env';

/** Manifesto: as palavras sobem com a rolagem; SAABOOOR estica no fim. */
export function setupManifesto() {
  const section = $('.manifesto');
  const words = $$('.mw', section);
  if (reduced) return;
  gsap.fromTo(
    words,
    { yPercent: 110, opacity: 0, rotate: 4 },
    {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: section, start: 'top 80%', end: 'center 55%', scrub: 0.6 },
    },
  );
  gsap.fromTo(
    '.mw-hot',
    { scaleX: 0.72 },
    { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'center 70%', end: 'bottom 60%', scrub: 0.6 } },
  );
}

/** Chamada final: a logo original volta em branco sobre preto. */
export function setupFinal() {
  const logo = $('.final-logo');
  if (reduced) return;
  gsap.fromTo(
    logo,
    { scale: 1.25, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.final', start: 'top 85%', end: 'center center', scrub: 0.6 },
    },
  );
}

/** Entradas suaves de títulos e blocos. */
export function setupReveals() {
  const items = $$('.reveal');
  if (reduced) {
    items.forEach((n) => n.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  items.forEach((n) => io.observe(n));
}
