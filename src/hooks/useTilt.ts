import type { PointerEvent } from 'react';

/**
 * Inclinação tridimensional dos cartões, conduzida pelo ponteiro.
 *
 * Adaptado do ARTEFAKT: perspectiva realista, deslocamento discreto e retorno
 * suave ao sair. A amplitude é propositalmente pequena — um cartão que gira
 * demais vira brinquedo, e o que está dentro dele aqui é trabalho de cliente.
 *
 * Só responde a mouse: no toque, `pointermove` chega durante a rolagem e o
 * cartão ficaria tremendo enquanto a pessoa só queria passar por ele.
 *
 * O reflexo (--glare-x/y) sai do mesmo evento, para não haver dois leitores da
 * mesma posição discordando por um quadro.
 */

const MAX_DEG = 5.5;

export function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();

  const px = (event.clientX - rect.left) / rect.width;
  const py = (event.clientY - rect.top) / rect.height;

  el.style.setProperty('--tilt-x', `${((0.5 - py) * MAX_DEG * 2).toFixed(2)}deg`);
  el.style.setProperty('--tilt-y', `${((px - 0.5) * MAX_DEG * 2).toFixed(2)}deg`);
  el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`);
  el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`);
}

/** Devolve o cartão ao repouso. Sem isto ele congela na última inclinação. */
export function untilt(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.setProperty('--tilt-x', '0deg');
  el.style.setProperty('--tilt-y', '0deg');
}
