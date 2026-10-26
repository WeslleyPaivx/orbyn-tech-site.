import { gsap } from 'gsap';
import { productById } from '../data/products';
import { Bubbles } from '../lib/bubbles';
import { $, reduced } from '../lib/env';
import { productImage } from './productImage';

export function setupZero() {
  const section = $('.zero');
  const slot = $('[data-product-slot]', section);
  slot.append(productImage(productById('original-zero'), { lazy: true, className: 'zero-img' }));
  const cap = document.createElement('figcaption');
  cap.textContent = 'Sabor Energético Original Zero · 1L';
  slot.append(cap);

  const bubbles = new Bubbles($<HTMLCanvasElement>('.bubbles', section), 0.8);
  bubbles.color = '233,185,87';

  if (reduced) return;
  gsap.fromTo(
    slot,
    { y: 90, rotate: -4 },
    {
      y: -40,
      rotate: 3,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    },
  );
}
