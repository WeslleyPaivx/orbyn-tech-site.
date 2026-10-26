import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, clamp, isMobile, lowPower, reduced, smooth, whileVisible } from '../lib/env';
import { DiveRenderer, progressToFrame, type Manifest } from '../lib/frames';

const STAGES = ['Suspensa', 'Queda', 'Impacto', 'Mergulho', 'Revelação'];
const STAGE_AT = [0, 0.2, 0.4, 0.6, 0.85];

/**
 * Hero + mergulho: uma seção alta com um palco fixo (sticky).
 * A rolagem define o quadro do vídeo; rolar para cima volta a cena.
 */
export async function setupDive() {
  const section = $('.dive');
  const canvas = $<HTMLCanvasElement>('.dive-canvas', section);
  const poster = $<HTMLImageElement>('.dive-poster', section);
  const hero = $('[data-hero]', section);
  const cue = $('.scroll-cue', section);
  const shade = $('.dive-shade', section);
  const loader = $('.dive-loader', section);
  const stageItems = $$('.stages li', section);
  const meterNum = $('.stage-num', section);
  const meterName = $('.stage-name', section);
  const meterBar = $('.stage-meter b', section);
  const caps = $$('[data-window]', section).map((node) => {
    const [a, b] = (node.dataset.window ?? '0,1').split(',').map(Number);
    return { node, a, b };
  });

  let manifest: Manifest | null = null;
  try {
    const res = await fetch('/frames/manifest.json');
    if (res.ok) manifest = (await res.json()) as Manifest;
  } catch {
    manifest = null;
  }

  const mobile = isMobile() || lowPower;
  let renderer: DiveRenderer | null = null;
  if (manifest) {
    renderer = new DiveRenderer(canvas, manifest, mobile ? manifest.mobile : manifest.desktop, mobile ? 2 : 1.5);
    renderer.onFrame = () => wake();
    renderer
      .load()
      .catch(() => undefined)
      .finally(() => loader.classList.add('is-done'));
  } else {
    section.classList.add('no-frames');
  }

  let target = 0;
  let current = 0;
  let visible = true;
  let raf = 0;
  let lastStage = -1;
  let firstPaint = false;
  const t0 = performance.now();

  const apply = (p: number) => {
    // Hero sai nos primeiros 12%
    const heroOut = smooth(0.025, 0.12, p);
    hero.style.opacity = String(1 - heroOut);
    hero.style.transform = reduced ? 'none' : `translate3d(0, ${-heroOut * 60}px, 0)`;
    hero.style.visibility = heroOut >= 1 ? 'hidden' : 'visible';
    const cueO = 1 - smooth(0.01, 0.06, p);
    cue.style.opacity = String(cueO);
    cue.style.visibility = cueO <= 0.01 ? 'hidden' : 'visible';

    // Sombra lateral do hero e topo escuro da revelação
    shade.style.setProperty('--hero', String(1 - heroOut));
    shade.style.setProperty('--end', String(smooth(0.84, 0.92, p)));

    for (const { node, a, b } of caps) {
      const t = (p - a) / (b - a);
      const o = t <= 0 || t >= 1 ? 0 : Math.min(1, t * 7, (1 - t) * 7);
      node.style.opacity = String(o);
      node.style.visibility = o <= 0 ? 'hidden' : 'visible';
      if (!reduced) node.style.transform = `translate3d(0, ${(1 - o) * 28}px, 0)`;
    }

    let stage = 0;
    for (let i = 0; i < STAGE_AT.length; i++) if (p >= STAGE_AT[i]) stage = i;
    if (stage !== lastStage) {
      lastStage = stage;
      stageItems.forEach((li, i) => li.classList.toggle('is-on', i === stage));
      meterNum.textContent = `0${stage + 1}`;
      meterName.textContent = STAGES[stage];
    }
    meterBar.style.transform = `scaleX(${p.toFixed(4)})`;
    section.style.setProperty('--p', p.toFixed(4));

    if (renderer) {
      renderer.follow = smooth(0.55, 1, p);
      const ho = 1 - heroOut;
      if (ho !== renderer.heroOffset) {
        renderer.heroOffset = ho;
        renderer.markDirty();
      }
      renderer.fadeOut = smooth(0.95, 1, p) * 0.9;
    }
  };

  const draw = (p: number, now: number) => {
    if (!renderer) return;
    let f = progressToFrame(p, renderer.sourceFrames - 1);
    // Garrafa "suspensa": oscila devagar entre os primeiros quadros enquanto ninguém rola
    if (!reduced && p < 0.2) {
      const idle = (1 - smooth(0, 0.2, p)) * 2.4 * (1 - Math.cos((now - t0) / 1000 * 1.15)) * 0.5;
      f += idle;
    }
    renderer.render(f, !firstPaint);
    if (!firstPaint && renderer.painted) {
      firstPaint = true;
      poster.classList.add('is-hidden');
    }
  };

  const tick = (now: number) => {
    raf = 0;
    if (!visible) return;
    const k = reduced ? 1 : mobile ? 0.22 : 0.14;
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.0002) current = target;
    apply(current);
    draw(current, now);
    const idle = !reduced && current < 0.2;
    if (idle || current !== target || !firstPaint) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(tick);
  };

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      target = clamp(self.progress);
      wake();
    },
    onRefresh: (self) => {
      target = clamp(self.progress);
      current = target;
      wake();
    },
  });

  whileVisible(section, (v) => {
    visible = v;
    if (v) {
      renderer?.markDirty();
      wake();
    }
  }, '0px');

  // "Explore a experiência" leva ao começo da queda
  $$<HTMLAnchorElement>('[data-explore]', section).forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const top = section.getBoundingClientRect().top + window.scrollY;
      const span = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * 0.3, behavior: reduced ? 'auto' : 'smooth' });
    }),
  );

  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    // No celular a barra de endereço muda só a altura: não redesenha à toa
    if (mobile && window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    renderer?.resize();
    wake();
  });

  apply(0);
  wake();
  return renderer;
}
