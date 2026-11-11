import type { ReactNode } from 'react';
import { site } from '../../config/site';
import { Footer } from './Footer';

type LegalLayoutProps = {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
};

/**
 * Moldura das páginas legais (/privacidade e /termos): mesma marca, mesmas
 * superfícies e o mesmo rodapé do site, com o texto numa coluna de leitura.
 */
export function LegalLayout({ eyebrow, title, intro, children }: LegalLayoutProps) {
  return (
    <>
      <header className="legal-top-z">
        <div className="container-z">
          <a className="brand-z" href="/">
            zaniva.
          </a>
          <a className="legal-back-z" href="/">
            ← Voltar ao site
          </a>
        </div>
      </header>

      <main id="conteudo" className="section-z surface-dark surface-grid">
        <div className="container-z">
          <article className="legal-z">
            <p className="eyebrow-z">{eyebrow}</p>
            <h1 className="subhead-z">{title}</h1>
            <p className="legal-updated-z">Atualizado em {site.legal.updated}</p>
            <div className="legal-intro-z">{intro}</div>
            {children}
          </article>
        </div>
      </main>

      <Footer onHome={false} />
    </>
  );
}

/** Link de e-mail de contato, usado nos textos legais. */
export function EmailLink() {
  return <a href={`mailto:${site.email}`}>{site.email}</a>;
}
