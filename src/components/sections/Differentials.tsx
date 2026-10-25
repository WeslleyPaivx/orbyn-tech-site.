import { differentials } from '../../data/content';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/** Diferenciais em colunas numeradas, sem cartões. */
export function Differentials() {
  return (
    <section aria-labelledby="diferenciais-title" className="legible relative py-24 sm:py-32">
      <Container>
        <SectionHeading id="diferenciais-title" index="05" label="Diferenciais" title="Por que escolher a ORBYN TECH?" size="md" />

        <ul className="mt-14 grid gap-x-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item, index) => (
            <Reveal as="li" key={item.title} delay={(index % 3) * 70} className="border-t border-white/[0.12] py-8 sm:py-10">
              <p className="text-sm text-white/40 tabular-nums">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-5 text-xl font-medium tracking-[-0.015em] text-white sm:text-[1.4rem]">{item.title}</h3>
              <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">{item.description}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
