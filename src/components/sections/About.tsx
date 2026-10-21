import { site } from '../../config/site';
import { OrbynSymbol } from '../brand/Logo';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="border-t border-line/60 py-24 sm:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2">
            <img
              src="/images/sobre-workspace.webp"
              alt="Notebook sobre uma mesa escura, em ambiente de trabalho minimalista"
              width={720}
              height={991}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] h-full w-full object-cover opacity-90 sm:aspect-[5/5] lg:aspect-[4/5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-7 sm:p-9">
              <OrbynSymbol className="h-10 w-10 shrink-0 text-white" />
              <p className="text-lg font-medium tracking-[-0.01em] text-white sm:text-xl">{site.altSlogan}</p>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading id="sobre-title" title="Tecnologia, criatividade e inovação." />
          <Reveal delay={100} className="mt-8 space-y-6 text-lg leading-relaxed text-mute sm:text-[1.2rem]">
            <p className="text-white/90">
              A ORBYN TECH nasceu com o propósito de transformar ideias em soluções digitais modernas, funcionais e
              personalizadas.
            </p>
            <p>
              Acreditamos que cada negócio possui necessidades únicas e merece uma presença digital desenvolvida com
              atenção aos detalhes.
            </p>
            <p>
              Por isso, unimos design, desenvolvimento e tecnologia para criar sites, sistemas e aplicativos que fazem
              sentido para o seu negócio hoje e acompanham o seu crescimento.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
