/**
 * Brilho que acompanha o cursor, em mistura de tela.
 *
 * Um escritor só para a página inteira, suavizado no próprio laço. Desligado
 * por completo em tela de toque e sob movimento reduzido — não é degradação,
 * é não escrever nada.
 *
 * Sem tratador de saída do ponteiro: mandar as coordenadas para fora da tela
 * faz o brilho ESCORREGAR para longe em vez de simplesmente parar.
 */
const LERP = 0.14;

export function startCursorGlow(): () => void {
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (coarse || reduced) return () => {};

  const node = document.getElementById('cursor-glow');
  if (!node) return () => {};

  let targetX = -400;
  let targetY = -400;
  let x = targetX;
  let y = targetY;
  let seen = false;
  let frame = 0;

  const onMove = (event: PointerEvent) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!seen) {
      // Pousa na primeira leitura, em vez de vir deslizando da borda.
      seen = true;
      x = targetX;
      y = targetY;
    }
  };

  const tick = () => {
    frame = requestAnimationFrame(tick);
    if (!seen) return;
    x += (targetX - x) * LERP;
    y += (targetY - y) * LERP;
    node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  frame = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('pointermove', onMove);
    cancelAnimationFrame(frame);
  };
}
