import { differentials } from '../../data/content';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/** Diferenciais em colunas de texto corrido: título, ícone que representa o tema e uma frase. */
export function Differentials() {
  return (
    <section aria-labelledby="diferenciais-title" className="border-t border-line/60 bg-ink-2/40 py-24 sm:py-32">
      <Container>
        <SectionHeading id="diferenciais-title" title="Por que escolher a ORBYN TECH?" />

        <ul className="mt-12 grid gap-x-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal as="li" key={item.title} delay={(index % 3) * 70} className="border-t border-line py-7 sm:py-9">
                <h3 className="flex items-center gap-3 text-lg font-semibold tracking-[-0.01em] text-white sm:text-xl">
                  <Icon className="h-5 w-5 shrink-0 text-mute" strokeWidth={1.5} aria-hidden="true" />
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[38ch] leading-relaxed text-mute">{item.description}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
