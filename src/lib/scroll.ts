import type { MouseEvent } from 'react';

/** Rola suavemente até a seção e atualiza o endereço (#secao) sem recarregar. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  const hash = id === 'inicio' ? window.location.pathname : `#${id}`;
  window.history.replaceState(null, '', hash);
}

/** Handler para links âncora (<a href="#id">) que mantém o link funcional sem JS. */
export function handleAnchorClick(id: string, after?: () => void) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    after?.();
    // Aguarda o fechamento do menu (liberação da rolagem) antes de rolar
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)));
  };
}
