import { useRef, type PointerEvent } from 'react';
import { whatsappMessages } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { ButtonLink } from '../ui/Button';
import { ArrowRight, ArrowUpRight } from '../ui/Icons';
import { Container } from '../ui/Container';
import { Magnetic } from '../ui/Magnetic';
import { SplitWords } from '../ui/SplitWords';
import { HeroBackdrop } from './HeroBackdrop';
import { OrbitVisual } from './OrbitVisual';

type HeroProps = {
  /** Sem WebGL: mostra o símbolo em órbita (versão leve) no lugar da escultura. */
  fallback: boolean;
};

/**
 * Primeira impressão: escultura 3D ao fundo, camadas geométricas com parallax
 * e o título surgindo palavra por palavra.
 */
export function Hero({ fallback }: HeroProps) {
  const ref = useRef<HTMLElement>(null);

  // Parallax leve no desktop: as camadas acompanham o mouse em profundidades diferentes
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--px', (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
    ref.current.style.setProperty('--py', (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
  };

  return (
    <section
      ref={ref}
      id="inicio"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[4.5rem] lg:pt-20"
    >
      <HeroBackdrop />

      {fallback && (
        <OrbitVisual className="absolute top-[6rem] left-1/2 -z-10 w-[min(80vw,26rem)] -translate-x-1/2 opacity-70 lg:top-1/2 lg:right-[8%] lg:left-auto lg:w-[min(38vw,520px)] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-100" />
      )}

      {/* Legibilidade: escurece só a área do texto, sem caixas por cima da escultura */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[64%] bg-gradient-to-t from-ink via-ink/75 to-transparent lg:inset-y-0 lg:right-auto lg:h-auto lg:w-[60%] lg:bg-gradient-to-r lg:via-ink/50"
        aria-hidden="true"
      />

      <Container className="legible relative flex flex-1 flex-col justify-end pt-10 pb-10 sm:pb-14 lg:justify-center lg:pb-16">
        <p className="eyebrow hero-in" style={{ animationDelay: '80ms' }}>
          Desenvolvimento de software
        </p>

        <SplitWords
          as="h1"
          id="hero-title"
          immediate
          accentPeriod
          delay={150}
          lines={['Transformamos ideias', 'em soluções digitais.']}
          className="mt-6 max-w-[19ch] text-[clamp(2.3rem,9.2vw,4.4rem)] leading-[0.98] font-medium tracking-[-0.045em] text-white sm:mt-8 lg:text-[clamp(4rem,min(6vw,11vh),6.6rem)]"
        />

        <p
          className="hero-in mt-7 max-w-[32rem] text-[1.05rem] leading-relaxed text-mute sm:mt-9 sm:text-lg"
          style={{ animationDelay: '650ms' }}
        >
          Desenvolvemos sites, sistemas e automações inteligentes para empresas que querem evoluir no mundo digital.
        </p>

        <div
          className="hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: '780ms' }}
        >
          <Magnetic>
            <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="lg" className="w-full sm:w-auto">
              Solicitar um orçamento
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink
              href="#portfolio"
              onClick={handleAnchorClick('portfolio')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Conhecer projetos
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-1"
                strokeWidth={2}
              />
            </ButtonLink>
          </Magnetic>
        </div>
      </Container>

      <Container className="hero-in relative hidden pb-8 sm:block">
        <div className="flex items-end justify-between border-t border-white/10 pt-6 text-sm text-white/45">
          <a
            href="#servicos"
            onClick={handleAnchorClick('servicos')}
            className="flex items-center gap-4 rounded-md transition-colors hover:text-white"
          >
            <span className="scroll-cue" aria-hidden="true" />
            Role para explorar
          </a>
          <p className="hidden text-right md:block">Sites · Sistemas · Chatbots com IA · Automações · SaaS</p>
        </div>
      </Container>
    </section>
  );
}
