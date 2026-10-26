import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENCY, FLAVORS, MODES, type Flavor } from './brand';
import { FrameSequence, LiveDive, loadFrameManifest, renderCanSnapshots, type ProductScene } from './product';
import { Wings } from './wings';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector(sel) as T;
const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(document.querySelectorAll(sel)) as T[];

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

function hasWebGL2() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

/** Ativa/desativa uma cena 3D só enquanto a seção dela está na tela (economiza bateria). */
function whileVisible(el: Element, cb: (v: boolean) => void) {
  new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: '10% 0px' }).observe(el);
}

/* ------------------------------------------------------------------------- textos fixos */
$$<HTMLAnchorElement>('[data-agency-whatsapp]').forEach((a) => (a.href = AGENCY.whatsapp));
$$<HTMLAnchorElement>('[data-agency-site]').forEach((a) => (a.href = AGENCY.site));
$$('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

/* ------------------------------------------------------------------------- 1. asas */
function setupIntro(webgl: boolean) {
  const section = $('.intro');
  const canvas = $<HTMLCanvasElement>('.wings');
  let wings: Wings | null = null;
  if (webgl) {
    try {
      wings = new Wings(canvas, { mobile, reducedMotion: reduced });
      whileVisible(section, (v) => wings!.setVisible(v));
      if (reduced) wings.renderAt(0, 0);
    } catch {
      wings = null;
    }
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      wings?.setScroll(self.progress);
      if (reduced) wings?.renderAt(0, self.progress);
    },
  });

  // A palavra VOLTRA cresce e some; a frase sai antes das asas decolarem
  gsap.fromTo('.intro-word', { scale: 1, opacity: 1 }, {
    scale: reduced ? 1 : 1.35,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: '70% bottom', scrub: true },
  });
  gsap.to('.intro-foot', {
    opacity: 0,
    y: reduced ? 0 : -30,
    ease: 'none',
    scrollTrigger: { trigger: section, start: '5% top', end: '35% top', scrub: true },
  });

  if (!reduced) {
    gsap.from('.intro-word', { opacity: 0, scale: 0.92, duration: 1.6, ease: 'expo.out', delay: 0.2 });
    gsap.from('.tagline', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.9 });
  }

  if (wings && !mobile && !reduced) {
    window.addEventListener(
      'pointermove',
      (e) => wings!.setPointer((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)),
      { passive: true },
    );
  }
  return wings;
}

/* ------------------------------------------------------------------------- 2. mergulho */
async function setupDive(webgl: boolean) {
  const section = $('.dive');
  const canvas = $<HTMLCanvasElement>('.dive-canvas');
  const caps = $$('.cap').map((el) => {
    const [a, b] = (el.dataset.window ?? '0,1').split(',').map(Number);
    return { el, a, b };
  });

  let scene: ProductScene | null = null;
  const manifest = await loadFrameManifest();
  if (manifest) scene = new FrameSequence(canvas, manifest, mobile);
  else if (webgl) {
    try {
      scene = new LiveDive(canvas, FLAVORS[0], mobile, reduced);
    } catch {
      scene = null;
    }
  }
  if (scene) whileVisible(section, (v) => scene!.setVisible(v));

  const update = (p: number) => {
    scene?.setProgress(p);
    // Cada legenda aparece e some dentro da sua janela de rolagem
    for (const { el, a, b } of caps) {
      const t = (p - a) / (b - a);
      const o = t <= 0 || t >= 1 ? 0 : Math.min(1, t * 6, (1 - t) * 6);
      el.style.opacity = String(o);
      el.style.transform = reduced ? 'none' : `translate3d(0, ${(1 - o) * 30}px, 0)`;
    }
  };
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => update(self.progress),
    onRefresh: (self) => update(self.progress),
  });
  return scene;
}

/* ------------------------------------------------------------------------- 3. palavras */
function setupWords() {
  $$('.word').forEach((el) => {
    const dir = Number(el.dataset.dir ?? 1);
    gsap.fromTo(
      el,
      { xPercent: dir > 0 ? -28 : 0 },
      {
        xPercent: dir > 0 ? 0 : -28,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: reduced ? true : 0.6 },
      },
    );
  });
}

