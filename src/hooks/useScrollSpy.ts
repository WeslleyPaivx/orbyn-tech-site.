import { useEffect, useState } from 'react';

/** Indica qual seção está ativa na tela, para destacar o item do menu. */
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });
        // A seção mais acima entre as visíveis é a ativa; seções fora do menu
        // (diferenciais, processo, FAQ) não destacam nenhum item
        setActive(ids.find((id) => visible.has(id)) ?? '');
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
