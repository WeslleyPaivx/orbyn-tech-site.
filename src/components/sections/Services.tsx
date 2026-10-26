import { whatsappMessages } from '../../config/site';
import { services, type ServiceIcon } from '../../data/services';
import { spotlight } from '../../hooks/useSpotlight';
import { whatsappUrl } from '../../lib/whatsapp';
import {
  ArrowUpRight,
  AutomationIcon,
  ChatbotIcon,
  SaasIcon,
  SitesIcon,
  SystemsIcon,
} from '../ui/Icons';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const icons: Record<ServiceIcon, typeof SitesIcon> = {
  sites: SitesIcon,
  systems: SystemsIcon,
  chatbot: ChatbotIcon,
  automation: AutomationIcon,
  saas: SaasIcon,
};

/** Os três primeiros ocupam um terço da linha; os dois últimos, metade (grade 3 + 2). */
const spans = ['lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-3', 'lg:col-span-3'];

/**
 * Serviços em cartões: a escultura se desfaz em um feixe de fios atrás da seção
 * (data-stage="1") e cada cartão reage ao ponteiro com luz e borda em ciano.
 */
export function Services() {
  return (
    <section id="servicos" data-stage="1" aria-labelledby="servicos-title" className="relative py-28 sm:py-40">
      <Container>
        <div className="legible grid items-end gap-8 lg:grid-cols-12">
          <SectionHeading
            id="servicos-title"
            index="02"
            label="Serviços"
            title="Soluções digitais para cada etapa do seu negócio."
            className="lg:col-span-8"
          />
          <Reveal delay={120} className="lg:col-span-4">
            <p className="max-w-md leading-relaxed text-mute lg:ml-auto">
              Do primeiro site à automação com inteligência artificial: desenvolvemos a solução certa para o momento da
              sua empresa.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            return (
              <Reveal
                as="li"
                key={service.id}
                delay={(index % 3) * 90}
                className={`${spans[index]} ${index === services.length - 1 ? 'sm:col-span-2' : ''}`}
              >
                <article
                  onPointerMove={spotlight}
                  className="spot-card group flex h-full flex-col rounded-2xl p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ink/60 text-white transition-[border-color,color] duration-500 group-hover:border-accent/40 group-hover:text-accent">
                      <Icon
                        className="h-[1.35rem] w-[1.35rem] transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-110"
                        strokeWidth={1.5}
                      />
                    </span>
                    <span className="text-xs text-white/35 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <h3 className="mt-10 text-[1.4rem] leading-tight font-medium tracking-[-0.02em] text-white sm:text-[1.55rem]">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] leading-relaxed text-mute">{service.description}</p>

                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`O que inclui ${service.title}`}>
                    {service.includes.map((item) => (
                      <li key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={whatsappUrl(whatsappMessages.service(service.messageLabel))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-md pt-8 text-[0.92rem] font-medium text-white/80 transition-colors hover:text-accent"
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
