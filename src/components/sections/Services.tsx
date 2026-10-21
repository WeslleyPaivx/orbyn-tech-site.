import { ArrowUpRight } from 'lucide-react';
import { whatsappMessages } from '../../config/site';
import { services } from '../../data/services';
import { whatsappUrl } from '../../lib/whatsapp';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Serviços em lista editorial: cada linha é um serviço, com o pedido de orçamento
 * daquele serviço específico. Sem grade de cards.
 */
export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="servicos-title"
          title="Soluções digitais para transformar seu negócio."
          subtitle="Do primeiro site à automação de processos com inteligência artificial: desenvolvemos a solução certa para o momento da sua empresa."
        />

        <ul className="mt-14 border-t border-line sm:mt-20">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Reveal
                as="li"
                key={service.id}
                className="group grid gap-x-12 gap-y-4 border-b border-line py-8 sm:py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] lg:items-baseline"
              >
                <h3 className="flex items-center gap-4 text-[1.6rem] leading-tight font-semibold tracking-[-0.02em] text-white sm:text-[2rem]">
                  <Icon
                    className="h-6 w-6 shrink-0 translate-y-px text-mute transition-colors duration-300 group-hover:text-white"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {service.title}
                </h3>
                <p className="max-w-[46ch] leading-relaxed text-mute">{service.description}</p>
                <a
                  href={whatsappUrl(whatsappMessages.service(service.messageLabel))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 self-start text-[0.95rem] font-medium whitespace-nowrap text-white/80 transition-colors hover:text-white lg:self-baseline"
                  aria-label={`Pedir orçamento de ${service.title} pelo WhatsApp`}
                >
                  Pedir orçamento
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </a>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
