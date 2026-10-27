import { processSteps } from '../../data/content';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 06 — NOSSO PROCESSO.
 *
 * Cinco etapas ligadas por um fio violeta no desktop. No celular o fio sai e
 * as etapas viram duas colunas: uma linha horizontal espremida em 360px vira
 * um risco ilegível em vez de uma ligação.
 */
export function Process() {
  return (
    <section className="section-z surface-dark surface-grid process-z" id="processo" aria-labelledby="processo-title">
      <div className="container-z">
        <Reveal className="process-intro">
          <Eyebrow index="06" label="Nosso processo" />
          <h2 id="processo-title" className="subhead-z">
            Um caminho claro
            <br />
            da ideia ao resultado.
          </h2>
          <p className="dim-z">
            Trabalhamos lado a lado com você em cada etapa, com organização, transparência e foco no que realmente
            importa.
          </p>
        </Reveal>

        <Reveal as="ol" className="timeline-z">
          {processSteps.map((step, index) => (
            <li className="step-z" key={step.title}>
              <div className="step-number" aria-hidden="true">
                {pad(index + 1)}
              </div>
              <h3>{step.title}</h3>
              <p>{step.summary}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
