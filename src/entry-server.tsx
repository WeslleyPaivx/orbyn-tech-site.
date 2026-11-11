import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * Pré-renderização no build (scripts/prerender.mjs).
 *
 * Gera o HTML das seções para quem não roda JavaScript: ChatGPT, Perplexity,
 * prévias de link do WhatsApp e afins. No navegador o React monta a página do
 * zero por cima deste HTML (ver main.tsx), então nada do comportamento muda.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
