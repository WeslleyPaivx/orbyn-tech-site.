import { handleAnchorClick } from '../../lib/scroll';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';
import { StormOrb } from '../scene/StormOrb';

/**
 * 02 — MANIFESTO.
 *
 * Manchete grande à esquerda, orbe de partículas à direita. A orbe vive DENTRO
 * da seção, mascarada em elipse — não é mais um canvas global atrás da página
 * inteira. Era essa camada global que fazia a nuvem disputar contraste com
 * cada parágrafo do site.
 */
export function Manifesto() {
  return (
    <section
      className="section-z surface-dark surface-grid manifesto-z"
      id="manifesto"
      aria-labelledby="manifesto-title"
    >
      <div className="chip-noise" aria-hidden="true" />
      <StormOrb />

      <div className="margin-codes" aria-hidden="true">
        • IDEIAS
        <br />• ESTRATÉGIA
        <br />• TECNOLOGIA
        <br />• CRIATIVIDADE
        <br />• EVOLUÇÃO
      </div>
      <div className="point-mark" aria-hidden="true" />

      <div className="container-z">
        <Reveal className="manifesto-content">
          <Eyebrow index="02" label="Manifesto" />
          <h2 id="manifesto-title" className="display-z">
            Não criamos
            <br />
            apenas presença.
            <br />
            <span className="shine-z">Criamos</span>
            <br />
            possibilidades.
          </h2>
          <p className="dim-z">
            Transformamos ideias em soluções digitais que conectam marcas, pessoas e resultados.
          </p>
          <a
            className="btn-z is-ghost"
            href="#processo"
            onClick={handleAnchorClick('processo')}
            style={{ marginTop: 23 }}
          >
            Conheça nossa abordagem ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
