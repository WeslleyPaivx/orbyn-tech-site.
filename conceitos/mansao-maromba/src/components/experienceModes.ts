import { gsap } from 'gsap';
import { MODES, RESPONSIBLE, productById, type Mode } from '../data/products';
import { ageGate, ageState, onAgeChange } from '../lib/age';
import { Bubbles } from '../lib/bubbles';
import { $, $$, el, reduced } from '../lib/env';
import { productImage } from './productImage';

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

export function setupModes() {
  const section = $('.modes');
  const picker = $('.mode-picker', section);
  const visual = $('.mode-visual', section);
  const idx = $('.mode-index', section);
  const title = $('.mode-title', section);
  const text = $('.mode-text', section);
  const note = $('.mode-note', section);
  const copy = $('.mode-copy', section);
  const bubbles = new Bubbles($<HTMLCanvasElement>('.bubbles', section), 0.7);

  let current: Mode = MODES[0];
  let busy: gsap.core.Timeline | null = null;

  const buildVisual = (mode: Mode) => {
    const frag = document.createDocumentFragment();
    if (mode.alcoholic && ageState() !== 'adult') {
      frag.append(ageGate(`O Modo ${mode.label}`));
      return { frag, gated: true };
    }
    const row = el('div', `mode-products n${mode.products.length}`);
    mode.products.forEach((id, i) => {
      const p = productById(id);
      const item = el('figure', 'mode-product');
      item.style.setProperty('--i', String(i));
      item.append(productImage(p));
      const cap = el('figcaption');
      cap.append(el('b', '', p.name), el('span', '', `${p.volume}${p.alcoholic ? ' · 18+' : ''}`));
      item.append(cap);
      row.append(item);
    });
    frag.append(row);
    return { frag, gated: false };
  };

  const fillCopy = (mode: Mode) => {
    idx.textContent = `Modo ${mode.index} · ${mode.label}${mode.alcoholic ? ' · Bebida alcoólica 18+' : ''}`;
    title.textContent = mode.title;
    text.textContent = mode.text;
    note.textContent = mode.alcoholic
      ? RESPONSIBLE
      : mode.id === 'zero'
        ? 'Foto oficial do Original Zero 1L aguardando arquivo.'
        : '';
    note.classList.toggle('is-legal', mode.alcoholic);
  };

  const theme = (mode: Mode) => {
    const t = mode.theme;
    section.style.setProperty('--m-bg', t.bg);
    section.style.setProperty('--m-bg2', t.bg2);
    section.style.setProperty('--m-accent', t.accent);
    section.style.setProperty('--m-glow', t.glow);
    section.dataset.mode = mode.id;
    bubbles.color = hexToRgb(mode.id === 'noite' ? '#E9B957' : mode.alcoholic ? t.accent : '#E9B957');
  };

  const select = (mode: Mode, first = false) => {
    if (!first && mode.id === current.id) return;
    current = mode;
    $$<HTMLButtonElement>('.mode-btn', picker).forEach((b) => {
      const on = b.dataset.id === mode.id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    theme(mode);

    if (first || reduced) {
      const { frag } = buildVisual(mode);
      visual.replaceChildren(frag);
      fillCopy(mode);
      return;
    }
    busy?.kill();
    const out = Array.from(visual.children);
    busy = gsap
      .timeline()
      .to(out, { opacity: 0, y: 26, scale: 0.97, duration: 0.28, ease: 'power2.in' }, 0)
      .to(copy, { opacity: 0, y: 14, duration: 0.24, ease: 'power2.in' }, 0)
      .add(() => {
        const { frag } = buildVisual(mode);
        visual.replaceChildren(frag);
        fillCopy(mode);
        const items = $$('.mode-product, .age-gate', visual);
        gsap.fromTo(
          items,
          { opacity: 0, y: 70, rotate: (i: number) => (i % 2 ? 4 : -4) },
          { opacity: 1, y: 0, rotate: 0, duration: 0.85, ease: 'expo.out', stagger: 0.08 },
        );
        gsap.fromTo(copy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' });
      });
  };

  MODES.forEach((mode) => {
    const b = el('button', 'mode-btn');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.dataset.id = mode.id;
    b.style.setProperty('--accent', mode.theme.accent);
    b.append(el('span', 'mb-i', mode.index), el('span', 'mb-l', mode.label), el('span', `mb-t${mode.alcoholic ? ' is-18' : ''}`, mode.tag));
    b.addEventListener('click', () => select(mode));
    picker.append(b);
  });

  // Setas do teclado navegam entre os modos
  picker.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const i = MODES.findIndex((m) => m.id === current.id);
    const d = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
    const next = MODES[(i + d + MODES.length) % MODES.length];
    select(next);
    ($(`[data-id="${next.id}"]`, picker) as HTMLButtonElement).focus();
  });

  onAgeChange(() => {
    if (!current.alcoholic) return;
    const { frag } = buildVisual(current);
    visual.replaceChildren(frag);
    if (!reduced) gsap.from($$('.mode-product', visual), { opacity: 0, y: 60, duration: 0.8, ease: 'expo.out', stagger: 0.08 });
  });

  select(MODES[0], true);
}
