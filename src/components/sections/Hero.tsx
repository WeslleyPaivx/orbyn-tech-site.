import { site, whatsappMessages } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { ButtonLink } from '../ui/Button';
import { ArrowRight, ArrowUpRight } from '../ui/Icons';
import { Container } from '../ui/Container';
import { Magnetic } from '../ui/Magnetic';
import { SplitWords } from '../ui/SplitWords';
import { HeroMedia } from './HeroMedia';

/**
 * Primeira tela: a paisagem Pink Grass ocupa o quadro inteiro e a composição
 * tipográfica ocupa a região clara do céu, em tipografia escura.
 *
 * Contraste: ameixa (#371F47) sobre o céu (#F0EFFD) dá 12,7:1 — folga larga
 * mesmo com o véu mínimo e com a variação do loop.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[4.5rem] lg:pt-20"
    >
      <HeroMedia />

      <Container className="relative flex flex-1 flex-col justify-start pt-8 pb-10 sm:pt-12 lg:justify-center lg:pb-16">
        {/* Marcação técnica discreta, sem poluir a paisagem */}
        <div className="hero-in flex items-center gap-4" style={{ animationDelay: '80ms' }}>
          <span className="hero-tick">AGÊNCIA DIGITAL</span>
          <span className="hero-rule hidden w-24 sm:block" aria-hidden="true" />
          <span className="hero-tick hidden opacity-70 sm:block">EST. 2026</span>
        </div>

        <SplitWords
          as="h1"
          id="hero-title"
          immediate
          delay={150}
          lines={[site.fullName]}
          className="mt-5 font-display text-[clamp(2.6rem,11vw,4.6rem)] leading-[0.95] font-bold tracking-[0.02em] text-ink sm:mt-7 lg:text-[clamp(4.2rem,min(6.4vw,12vh),6.8rem)]"
        />

        <p
          className="hero-in mt-4 max-w-[22ch] font-display text-[clamp(1.35rem,5.2vw,1.9rem)] leading-[1.15] font-medium tracking-[-0.01em] text-violet sm:mt-5 lg:text-[clamp(1.9rem,2.6vw,2.6rem)]"
          style={{ animationDelay: '520ms' }}
        >
          {site.slogan}
        </p>

        <p
          className="hero-in mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-plum sm:mt-7 sm:text-lg"
          style={{ animationDelay: '650ms' }}
        >
          {site.description}
        </p>

        <div
          className="hero-in mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          style={{ animationDelay: '780ms' }}
        >
          <Magnetic>
            <ButtonLink
              href="#solucoes"
              onClick={handleAnchorClick('solucoes')}
              size="lg"
              className="w-full sm:w-auto"
            >
              Conheça nossas soluções
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-1"
                strokeWidth={2}
              />
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink
              href={whatsappUrl(whatsappMessages.quote)}
              external
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Solicitar orçamento
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </ButtonLink>
          </Magnetic>
        </div>
      </Container>

      <Container className="hero-in relative hidden pb-8 sm:block">
        <div className="flex items-end justify-between">
          <a
            href="#manifesto"
            onClick={handleAnchorClick('manifesto')}
            className="flex items-center gap-4 rounded-md text-sm text-plum transition-colors hover:text-violet"
          >
            <span className="scroll-cue" aria-hidden="true" />
            Role para explorar
          </a>
        </div>
      </Container>
    </section>
  );
}
