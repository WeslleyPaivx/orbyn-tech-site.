import { useState } from 'react';
import { navItems, site, whatsappMessages } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { HeroMedia } from './HeroMedia';

/**
 * 01 — HERO.
 *
 * A paisagem Pink Grass ocupa o quadro inteiro e a navegação vive DENTRO dela,
 * clara, sem barra fixa — como na referência aprovada. O véu da HeroMedia
 * clareia o terço esquerdo justamente para a manchete preta ter contraste
 * sobre a paisagem sem precisar de caixa atrás do texto.
 */
export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <section className="hero-z" id="inicio" aria-labelledby="hero-title">
      <HeroMedia />

      <nav className="nav-z container-z" aria-label="Navegação principal">
        <a className="brand-z" href="#inicio" onClick={handleAnchorClick('inicio', close)}>
          zaniva.
        </a>

        <button
          type="button"
          className="menu-btn-z"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="navlinks"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>

        <div id="navlinks" className={`navlinks-z ${menuOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={handleAnchorClick(item.id, close)}>
              {item.label}
            </a>
          ))}
          <a
            className="btn-z"
            href={whatsappUrl(whatsappMessages.quote)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Orçamento ↗
          </a>
        </div>
      </nav>

      <div className="hero-content container-z">
        <div className="hero-copy">
          <p className="eyebrow-z">AGÊNCIA DIGITAL</p>
          <h1 id="hero-title">
            O digital ganha
            <br />
            uma <span className="gradient-word">nova dimensão.</span>
          </h1>
          <p className="hero-lead">{site.description}</p>
          <div className="hero-actions">
            <a className="btn-z is-ink" href="#solucoes" onClick={handleAnchorClick('solucoes')}>
              Conheça nossas soluções ↗
            </a>
            <a
              className="btn-z is-light"
              href={whatsappUrl(whatsappMessages.quote)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Solicitar orçamento ↗
            </a>
          </div>
        </div>
      </div>

      <div className="hero-bottom container-z" aria-hidden="true">
        <div className="scroll-hint">
          Scroll
          <div className="scroll-line" />
        </div>
        <div className="mini-labels">
          <span>ESTRATÉGIA</span>
          <span>TECNOLOGIA</span>
          <span>RESULTADOS</span>
        </div>
        <span className="page-num">01 / 08</span>
      </div>
    </section>
  );
}