/* ------------------------------------------------------------------------- 4. sabores */
function setupFlavors(images: Record<string, string>) {
  const section = $('.flavors');
  const img = $<HTMLImageElement>('.can-img');
  const name = $('.flavor-name');
  const sub = $('.flavor-sub');
  const notes = $('.notes');
  const stats = $('.stats');
  const tabs = $('.flavor-tabs');

  const select = (flavor: Flavor, first = false) => {
    section.style.setProperty('--flavor', flavor.can.band === '#101218' ? '#FF4A1C' : flavor.can.band);
    $$<HTMLButtonElement>('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.id === flavor.id)));
    name.textContent = flavor.name;
    sub.textContent = flavor.subtitle;
    notes.innerHTML = '';
    flavor.notes.forEach((n) => {
      const li = document.createElement('li');
      li.textContent = n;
      notes.append(li);
    });
    stats.innerHTML = '';
    flavor.stats.forEach((s) => {
      const row = document.createElement('div');
      row.className = 'stat';
      row.innerHTML = '<dt></dt><dd><i></i></dd><span></span>';
      row.querySelector('dt')!.textContent = s.label;
      row.querySelector('span')!.textContent = String(s.value);
      stats.append(row);
      requestAnimationFrame(() => requestAnimationFrame(() => row.querySelector('i')!.style.setProperty('--v', `${s.value}%`)));
    });
    const src = images[flavor.id];
    img.alt = `Lata de VOLTRA ${flavor.name}`;
    if (!src) {
      img.hidden = true;
      return;
    }
    if (first) {
      img.src = src;
      return;
    }
    img.classList.add('swap');
    window.setTimeout(() => {
      img.src = src;
      img.classList.remove('swap');
    }, 260);
  };

  FLAVORS.forEach((flavor) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.role = 'tab';
    b.dataset.id = flavor.id;
    b.textContent = flavor.name;
    b.addEventListener('click', () => select(flavor));
    tabs.append(b);
  });
  select(FLAVORS[0], true);

  if (!reduced) {
    gsap.from('.can-wrap', {
      y: 80,
      rotate: -8,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 70%' },
    });
  }
}

/* ------------------------------------------------------------------------- 5. modo */
function setupModes(images: Record<string, string>) {
  const options = $('.mode-options');
  const result = $('.mode-result');
  const labels = ['Energia', 'Foco', 'Fôlego'];

  const pick = (id: string) => {
    const mode = MODES.find((m) => m.id === id)!;
    const flavor = FLAVORS.find((f) => f.id === mode.flavor)!;
    $$<HTMLButtonElement>('.mode-btn').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.id === id)));
    result.innerHTML = '';
    const h = document.createElement('h3');
    h.textContent = `Modo ${mode.label}`;
    const p = document.createElement('p');
    p.textContent = mode.line;
    const bars = document.createElement('dl');
    bars.className = 'stats';
    mode.bars.forEach((v, i) => {
      const row = document.createElement('div');
      row.className = 'stat';
      row.innerHTML = '<dt></dt><dd><i></i></dd><span></span>';
      row.querySelector('dt')!.textContent = labels[i];
      row.querySelector('span')!.textContent = String(v);
      bars.append(row);
      requestAnimationFrame(() => requestAnimationFrame(() => row.querySelector('i')!.style.setProperty('--v', `${v}%`)));
    });
    const pickEl = document.createElement('div');
    pickEl.className = 'pick';
    if (images[flavor.id]) {
      const im = document.createElement('img');
      im.src = images[flavor.id];
      im.alt = '';
      im.width = 84;
      im.height = 126;
      pickEl.append(im);
    }
    const txt = document.createElement('div');
    txt.innerHTML = '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.18em;text-transform:uppercase">Sua lata</p><strong></strong>';
    txt.querySelector('strong')!.textContent = `VOLTRA ${flavor.name}`;
    pickEl.append(txt);
    result.append(h, p, bars, pickEl);
    result.classList.remove('flash');
    void result.offsetWidth;
    result.classList.add('flash');
  };

  MODES.forEach((mode) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mode-btn';
    b.role = 'radio';
    b.dataset.id = mode.id;
    b.textContent = mode.label;
    b.addEventListener('click', () => pick(mode.id));
    options.append(b);
  });
  pick(MODES[0].id);
}

/* ------------------------------------------------------------------------- entradas */
function setupReveals() {
  if (reduced) return;
  $$('.section-title, .cta-title, .cta-text, .cta-actions').forEach((el) => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
}

/* ------------------------------------------------------------------------- início */
async function init() {
  const webgl = hasWebGL2();
  try {
    await Promise.race([document.fonts.load('80px Anton'), new Promise((r) => setTimeout(r, 1500))]);
  } catch {
    /* segue com a fonte de reserva */
  }

  const wings = setupIntro(webgl);
  setupWords();
  setupReveals();

  // Latas dos sabores: geradas uma vez a partir do mesmo modelo 3D da cena
  let images: Record<string, string> = {};
  if (webgl) {
    try {
      images = await renderCanSnapshots(FLAVORS, 600, 900);
    } catch {
      images = {};
    }
  }
  setupFlavors(images);
  setupModes(images);
  const dive = await setupDive(webgl);

  let lastW = innerWidth;
  window.addEventListener('resize', () => {
    if (mobile && innerWidth === lastW) return; // barra de endereço do celular
    lastW = innerWidth;
    wings?.resize();
    dive?.resize();
  });
  ScrollTrigger.refresh();
  document.documentElement.classList.add('ready');
  (window as unknown as { __voltra: unknown }).__voltra = { wings, dive };
}

init();
