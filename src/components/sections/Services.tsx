import { whatsappMessages } from '../../config/site';
import { services } from '../../data/services';
import { whatsappUrl } from '../../lib/whatsapp';
import { ArrowUpRight } from '../ui/Icons';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SplitWords } from '../ui/SplitWords';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Serviços: a escultura se desfaz em um feixe de fios que atravessa a tela (data-stage="1")
 * e gira conforme cada serviço entra em cena.
 */
export function Services() {
  return (
    <section id="servicos" data-stage="1" aria-labelledby="servicos-title" className="relative py-28 sm:py-40">
      <Container>
        <SectionHeading
          id="servicos-title"
          index="02"
          label="Serviços"
          title="Soluções digitais para transformar seu negócio."
          subtitle="Do primeiro site à automação com inteligência artificial: desenvolvemos a solução certa para o momento da sua empresa."
        />

        <ol className="mt-20 sm:mt-28">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="legible grid gap-x-12 gap-y-7 border-t border-white/[0.12] py-12 sm:py-16 lg:grid-cols-12"
            >
              <Reveal className="lg:col-span-2">
                <p className="text-sm text-white/50 tabular-nums">
                  {pad(index + 1)} <span className="text-white/25">/ {pad(services.length)}</span>
                </p>
              </Reveal>

              <SplitWords
                as="h3"
                lines={service.title}
                className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.035em] text-white lg:col-span-6"
              />

              <Reveal delay={140} className="lg:col-span-4">
                <p className="leading-relaxed text-mute">{service.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`O que inclui ${service.title}`}>
                  {service.includes.map((item) => (
                    <li key={item} className="rounded-full border border-white/[0.14] bg-ink/60 px-3 py-1.5 text-xs text-white/75">
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappUrl(whatsappMessages.service(service.messageLabel))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-md text-[0.95rem] font-medium text-white/85 transition-colors hover:text-white"
                  aria-label={`Pedir orçamento de ${service.title} pelo WhatsApp`}
                >
                  Pedir orçamento
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
