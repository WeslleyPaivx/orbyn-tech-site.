import { processSteps } from '../../data/content';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const pad = (n: number) => String(n).padStart(2, '0');

/** Processo em cinco etapas, lado a lado no desktop e em sequência no celular. */
export function Process() {
  return (
    <section aria-labelledby="processo-title" className="legible relative py-24 sm:py-32">
      <Container>
        <SectionHeading id="processo-title" index="05" label="Processo" title="Da sua ideia à solução digital." size="md" />

        <ol className="mt-14 grid gap-x-8 sm:mt-20 md:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 80} className="relative border-t border-white/[0.12] py-8 lg:pr-2">
              <span className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-accent shadow-[0_0_10px_rgb(54_221_232/0.7)]" aria-hidden="true" />
              <p className="text-sm text-white/40 tabular-nums">Etapa {pad(index + 1)}</p>
              <h3 className="mt-5 text-xl font-medium tracking-[-0.015em] text-white">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] text-white/75">{step.summary}</p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-mute">{step.detail}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
