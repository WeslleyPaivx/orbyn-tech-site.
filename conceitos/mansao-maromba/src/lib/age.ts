import { el, safeStorage } from './env';

/**
 * Confirmação de idade para a linha alcoólica.
 * A resposta vale para a sessão inteira e é compartilhada entre Modos e Vitrine.
 */
export type AgeState = 'unknown' | 'adult' | 'minor';

const KEY = 'mm-age';
let state: AgeState = (safeStorage.get(KEY) as AgeState | null) ?? 'unknown';
const listeners = new Set<(s: AgeState) => void>();

export const ageState = () => state;

export function setAge(next: AgeState) {
  state = next;
  safeStorage.set(KEY, next);
  document.documentElement.dataset.age = next;
  Array.from(listeners).forEach((fn) => fn(next));
}

export function onAgeChange(fn: (s: AgeState) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

document.documentElement.dataset.age = state;

/** Bloco de confirmação reutilizável. */
export function ageGate(context: string): HTMLElement {
  const box = el('div', 'age-gate');
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', 'Confirmação de idade');
  const badge = el('span', 'age-badge', '18+');
  const title = el('p', 'age-title');
  const text = el('p', 'age-text');
  const actions = el('div', 'age-actions');

  const render = () => {
    actions.replaceChildren();
    if (state === 'minor') {
      title.textContent = 'Conteúdo indisponível';
      text.textContent = 'Esta área apresenta bebidas alcoólicas e é restrita a maiores de 18 anos.';
      const back = el('button', 'btn btn-ghost btn-sm', 'Corrigir resposta');
      back.type = 'button';
      back.addEventListener('click', () => setAge('unknown'));
      actions.append(back);
      return;
    }
    title.textContent = 'Você tem 18 anos ou mais?';
    text.textContent = `${context} apresenta bebidas alcoólicas. Confirme sua idade para continuar.`;
    const yes = el('button', 'btn btn-solid btn-sm', 'Tenho 18 anos ou mais');
    yes.type = 'button';
    yes.addEventListener('click', () => setAge('adult'));
    const no = el('button', 'btn btn-ghost btn-sm', 'Não tenho');
    no.type = 'button';
    no.addEventListener('click', () => setAge('minor'));
    actions.append(yes, no);
  };
  render();
  // Some do quadro: para de ouvir sozinho
  const off = onAgeChange(() => {
    if (!box.isConnected) {
      off();
      return;
    }
    render();
  });
  box.append(badge, title, text, actions);
  return box;
}
