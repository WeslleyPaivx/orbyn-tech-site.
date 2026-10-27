import { manifesto } from '../../data/content';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitWords } from '../ui/SplitWords';

/**
 * Seção 02 — Manifesto.
 * Tipografia editorial de grande escala. O parágrafo de abertura acende
 * palavra por palavra conforme a leitura avança (data-scrub-words), só em
 * telas maiores — no celular o texto já aparece inteiro, para a rolagem não
 * precisar repintar o parágrafo a cada quadro.
 */
export function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative py-28 sm:py-40">
      <Container>
        <div className="legible max-w-5xl">
          <Reveal>
            <p className="eyebrow">
              <span className="text-sky/85">02</span>
              <span className="h-px w-6 bg-sky/20" aria-hidden="true" />
              Manifesto
            </p>
          </Reveal>

          <SplitWords
            id="manifesto-title"
            lines={[...manifesto.title]}
            className="mt-6 font-display text-[clamp(2.1rem,6.2vw,4.4rem)] leading-[1.04] font-bold tracking-[-0.02em] text-sky"
          />

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
            <p
              data-scrub-words
              className="text-[1.15rem] leading-relaxed text-mist lg:col-span-7 sm:text-[1.3rem]"
            >
              {manifesto.lead.split(' ').map((word, index) => (
                <span key={`${word}-${index}`} data-word>
                  {word}{' '}
                </span>
              ))}
            </p>

            <Reveal delay={120} className="lg:col-span-5">
              <p className="leading-relaxed text-mute">{manifesto.body}</p>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:mt-20 sm:grid-cols-3">
            {manifesto.pillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.title} delay={index * 100} className="bg-ink p-6 sm:p-8">
                <h3 className="font-display text-sm font-medium tracking-[0.18em] text-orchid uppercase">
                  {pillar.title}
                </h3>
                <p className="mt-4 leading-relaxed text-mute">{pillar.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
