import { whatsappMessages } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { ButtonLink } from '../ui/Button';
import { ArrowUpRight } from '../ui/Icons';
import { Container } from '../ui/Container';
import { SplitWords } from '../ui/SplitWords';
import { OrbitVisual } from './OrbitVisual';

type HeroProps = {
  /** Sem WebGL: mostra o símbolo em órbita (versão leve) no lugar da escultura. */
  fallback: boolean;
};

/**
 * Abertura: a escultura 3D ocupa a maior parte da composição (à direita no desktop,
 * no alto no celular) e o título fica ancorado embaixo, à esquerda.
 */
export function Hero({ fallback }: HeroProps) {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[4.5rem] lg:pt-20"
    >
      {fallback && (
        <OrbitVisual className="absolute top-[5.5rem] left-1/2 -z-10 w-[min(92vw,30rem)] -translate-x-1/2 opacity-60 lg:top-1/2 lg:right-[4%] lg:left-auto lg:w-[min(44vw,600px)] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-100" />
      )}

      {/* Legibilidade: escurece só a área do texto, sem caixas por cima da escultura */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-t from-ink via-ink/70 to-transparent lg:inset-y-0 lg:right-auto lg:h-auto lg:w-[58%] lg:bg-gradient-to-r lg:via-ink/40"
        aria-hidden="true"
      />

      <Container className="legible flex flex-1 flex-col justify-end pt-10 pb-10 sm:pb-14 lg:justify-center lg:pb-16">
        <p className="eyebrow hero-in" style={{ animationDelay: '80ms' }}>
          <span className="text-white/80">(01)</span>
          Estúdio de tecnologia
        </p>

        <SplitWords
          as="h1"
          id="hero-title"
          immediate
          delay={150}
          lines={['Tecnologia', 'que transforma', 'negócios.']}
          className="mt-6 max-w-[14ch] text-[clamp(2.75rem,10.5vw,4.6rem)] leading-[0.9] font-medium tracking-[-0.055em] text-white uppercase sm:mt-8 lg:text-[clamp(4rem,min(6.6vw,12vh),7.4rem)]"
        />

        <p
          className="hero-in mt-7 max-w-[30rem] text-[1.05rem] leading-relaxed text-mute sm:mt-9 sm:text-lg"
          style={{ animationDelay: '650ms' }}
        >
          Desenvolvemos experiências digitais, automações inteligentes e soluções que levam sua empresa ao próximo
          nível.
        </p>

        <div
          className="hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: '780ms' }}
        >
          <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="lg">
            Transforme seu negócio
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </ButtonLink>
          <ButtonLink href="#servicos" onClick={handleAnchorClick('servicos')} variant="outline" size="lg">
            Conheça os serviços
          </ButtonLink>
        </div>
      </Container>

      <Container className="hero-in hidden pb-8 sm:block">
        <div className="flex items-end justify-between border-t border-white/10 pt-6 text-sm text-white/45">
          <a
            href="#servicos"
            onClick={handleAnchorClick('servicos')}
            className="flex items-center gap-4 rounded-md transition-colors hover:text-white"
          >
            <span className="scroll-cue" aria-hidden="true" />
            Role para explorar
          </a>
          <p className="hidden text-right md:block">Sites · Chatbots · Automação com IA · Sistemas</p>
        </div>
      </Container>
    </section>
  );
}
