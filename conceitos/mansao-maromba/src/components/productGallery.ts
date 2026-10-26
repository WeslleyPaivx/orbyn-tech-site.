import { gsap } from 'gsap';
import { PRODUCTS, RESPONSIBLE, type Product } from '../data/products';
import { ageGate, ageState, onAgeChange } from '../lib/age';
import { $, $$, el, reduced } from '../lib/env';
import { productImage } from './productImage';

/**
 * Vitrine: escolher um produto leva a garrafa do cartão até o centro do palco,
 * troca a cor do ambiente e revela nome e informações confirmadas.
 */
export function setupGallery() {
  const section = $('.gallery');
  const rail = $('.rail', section);
  const stage = $('.show-stage', section);
  const word = $('.show-word', section);
  const cat = $('.show-cat', section);
  const name = $('.show-name', section);
  const desc = $('.show-desc', section);
  const facts = $('.show-facts', section);
  const note = $('.show-note', section);
  const info = $('.show-info', section);

  let current: Product = PRODUCTS[1];
  let tl: gsap.core.Timeline | null = null;

  const fill = (p: Product) => {
    cat.textContent = `${p.category} · ${p.volume}`;
    name.textContent = p.name;
    desc.textContent = p.description;
    facts.replaceChildren(...p.facts.map((f) => el('li', '', f)));
    note.textContent = p.alcoholic ? RESPONSIBLE : p.image ? '' : 'Foto oficial aguardando arquivo.';
    note.classList.toggle('is-legal', p.alcoholic);
    word.textContent = p.display;
    section.style.setProperty('--g-bg', p.theme.bg);
    section.style.setProperty('--g-accent', p.theme.accent);
    section.style.setProperty('--g-glow', p.theme.glow);
  };

  const stageContent = (p: Product) => {
    if (p.alcoholic && ageState() !== 'adult') return ageGate('Este produto');
    const holder = el('div', 'show-product');
    holder.append(productImage(p, { className: 'show-img' }));
    return holder;
  };

  const select = (p: Product, from?: HTMLElement, first = false) => {
    if (!first && p.id === current.id) return;
    const prev = stage.firstElementChild as HTMLElement | null;
    current = p;
    $$<HTMLButtonElement>('.card', rail).forEach((c) => {
      const on = c.dataset.id === p.id;
      c.setAttribute('aria-selected', String(on));
      c.classList.toggle('is-on', on);
    });
    fill(p);
    const next = stageContent(p);

    if (first || reduced) {
      stage.replaceChildren(next);
      return;
    }
    tl?.kill();
    stage.append(next);
    tl = gsap.timeline();
    if (prev) {
      tl.to(prev, { opacity: 0, x: -80, rotate: -8, scale: 0.9, duration: 0.45, ease: 'power2.in', onComplete: () => prev.remove() }, 0);
    }
    // Vem do cartão clicado até o centro (FLIP)
    const fromImg = from?.querySelector('.pimg');
    if (fromImg && next.classList.contains('show-product')) {
      const a = fromImg.getBoundingClientRect();
      const b = next.getBoundingClientRect();
      const s = Math.max(0.15, a.height / Math.max(1, b.height));
      tl.fromTo(
        next,
        {
          x: a.left + a.width / 2 - (b.left + b.width / 2),
          y: a.top + a.height / 2 - (b.top + b.height / 2),
          scale: s,
          rotate: 10,
          opacity: 0.4,
        },
        { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.95, ease: 'expo.inOut' },
        0.05,
      );
    } else {
      tl.fromTo(next, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.2);
    }
    tl.fromTo([word], { opacity: 0, xPercent: 6 }, { opacity: 1, xPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.1);
    tl.fromTo(info.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, 0.3);
  };

  PRODUCTS.forEach((p) => {
    const c = el('button', `card${p.alcoholic ? ' is-alc' : ''}`);
    c.type = 'button';
    c.dataset.id = p.id;
    c.setAttribute('role', 'option');
    c.style.setProperty('--accent', p.theme.accent);
    const thumb = el('span', 'card-thumb');
    thumb.append(productImage(p, { lazy: true }));
    if (p.alcoholic) thumb.append(el('span', 'card-18', '18+'));
    const label = el('span', 'card-label');
    label.append(el('b', '', p.display), el('small', '', p.alcoholic ? `${p.volume} · 18+` : p.volume));
    c.append(thumb, label);
    c.addEventListener('click', () => select(p, c));
    rail.append(c);
  });

  onAgeChange(() => {
    if (!current.alcoholic) return;
    stage.replaceChildren(stageContent(current));
    if (!reduced) gsap.from(stage.children, { opacity: 0, y: 40, duration: 0.7, ease: 'expo.out' });
  });

  select(current, undefined, true);
}
