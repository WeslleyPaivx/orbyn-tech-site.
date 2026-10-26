import { spotlight } from '../../hooks/useSpotlight';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';

const MANIFESTO =
  'A Orbyn Tech nasceu com o propósito de aproximar empresas da tecnologia, criando soluções digitais modernas, funcionais e adaptadas às necessidades de cada negócio.';

const pillars = [
  {
    title: 'Desenvolvimento personalizado',
    text: 'Cada projeto parte do seu negócio, dos seus processos e do seu público, não de um modelo pronto.',
  },
  {
    title: 'Inovação',
    text: 'Tecnologias atuais, inteligência artificial e automação aplicadas onde fazem diferença de verdade.',
  },
  {
    title: 'Simplicidade',
    text: 'Soluções fáceis de usar e de manter, com interfaces claras e sem complexidade desnecessária.',
  },
  {
    title: 'Atendimento próximo',
    text: 'Comunicação direta e transparente: você acompanha cada etapa e sabe exatamente o que está sendo feito.',
  },
];

/**
 * Sobre a ORBYN TECH: os fios se deitam em um horizonte ondulante (data-stage="3"),
 * o manifesto acende palavra por palavra conforme a leitura e os pilares surgem em sequência.
 */
export function About() {
  return (
    <section id="sobre" data-stage="3" aria-labelledby="sobre-title" className="relative pt-28 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="legible">
          <Reveal>
            <p className="eyebrow">
              <span className="text-white/85">04</span>
              <span className="h-px w-6 bg-white/20" aria-hidden="true" />
              Sobre a Orbyn Tech
            </p>
          </Reveal>

          <h2
            id="sobre-title"
            data-scrub-words
            className="mt-8 max-w-[24ch] text-[clamp(1.85rem,4.4vw,3.7rem)] leading-[1.1] font-medium tracking-[-0.035em] text-white"
          >
            {MANIFESTO.split(' ').map((word, index, words) => (
              <span key={index}>
                <span data-word>{word}</span>
                {index < words.length - 1 ? ' ' : null}
              </span>
            ))}
          </h2>
        </div>

        <ul className="mt-20 grid gap-4 sm:mt-28 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {pillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} delay={index * 90}>
              <div onPointerMove={spotlight} className="spot-card group h-full rounded-2xl p-6 sm:p-7">
                <p className="flex items-center gap-3 text-xs text-white/40 tabular-nums">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30 transition-colors duration-500 group-hover:bg-accent" />
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-8 text-lg font-medium tracking-[-0.015em] text-white sm:text-xl">{pillar.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">{pillar.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
