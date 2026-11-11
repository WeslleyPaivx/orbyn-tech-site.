// Trabalhos: as letras do título começam espalhadas e giradas e se juntam quando ele chega (por tempo);
// as fotos abrem de baixo para cima ao entrar e têm um parallax leve dentro da moldura (preso ao scroll).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const rnd = gsap.utils.random;

export function trabalhos({ section, reduced }) {
  const letters = [...section.querySelectorAll('.trabalhos__title span')];
  const photos = [...section.querySelectorAll('.case-card__photo')];
  if (reduced) return;

  const scatter = () =>
    gsap.set(letters, {
      x: () => `${rnd(-28, 28)}vw`,
      y: () => `${rnd(-30, 30)}vh`,
      rotation: () => rnd(-50, 50),
      scale: () => rnd(0.35, 0.8),
    });
  scatter();
  ScrollTrigger.create({
    trigger: section.querySelector('.trabalhos__title'),
    start: 'top 80%',
    onEnter: () =>
      gsap.to(letters, {
        x: 0, y: 0, rotation: 0, scale: 1,
        duration: 1.5, ease: 'expo.out',
        stagger: { each: 0.04, from: 'random' },
        overwrite: true,
      }),
    onLeaveBack: () =>
      gsap.to(letters, {
        x: () => `${rnd(-28, 28)}vw`,
        y: () => `${rnd(-30, 30)}vh`,
        rotation: () => rnd(-50, 50),
        scale: () => rnd(0.35, 0.8),
        duration: 0.4, ease: 'power3.in', overwrite: true,
      }),
  });

  photos.forEach((photo) => {
    const img = photo.querySelector('img');
    gsap.set(photo, { clipPath: 'inset(100% 0% 0% 0%)' });
    ScrollTrigger.create({
      trigger: photo,
      start: 'top 85%',
      onEnter: () => gsap.to(photo, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', overwrite: true }),
      onLeaveBack: () => gsap.to(photo, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.4, ease: 'power3.in', overwrite: true }),
    });
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}
