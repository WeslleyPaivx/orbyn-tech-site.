// Serviços: a seção prende e o scroll vertical vira movimento para o lado, um painel por serviço.
// O scroll dirige só o trilho (contínuo); o conteúdo de cada painel entra por tempo quando ele chega.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function servicosH({ section, reduced }) {
  const track = section.querySelector('.sh__track');
  const panels = [...track.querySelectorAll('.sh__panel')];
  const bar = section.querySelector('.sh__bar i');

  if (reduced) {
    section.classList.add('is-static');
    return;
  }

  const dist = () => track.scrollWidth - section.clientWidth;
  const slide = gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${dist()}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      refreshPriority: 2,
      onUpdate: (self) => (bar.style.transform = `scaleX(${self.progress})`),
    },
  });

  panels.forEach((panel, i) => {
    const items = panel.querySelectorAll('[data-pop]');
    const lines = panel.querySelectorAll('.mf-lines path');
    const bars = panel.querySelectorAll('.mk-bars i');
    const show = () => {
      gsap.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, overwrite: true });
      if (lines.length) gsap.to(lines, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15, delay: 0.2, overwrite: true });
      if (bars.length) gsap.to(bars, { scaleY: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.25, overwrite: true });
    };
    const hide = () => {
      gsap.to(items, { opacity: 0, y: 24, duration: 0.3, ease: 'power3.in', overwrite: true });
      if (lines.length) gsap.to(lines, { strokeDashoffset: 1, duration: 0.3, overwrite: true });
      if (bars.length) gsap.to(bars, { scaleY: 0, duration: 0.3, overwrite: true });
    };
    gsap.set(items, { opacity: 0, y: 24 });
    gsap.set(lines, { strokeDashoffset: 1 });
    gsap.set(bars, { scaleY: 0 });

    if (i === 0) {
      // o primeiro painel já está na tela quando a seção chega
      ScrollTrigger.create({ trigger: section, start: 'top 65%', onEnter: show, onLeaveBack: hide });
    } else {
      ScrollTrigger.create({
        trigger: panel,
        containerAnimation: slide,
        start: 'left 65%',
        onEnter: show,
        onLeaveBack: hide,
      });
    }
  });
}
