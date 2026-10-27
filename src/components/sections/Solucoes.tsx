import type { ReactNode } from 'react';
import { whatsappMessages } from '../../config/site';
import { services } from '../../data/services';
import { spotlight } from '../../hooks/useSpotlight';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

/**
 * Ícones autorais em traço, desenhados para a seção. Não são de biblioteca:
 * cada um é a figura do próprio serviço — janela com setas para web, alfinete
 * para presença local, núcleo com eixos para IA, balão para chatbot, sólido
 * em camadas para sistemas, cubo fechado para suporte.
 */
const ART: Record<string, ReactNode> = {
  sites: <path d="M13 20H77V69H13zM13 33H77M20 26h2m4 0h2m4 0h2M28 47l-9 9 9 9m34-18 9 9-9 9m-14-26-6 36" />,
  local: (
    <>
      <path d="M45 77s25-27 25-43a25 25 0 1 0-50 0c0 16 25 43 25 43Z" />
      <circle cx="45" cy="34" r="10" />
      <circle cx="45" cy="34" r="3" fill="currentColor" />
    </>
  ),
  ai: (
    <>
      <circle cx="45" cy="45" r="25" />
      <circle cx="45" cy="45" r="16" />
      <path d="M18 45h54M45 18v54M24 27l42 36M64 25 26 65" />
    </>
  ),
  chatbot: (
    <>
      <rect x="15" y="17" width="60" height="48" rx="12" />
      <path d="M28 65V78l16-13M29 40h4m10 0h4m10 0h4" strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  systems: <path d="M45 7 76 25 45 43 14 25 45 7ZM14 39l31 18 31-18M14 54l31 18 31-18M14 25v29m62-29v29" />,
  support: <path d="M44 9 75 27v37L44 82 13 64V27L44 9ZM44 9v73M13 27l31 18 31-18" />,
};

/** Os dois últimos ocupam duas colunas cada, formando a segunda fileira. */
const WIDE = new Set(['sistemas', 'suporte']);

/** 03 — SOLUÇÕES DIGITAIS. Quatro cartões em linha, dois largos embaixo. */
export function Solucoes() {
  return (
    <section className="section-z surface-dark surface-grid" id="solucoes" aria-labelledby="solucoes-title">
      <div className="container-z">
        <Reveal>
          <Eyebrow index="03" label="Soluções digitais" />
        </Reveal>

        <Reveal className="header-row-z">
          <h2 id="solucoes-title" className="subhead-z">
            Tudo o que seu negócio precisa
            <br />
            para crescer no digital.
          </h2>
          <p className="dim-z">
            Desenvolvemos soluções completas para empresas que querem se destacar, atrair mais clientes e evoluir com
            tecnologia.
          </p>
        </Reveal>

        <div className="services-grid">
          {services.map((service, index) => (
            <Reveal
              as="article"
              key={service.id}
              delay={(index % 4) * 80}
              className={`service-z ${WIDE.has(service.id) ? 'is-wide' : ''}`}
            >
              <div onPointerMove={spotlight} style={{ display: 'contents' }}>
                <div className="service-art" aria-hidden="true">
                  <svg viewBox="0 0 90 90" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    {ART[service.icon]}
                  </svg>
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {service.id === 'google' ? (
                    <a href="#google" onClick={handleAnchorClick('google')}>
                      Saiba mais ↗
                    </a>
                  ) : (
                    <a
                      href={whatsappUrl(whatsappMessages.service(service.messageLabel))}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Pedir orçamento de ${service.title} pelo WhatsApp`}
                    >
                      Saiba mais ↗
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
