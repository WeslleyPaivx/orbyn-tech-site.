// Objetos: os infláveis enchem um a um quando a seção entra, boiam cada um no seu ritmo, fogem do cursor
// conforme a profundidade (data-depth) e sobem em velocidades diferentes com o scroll.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function objetos({ section, reduced }) {
  const objs = [...section.querySelectorAll('.obj')];
  if (reduced) return;

  const items = objs.map((el, i) => ({
    el,
    depth: parseFloat(el.dataset.depth) || 1,
    phase: i * 1.7,
    speed: 0.5 + ((i * 0.37) % 0.4),
    x: 0, y: 0, vx: 0, vy: 0,
    setX: gsap.quickSetter(el, 'x', 'px'),
    setY: gsap.quickSetter(el, 'y', 'px'),
  }));

  // enchem: escala 0 → 1, como balão
  gsap.set(objs, { scale: 0 });
  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    once: true,
    onEnter: () => gsap.to(objs, { scale: 1, duration: 1.4, ease: 'elastic.out(1, 0.42)', stagger: 0.12 }),
  });

  // sobem em velocidades diferentes (preso ao scroll)
  items.forEach((it) => {
    gsap.fromTo(it.el, { yPercent: 30 * it.depth }, {
      yPercent: -60 * it.depth,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // boiam e fogem do cursor (mola)
  const m = { x: 0, y: 0, on: false };
  section.addEventListener('pointermove', (e) => {
    m.x = e.clientX; m.y = e.clientY; m.on = true;
  });
  section.addEventListener('pointerleave', () => (m.on = false));

  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(section);
  gsap.ticker.add((time, dtMs) => {
    if (!visible) return;
    const dt = Math.min(0.05, dtMs / 1000);
    for (const it of items) {
      const floatY = Math.sin(time * it.speed + it.phase) * 14 * it.depth;
      const floatX = Math.cos(time * it.speed * 0.7 + it.phase) * 6 * it.depth;
      let tx = floatX, ty = floatY;
      if (m.on) {
        const r = it.el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = cx - m.x, dy = cy - m.y;
        const d = Math.hypot(dx, dy);
        const R = Math.max(r.width, 160) * 1.3;
        if (d < R) {
          const f = Math.pow(1 - d / R, 2) * 120 * it.depth;
          tx += (dx / (d || 1)) * f;
          ty += (dy / (d || 1)) * f;
        }
      }
      const k = 60, c = 10;
      it.vx += ((tx - it.x) * k - it.vx * c) * dt; it.x += it.vx * dt;
      it.vy += ((ty - it.y) * k - it.vy * c) * dt; it.y += it.vy * dt;
      it.setX(it.x);
      it.setY(it.y);
    }
  });
}
