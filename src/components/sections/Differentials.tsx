import { differentials } from '../../data/content';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function Differentials() {
  return (
    <section aria-labelledby="diferenciais-title" className="border-t border-line/60 bg-ink-2/40 py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="diferenciais-title"
            title="Por que escolher a ORBYN TECH?"
            subtitle="Nossa forma de trabalhar foi pensada para que você tenha uma solução bem feita e saiba exatamente o que esperar."
          />
        </div>

        <ul className="grid gap-x-10 sm:grid-cols-2">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={(index % 2) * 90}
                className="group border-t border-line py-8 sm:py-10"
              >
                <Icon
                  className="h-6 w-6 text-white transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] text-white sm:text-xl">{item.title}</h3>
                <p className="mt-2.5 leading-relaxed text-mute">{item.description}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
