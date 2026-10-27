/**
 * Campo de ponteiro — um único escritor para a página inteira.
 *
 * Publica a posição do cursor em pixels de viewport como quatro propriedades
 * customizadas em :root, suavizadas no mesmo laço. A grade (.lattice-bars) lê
 * essas propriedades e acende as células próximas.
 *
 * Decisões herdadas do ARTEFAKT que não são enfeite:
 *
 *  - Dois pares de coordenadas. O segundo persegue mais devagar e forma o
 *    rastro do brilho; sem ele o realce parece um disco colado no cursor.
 *  - Estacionar fora da tela (-100vw) e pousar na PRIMEIRA leitura, em vez de
 *    deslizar desde a borda — senão a página acende sozinha ao carregar.
 *  - Nenhum tratador de `pointerleave`. Mandar as coordenadas para fora faz o
 *    brilho ESCORREGAR para longe em vez de simplesmente parar, e um evento de
 *    saída espúrio traz tudo de volta com um salto no próximo movimento.
 *  - Desligado por completo em tela de toque e sob movimento reduzido. Não é
 *    degradação: é não escrever nada, nunca.
 */

const LERP = 0.12;
const LAG_LERP = 0.045;

/** Converte uma taxa por quadro de 60Hz para o intervalo real decorrido. */
const frameLerp = (k: number, dt: number) => 1 - Math.pow(1 - k, dt / (1000 / 60));

export function startPointerField(): () => void {
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (coarse || reduced) return () => {};

  const root = document.documentElement;

  // Longe da tela: nada aceso antes de o ponteiro ter sido visto.
  let targetX = -window.innerWidth;
  let targetY = -window.innerHeight;
  let x = targetX;
  let y = targetY;
  let lagX = targetX;
  let lagY = targetY;

  let seen = false;
  let frame = 0;
  let last = performance.now();

  const onMove = (event: PointerEvent) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!seen) {
      // Pousa na primeira leitura em vez de vir deslizando da borda.
      seen = true;
      x = targetX;
      y = targetY;
      lagX = targetX;
      lagY = targetY;
    }
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    const dt = Math.min(now - last, 100);
    last = now;
    if (!seen) return;

    const k = frameLerp(LERP, dt);
    const kLag = frameLerp(LAG_LERP, dt);
    x += (targetX - x) * k;
    y += (targetY - y) * k;
    lagX += (targetX - lagX) * kLag;
    lagY += (targetY - lagY) * kLag;

    root.style.setProperty('--pointer-x', `${x.toFixed(1)}px`);
    root.style.setProperty('--pointer-y', `${y.toFixed(1)}px`);
    root.style.setProperty('--pointer-lag-x', `${lagX.toFixed(1)}px`);
    root.style.setProperty('--pointer-lag-y', `${lagY.toFixed(1)}px`);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  frame = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('pointermove', onMove);
    cancelAnimationFrame(frame);
  };
}
