/**
 * Cortina de carregamento.
 *
 * Atrelada a prontidão REAL, não a um cronômetro. Uma duração fixa é uma
 * promessa sobre a rede que nada consegue cumprir: cache quente sai quase na
 * hora, cache frio recebe a verdade.
 *
 * Três portões:
 *   1. document.fonts.ready — a tipografia da marca já carregou
 *   2. window.load          — a página terminou de carregar
 *   3. 'zaniva-hero-ready'  — o poster da paisagem já pode ser pintado
 *
 * O terceiro portão é onde este site se separa do ARTEFAKT. Lá a cortina
 * espera a cena WebGL, porque o 3D É o produto. Aqui o que o visitante encara
 * primeiro é a paisagem Pink Grass; a nuvem de partículas só aparece depois
 * que ele rola. Esperar o WebGL deixaria a cortina de pé aguardando algo que
 * ainda nem está em cena — e a cena, de propósito, só carrega depois da
 * primeira pintura. O portão certo é o poster do hero, que é o LCP.
 *
 * PATIENCE_MS é a rede de segurança: uma cortina capaz de sobreviver aos
 * próprios portões é pior do que não ter cortina nenhuma.
 *
 * FLOOR_MS existe para o cache quente não fazer a cortina PISCAR.
 *
 * O contador PERSEGUE o alvo em vez de exibi-lo, e avança em direção ao
 * próximo portão em vez de ficar parado entre eles — senão a contagem lê como
 * três saltos, e não como algo enchendo.
 */

const PATIENCE_MS = 8000;
const FLOOR_MS = 700;
const COUNT_LERP = 0.08;

/** Evento que o hero dispara quando o poster da paisagem está pronto. */
export const HERO_READY_EVENT = 'zaniva-hero-ready';

export function startPreloader(): void {
  const curtain = document.querySelector<HTMLElement>('[data-preloader]');
  if (!curtain) return;

  const fill = curtain.querySelector<HTMLElement>('[data-preloader-fill]');
  const count = curtain.querySelector<HTMLElement>('[data-preloader-count]');

  const started = performance.now();
  let gatesDone = 0;
  const TOTAL_GATES = 3;
  let finished = false;
  let dismissed = false;
  let shown = 0;
  let frame = 0;

  // Declarado ANTES dos portões: um portão pode fechar de forma síncrona (a
  // página já estar carregada quando isto roda) e chamar a saída na mesma
  // volta. Declarado depois, cairia na zona morta temporal do const.
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    cancelAnimationFrame(frame);
    if (count) count.textContent = '100';
    if (fill) fill.style.transform = 'scaleX(1)';
    curtain.setAttribute('data-leaving', 'true');
    // Removido do DOM depois da saída: uma cortina invisível ainda é um
    // elemento de tela cheia na frente de tudo.
    window.setTimeout(() => curtain.remove(), 700);
  };

  const gate = () => {
    gatesDone += 1;
    if (gatesDone < TOTAL_GATES) return;
    finished = true;
    // A saída é agendada por RELÓGIO, não pelo laço de animação.
    const waited = performance.now() - started;
    window.setTimeout(dismiss, Math.max(0, FLOOR_MS - waited));
  };

  // Portão 1 — fontes
  if (document.fonts?.ready) document.fonts.ready.then(gate).catch(gate);
  else gate();

  // Portão 2 — carga da página
  if (document.readyState === 'complete') gate();
  else window.addEventListener('load', gate, { once: true });

  // Portão 3 — o poster do hero
  window.addEventListener(HERO_READY_EVENT, gate, { once: true });

  // O laço cuida APENAS do número e da barra enchendo. Ele não decide mais
  // quando a cortina sai: quem decide são os portões e o relógio acima.
  const tick = () => {
    if (dismissed) return;
    frame = requestAnimationFrame(tick);

    const target = gatesDone / TOTAL_GATES;
    // Sem o teto a contagem para entre os portões; com ele, ela escorre.
    const ceiling = finished ? 1 : Math.min(0.97, target + 0.12);
    shown += (ceiling - shown) * COUNT_LERP;

    if (fill) fill.style.transform = `scaleX(${shown.toFixed(4)})`;
    if (count) count.textContent = String(Math.round(shown * 100)).padStart(3, '0');
  };

  // Rede de segurança por RELÓGIO. Estava dentro do laço de animação, e era
  // um erro grave: requestAnimationFrame não roda em aba de fundo nem com o
  // painel escondido, então a proteção dependia exatamente daquilo de que ela
  // deveria proteger. Medido no preview: página pronta em 103ms, cortina
  // ainda de pé aos 9,6s com o contador parado em 000, saindo só aos 21,6s —
  // com o limite nominal de 8s. Uma cortina capaz de sobreviver aos próprios
  // portões é pior do que não ter cortina.
  window.setTimeout(dismiss, PATIENCE_MS);

  frame = requestAnimationFrame(tick);
}
