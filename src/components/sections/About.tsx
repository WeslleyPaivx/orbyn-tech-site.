import { site } from '../../config/site';
import { spotlight } from '../../hooks/useSpotlight';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Seção 07 — Sobre a agência.
 *
 * Só o que foi informado: os nomes dos dois fundadores e a origem da agência.
 * Nada de certificação, formação, tempo de experiência ou número de clientes —
 * esses dados não foram fornecidos e inventá-los seria mentira que o cliente
 * eventualmente descobre.
 *
 * As fotos reais entram depois: o espaço já está reservado e o componente lê
 * `founders[].photo` da configuração central. Enquanto estiver vazio, aparece
 * a inicial em tipografia.
 */
export function About() {
  return (
    <section id="sobre" data-stage="3" aria-labelledby="sobre-title" className="relative pt-28 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              id="sobre-title"
              index="07"
              label="Sobre a agência"
              title="Criação e tecnologia na mesma mesa."
              size="md"
            />
            <Reveal delay={120}>
              <p className="mt-7 leading-relaxed text-mist">
                A Zaniva Digital nasce da união de duas competências que normalmente moram em agências diferentes:
                estratégia digital e desenvolvimento. Quem pensa a experiência é quem entende o que dá para construir
                atrás dela.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 leading-relaxed text-mute">
                Na prática isso encurta o caminho entre a ideia e o que vai ao ar — e evita a entrega que parece boa na
                apresentação e trava na hora de funcionar.
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:gap-5">
            {site.founders.map((founder, index) => (
              <Reveal as="li" key={founder.name} delay={index * 110}>
                <div onPointerMove={spotlight} className="spot-card group h-full rounded-2xl p-6 sm:p-7">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl border border-line bg-ink-2">
                    {founder.photo ? (
                      <img
                        src={founder.photo}
                        alt={`Retrato de ${founder.name}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center font-display text-[4rem] font-bold text-violet/50"
                        aria-hidden="true"
                      >
                        {founder.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-6 font-display text-lg font-medium tracking-[-0.01em] text-sky sm:text-xl">
                    {founder.name}
                  </h3>
                  <p className="mt-1.5 text-[0.9rem] text-orchid">Sócio-fundador</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
