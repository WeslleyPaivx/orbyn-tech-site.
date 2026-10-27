import { useEffect, useState, type RefObject } from 'react';

/** Faixa de retenção: o elemento precisa entrar um pouco na tela antes de revelar. */
const REVEAL_ROOT_MARGIN = '0px 0px -64px 0px';

/**
 * Retorna true quando o elemento entra na tela (dispara uma única vez por padrão).
 *
 * Usa DOIS observadores, o que primeiro disparar — e isso não é redundância.
 * Só com a faixa de retenção existe uma falha real: qualquer elemento ancorado
 * perto do fim de uma seção da altura da tela para mais próximo da borda
 * inferior do que a faixa é funda, e nunca revela. O direito autoral no rodapé
 * é o caso clássico. O segundo observador, com threshold 1, pega exatamente os
 * elementos que já estão inteiros na tela. Nenhum dos dois se reduz ao outro.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, rootMargin = REVEAL_ROOT_MARGIN, threshold = 0.15 } = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observers: IntersectionObserver[] = [];
    let done = false;

    const disconnectAll = () => observers.forEach((observer) => observer.disconnect());

    const handle = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setInView(true);
        if (once) {
          done = true;
          disconnectAll();
        }
      } else if (!once && !done) {
        setInView(false);
      }
    };

    // O caso comum: rolando para dentro da tela, com a faixa de retenção.
    observers.push(new IntersectionObserver(handle, { rootMargin, threshold }));
    // A rede de segurança: qualquer coisa que já esteja inteira na tela.
    observers.push(new IntersectionObserver(handle, { threshold: 1 }));

    observers.forEach((observer) => observer.observe(el));
    return disconnectAll;
  }, [ref, once, rootMargin, threshold]);

  return inView;
}
