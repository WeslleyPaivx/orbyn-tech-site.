import { useEffect, useRef } from 'react';

/**
 * Coreografia dos projetos — a interação do ARTEFAKT trazida para o portfólio.
 *
 * Cada cartão chega torcido em perspectiva, se endireita ao alcançar a faixa
 * central da tela e volta a ceder quando sai dela. O destaque é marcado com a
 * classe `is-focused`, que o CSS usa para endireitar o navegador.
 *
 * Conduzido por ROLAGEM, não por hover: no celular não existe ponteiro, e foi
 * exatamente a inclinação de cinco graus no hover que o briefing apontou como
 * insuficiente. Aqui o movimento acontece para todo mundo.
 *
 * Um IntersectionObserver com várias faixas, em vez de ouvir o scroll: o
 * navegador faz a conta fora da linha principal e não há listener disparando a
 * cada quadro.
 */
export function useProjectChoreography() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const cards = Array.from(grid.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
          // A faixa central é onde o projeto "assume" a tela. Fora dela ele
          // volta à posição de repouso, torcido, para o próximo entrar.
          const rect = entry.boundingClientRect;
          const middle = rect.top + rect.height / 2;
          const viewport = window.innerHeight || 1;
          const centred = middle > viewport * 0.18 && middle < viewport * 0.82;
          card.classList.toggle('is-focused', entry.isIntersecting && centred);
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-10% 0px -10% 0px' },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return ref;
}
