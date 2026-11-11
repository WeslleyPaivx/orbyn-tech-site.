import App from './App';
import { Privacidade } from './pages/Privacidade';
import { Termos } from './pages/Termos';

/**
 * As páginas do site. A home é a página única de sempre; as legais são
 * páginas à parte, cada uma com o seu HTML gerado no build (prerender.mjs),
 * então trocar de página é uma navegação normal do navegador.
 */
export type PageMeta = { title: string; description: string };

export const legalPages: Record<string, PageMeta> = {
  '/privacidade': {
    title: 'Política de privacidade | ZANIVA DIGITAL',
    description:
      'Quais dados o site da Zaniva Digital coleta, para quê, com quem compartilha e como pedir acesso, correção ou exclusão, conforme a LGPD.',
  },
  '/termos': {
    title: 'Termos de uso | ZANIVA DIGITAL',
    description:
      'Como funciona a contratação da Zaniva Digital: briefing, contrato, prazos, ajustes, cancelamento e reembolso.',
  },
};

/** "/privacidade/" e "/privacidade.html" viram "/privacidade". */
export function normalizePath(pathname: string): string {
  const path = pathname.replace(/\.html$/, '').replace(/\/+$/, '');
  return path === '' || path === '/index' ? '/' : path;
}

export function Page({ path }: { path: string }) {
  if (path === '/privacidade') return <Privacidade />;
  if (path === '/termos') return <Termos />;
  return <App />;
}
