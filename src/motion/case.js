// Case em destaque, preso ao scroll: começa com a foto em tela cheia e se afasta até a foto virar
// a tela verde da sala (medida em sala.json). Sala e foto usam o mesmo zoom em volta do centro da tela,
// então a foto sempre cai exatamente no retângulo. O scroll dirige só a câmera; o texto entra por tempo.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function caseZoom({ section, box, reduced }) {
  const stage = section.querySelector('.case__stage');
  const sala = section.querySelector('.case__sala');
  const screen = section.querySelector('.case__screen');
  const beats = section.querySelectorAll('[data-beat]');
  const geo = {};

  function measure() {
    const W = stage.clientWidth, H = stage.clientHeight;
    const c = Math.max(W / box.w, H / box.h);
    const dw = box.w * c, dh = box.h * c;
    const ox = (W - dw) / 2, oy = (H - dh) / 2;
    geo.rx = ox + box.x0 * dw; geo.ry = oy + box.y0 * dh;
    geo.rw = (box.x1 - box.x0) * dw; geo.rh = (box.y1 - box.y0) * dh;
    // sobra de 0,6% para cobrir o halo verde da borda do retângulo
    const m = geo.rw * 0.006;
    geo.rx -= m; geo.ry -= m; geo.rw += m * 2; geo.rh += m * 2;
    geo.cx = geo.rx + geo.rw / 2; geo.cy = geo.ry + geo.rh / 2;
    geo.s0 = Math.max(W / geo.rw, H / geo.rh) * 1.04;
    sala.style.setProperty('--ox', `${geo.cx}px`);
    sala.style.setProperty('--oy', `${geo.cy}px`);
  }
  function render(e) {
    const s = geo.s0 + (1 - geo.s0) * e;
    sala.style.transform = `scale(${s})`;
    Object.assign(screen.style, {
      inset: 'auto',
      left: `${geo.cx + (geo.rx - geo.cx) * s}px`,
      top: `${geo.cy + (geo.ry - geo.cy) * s}px`,
      width: `${geo.rw * s}px`,
      height: `${geo.rh * s}px`,
    });
  }
  measure();
  render(reduced ? 1 : 0);
  if (reduced) return;

  gsap.set(beats, { opacity: 0, y: 24 });
  let shown = false;
  const ease = gsap.parseEase('power2.inOut');
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=160%',
    pin: true,
    refreshPriority: 1,
    onRefresh: () => measure(),
    onUpdate: (self) => {
      render(ease(Math.min(1, self.progress / 0.8)));
      const want = self.progress > 0.62;
      if (want !== shown) {
        shown = want;
        gsap.to(beats, want
          ? { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, overwrite: true }
          : { opacity: 0, y: 24, duration: 0.35, ease: 'power3.in', overwrite: true });
      }
    },
  });
}
