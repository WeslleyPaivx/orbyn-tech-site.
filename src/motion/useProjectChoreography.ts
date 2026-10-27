import { useEffect, useRef } from 'react';

/**
 * Coreografia dos projetos — o movimento do ARTEFAKT trazido para o portfólio.
 *
 * Cada cartão chega torcido em perspectiva, se endireita ao se aproximar do
 * centro da tela e volta a ceder quando se afasta. Conduzido por ROLAGEM, não
 * por hover: no celular não existe ponteiro, e foi a inclinação de cinco graus
 * no hover que o briefing apontou como insuficiente.
 *
 * POR QUE NÃO É MAIS UM IntersectionObserver COM CLASSE LIGA-DESLIGA:
 * no desktop os três cartões ficam lado a lado, com o mesmo topo e o mesmo
 * centro. Observados por interseção, eles entram e saem juntos — a coreografia
 * virava um único piscar simultâneo, não a sequência em que um projeto assume a
 * tela e cede ao próximo. Medido na página publicada: os três alternavam no
 * mesmo quadro.
 *
 * Agora cada cartão recebe um progresso CONTÍNUO (`--card-focus`, de 0 a 1)
 * calculado da sua própria distância ao centro da tela, com uma defasagem por
 * coluna para que resolvam da esquerda para a direita em vez de em bloco. No
 * celular, onde empilham, a sequência acontece naturalmente pela rolagem.
 */

/** Distância ao centro, em alturas de tela, onde o cartão chega ao repouso. */
const REACH = 0.62;
/** Defasagem entre colunas, em alturas de tela. Dá a leitura esquerda→direita. */
const COLUMN_PHASE = 0.1;

export function useProjectChoreography() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(grid.children) as HTMLElement[];
    if (!cards.length) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight || 1;
      const screenCentre = viewport / 2;

      // Colunas da linha atual: cartões que compartilham o mesmo topo estão
      // lado a lado, e são eles que precisam de defasagem entre si.
      const tops = cards.map((card) => Math.round(card.getBoundingClientRect().top));

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;

        const column = tops.slice(0, index).filter((top) => top === tops[index]).length;
        const phase = (column - 1) * COLUMN_PHASE * viewport;

        const distance = Math.abs(centre - screenCentre + phase) / (viewport * REACH);
        const focus = Math.max(0, 1 - Math.min(1, distance));

        card.style.setProperty('--card-focus', focus.toFixed(3));
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      cards.forEach((card) => card.style.removeProperty('--card-focus'));
    };
  }, []);

  return ref;
}
