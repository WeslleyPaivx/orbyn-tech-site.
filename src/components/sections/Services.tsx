import type { PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { whatsappMessages } from '../../config/site';
import { services } from '../../data/services';
import { whatsappUrl } from '../../lib/whatsapp';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/** Atualiza a posição da luz do card conforme o cursor. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="servicos-title"
          title="Soluções digitais para transformar seu negócio."
          subtitle="Do primeiro site à automação de processos com inteligência artificial: desenvolvemos a solução certa para o momento da sua empresa."
        />

        <Reveal className="mt-14 sm:mt-20">
          <ul className="grid overflow-hidden rounded-[1.75rem] border border-line bg-line gap-px sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <li
                  key={service.id}
                  onPointerMove={trackPointer}
                  className="spotlight group flex flex-col bg-ink-2 p-7 transition-colors duration-500 hover:bg-[#121212] sm:p-9"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-ink text-white transition-[border-color,transform] duration-500 ease-[var(--ease-soft)] group-hover:-translate-y-0.5 group-hover:border-white/40">
                    <Icon className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.5} aria-hidden="true" />
                  </span>

                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.015em] text-white sm:text-[1.35rem]">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] leading-relaxed text-mute">{service.description}</p>

                  <a
                    href={whatsappUrl(whatsappMessages.service(service.messageLabel))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 self-start pt-8 text-[0.9rem] font-medium text-white/80 transition-colors hover:text-white"
                    aria-label={`Solicitar orçamento de ${service.title} pelo WhatsApp`}
                  >
                    <span className="relative">
                      Solicitar orçamento
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-x-100" />
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
