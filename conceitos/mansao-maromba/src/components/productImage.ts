import type { Product } from '../data/products';
import { el } from '../lib/env';

/**
 * Foto original do produto (recorte sem alterar rótulo, cor ou proporção).
 * Sem arquivo confirmado, mostra um espaço reservado honesto, nunca uma embalagem inventada.
 */
export function productImage(p: Product, opts: { lazy?: boolean; className?: string } = {}): HTMLElement {
  const box = el('div', `pimg ${opts.className ?? ''}`.trim());
  box.style.setProperty('--ratio', String(p.ratio));
  if (p.image) {
    const img = el('img');
    img.src = p.image;
    img.alt = `${p.name} ${p.volume}, fotografia original da embalagem`;
    img.decoding = 'async';
    img.loading = opts.lazy ? 'lazy' : 'eager';
    img.draggable = false;
    box.append(img);
  } else {
    box.classList.add('is-placeholder');
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', `${p.name} ${p.volume}: foto oficial aguardando arquivo`);
    const inner = el('div', 'ph-inner');
    inner.append(el('span', 'ph-k', p.volume), el('span', 'ph-name', p.display), el('span', 'ph-note', 'Foto oficial em breve'));
    box.append(inner);
  }
  return box;
}
