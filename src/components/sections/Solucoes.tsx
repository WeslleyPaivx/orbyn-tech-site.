import { whatsappMessages } from '../../config/site';
import { services, type ServiceIcon } from '../../data/services';
import { spotlight } from '../../hooks/useSpotlight';
import { whatsappUrl } from '../../lib/whatsapp';
import {
  AiIcon,
  ArrowUpRight,
  ChatbotIcon,
  LocalIcon,
  SitesIcon,
  SupportIcon,
  SystemsIcon,
} from '../ui/Icons';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const icons: Record<ServiceIcon, typeof SitesIcon> = {
  sites: SitesIcon,
  local: LocalIcon,
  ai: AiIcon,
  chatbot: ChatbotIcon,
  systems: SystemsIcon,
  support: SupportIcon,
};

/**
 * Seção 03 — Soluções digitais.
 * Seis cartões em grade de três colunas; a nuvem de partículas se intensifica
 * atrás da seção (data-stage="1") conforme a rolagem avança.
 */
export function Solucoes() {
  return (
    <section id="solucoes" data-stage="1" aria-labelledby="solucoes-title" className="relative py-28 sm:py-40">
      <Container>
        <div className="legible grid items-end gap-8 lg:grid-cols-12">
          <SectionHeading
            id="solucoes-title"
            index="03"
            label="Soluções digitais"
            title="Seis frentes, uma presença digital inteira."
            className="lg:col-span-8"
          />
          <Reveal delay={120} className="lg:col-span-4">
            <p className="max-w-md leading-relaxed text-mute lg:ml-auto">
              Do primeiro site à automação com inteligência artificial. Você começa por onde aperta mais e cresce a
              partir dali.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            return (
              <Reveal as="li" key={service.id} delay={(index % 3) * 90}>
                <article
                  onPointerMove={spotlight}
                  className="spot-card group flex h-full flex-col rounded-2xl p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ink/60 text-sky transition-[border-color,color] duration-500 group-hover:border-orchid/50 group-hover:text-orchid">
                      <Icon
                        className="h-[1.35rem] w-[1.35rem] transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-110"
                        strokeWidth={1.5}
                      />
                    </span>
                    <span className="font-display text-xs tracking-[0.18em] text-orchid/70 tabular-nums">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-10 font-display text-[1.35rem] leading-tight font-medium tracking-[-0.01em] text-sky sm:text-[1.45rem]">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[42ch] leading-relaxed text-mute">{service.description}</p>

                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`O que inclui ${service.title}`}>
                    {service.includes.map((item) => (
                      <li key={item} className="rounded-full border border-line px-3 py-1 text-xs text-mist/80">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={whatsappUrl(whatsappMessages.service(service.messageLabel))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-md pt-8 text-[0.92rem] font-medium text-sky/85 transition-colors hover:text-orchid"
                    aria-label={`Pedir orçamento de ${service.title} pelo WhatsApp`}
                  >
                    Pedir orçamento
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
