import { whatsappMessages } from '../../config/site';
import { googlePresence } from '../../data/content';
import { whatsappUrl } from '../../lib/whatsapp';
import { ArrowUpRight, CircleAlert } from '../ui/Icons';
import { ButtonLink } from '../ui/Button';
import { Container } from '../ui/Container';
import { Magnetic } from '../ui/Magnetic';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Seção 05 — Presença no Google.
 *
 * A nota de honestidade não é rodapé escondido: fica em destaque, porque
 * prometer primeira posição é o golpe mais comum desse serviço e dizer o
 * contrário em voz alta é o que separa a Zaniva de quem promete.
 */
export function PresencaGoogle() {
  return (
    <section id="google" aria-labelledby="google-title" className="relative py-28 sm:py-40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="google-title"
              index="05"
              label="Presença local"
              title={[...googlePresence.title]}
              size="md"
            />
            <Reveal delay={120}>
              <p className="mt-7 max-w-xl leading-relaxed text-mute">{googlePresence.lead}</p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10">
                <Magnetic>
                  <ButtonLink
                    href={whatsappUrl(whatsappMessages.google)}
                    external
                    variant="onDark"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Quero melhorar minha presença no Google
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </ButtonLink>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {googlePresence.items.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 90} className="bg-ink p-6 sm:p-8">
                  <h3 className="font-display text-[1.1rem] font-medium tracking-[-0.01em] text-sky">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-mute">{item.text}</p>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={200}>
              <p className="mt-6 flex gap-3 rounded-2xl border border-violet/40 bg-ink-2/70 p-5 text-[0.95rem] leading-relaxed text-mist sm:p-6">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-orchid" strokeWidth={1.75} />
                <span>{googlePresence.honesty}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
