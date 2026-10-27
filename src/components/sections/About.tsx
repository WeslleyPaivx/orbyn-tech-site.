import { site } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

const VALUES = [
  { icon: '♡', label: 'Parceria' },
  { icon: '◇', label: 'Compromisso' },
  { icon: '✣', label: 'Evolução' },
  { icon: '⌂', label: 'Resultados' },
];

/**
 * 07 — SOBRE A AGÊNCIA.
 *
 * As formas volumétricas no lugar dos retratos são deliberadas: não há foto
 * dos sócios e inventar uma seria mentira que o cliente descobre no primeiro
 * encontro. Quando as imagens reais existirem, basta preencher
 * `founders[].photo` na configuração central.
 */
export function About() {
  return (
    <section className="section-z surface-dark surface-grid" id="sobre" aria-labelledby="sobre-title">
      <div className="container-z">
        <div className="about-grid">
          <Reveal>
            <Eyebrow index="07" label="Sobre a agência" />
            <h2 id="sobre-title" className="subhead-z">
              Tecnologia e estratégia
              <br />
              para ir mais longe juntos.
            </h2>
            <p className="dim-z">
              A Zaniva Digital nasce da união de competências em desenvolvimento, automação e presença digital, com o
              propósito de ajudar negócios a evoluírem no ambiente online.
            </p>
            <a className="text-link-z" href="#contato" onClick={handleAnchorClick('contato')}>
              Conheça nossa história ↗
            </a>
          </Reveal>

          <Reveal className="founders-z" delay={120}>
            {site.founders.map((founder) => (
              <div className="founder-z" key={founder.name}>
                {founder.photo ? (
                  <img
                    src={founder.photo}
                    alt={`Retrato de ${founder.name}`}
                    loading="lazy"
                    decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="founder-shape" aria-hidden="true" />
                )}
                <h3>{founder.name}</h3>
                <span>Co-fundador</span>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="values-z" delay={200}>
          {VALUES.map((value) => (
            <div className="value-z" key={value.label}>
              <i aria-hidden="true">{value.icon}</i>
              {value.label}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
