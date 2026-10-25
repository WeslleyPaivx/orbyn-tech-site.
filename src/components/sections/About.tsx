import { site } from '../../config/site';
import { OrbynSymbol } from '../brand/Logo';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';

const MANIFESTO =
  'A ORBYN TECH nasceu com o propósito de transformar ideias em soluções digitais modernas, funcionais e personalizadas.';

/**
 * Sobre nós: os fios se deitam em um horizonte ondulante (data-stage="3")
 * e o manifesto acende palavra por palavra conforme a leitura.
 */
export function About() {
  return (
    <section id="sobre" data-stage="3" aria-labelledby="sobre-title" className="legible relative pt-28 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <Reveal>
          <p className="eyebrow">
            <span className="text-white/80">(04)</span>
            Sobre nós
          </p>
        </Reveal>

        <h2
          id="sobre-title"
          data-scrub-words
          className="mt-8 max-w-[22ch] text-[clamp(1.9rem,4.6vw,3.9rem)] leading-[1.08] font-medium tracking-[-0.035em] text-white"
        >
          {MANIFESTO.split(' ').map((word, index, words) => (
            <span key={index}>
              <span data-word>{word}</span>
              {index < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </h2>

        <div className="mt-20 grid gap-12 border-t border-white/[0.12] pt-12 sm:mt-28 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <h3 className="text-2xl font-medium tracking-[-0.02em] text-white sm:text-3xl">
              Tecnologia, criatividade e inovação.
            </h3>
          </Reveal>
          <Reveal delay={100} className="space-y-6 text-lg leading-relaxed text-mute lg:col-span-7">
            <p>
              Acreditamos que cada negócio possui necessidades únicas e merece uma presença digital desenvolvida com
              atenção aos detalhes.
            </p>
            <p>
              Por isso, unimos design, desenvolvimento e tecnologia para criar sites, sistemas e aplicativos que fazem
              sentido para o seu negócio hoje e acompanham o seu crescimento.
            </p>
            <p className="flex items-center gap-4 pt-4 text-white">
              <OrbynSymbol className="h-9 w-9 shrink-0" />
              <span className="text-xl font-medium tracking-[-0.01em]">{site.altSlogan}</span>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
