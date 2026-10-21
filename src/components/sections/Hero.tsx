import { whatsappMessages } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { ButtonLink } from '../ui/Button';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { Container } from '../ui/Container';
import { OrbitVisual } from './OrbitVisual';

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[min(100svh,56rem)] flex-col overflow-hidden pt-[4.5rem] lg:pt-20"
    >
      {/* Símbolo da marca em órbita: ao fundo no celular, à direita no desktop */}
      <OrbitVisual className="absolute top-[4.5rem] -right-[38%] -z-10 w-[118%] opacity-[0.16] sm:-right-[20%] sm:w-[85%] lg:top-1/2 lg:right-[-4%] lg:w-[min(50vw,640px)] lg:-translate-y-1/2 lg:opacity-100" />

      <Container className="flex flex-1 flex-col justify-center py-16 sm:py-24">
        <div className="max-w-[44rem] lg:max-w-[40rem] xl:max-w-[46rem]">
          <h1
            id="hero-title"
            className="hero-in text-[clamp(2.15rem,9.6vw,4rem)] leading-[1.04] tracking-[-0.038em] sm:leading-[1.02] lg:text-[4.6rem] xl:text-[5.4rem]"
          >
            <span className="font-light text-mute">Grandes ideias </span>
            <span className="font-semibold text-white">merecem grandes soluções digitais.</span>
          </h1>

          {/* O traço sob o título vem das peças oficiais da marca; aparece só aqui, na abertura */}
          <span className="hero-in brand-rule mt-8 sm:mt-10" style={{ animationDelay: '120ms' }} aria-hidden="true" />

          <p
            className="hero-in mt-8 max-w-[34rem] text-[1.05rem] leading-relaxed text-mute sm:mt-10 sm:text-lg"
            style={{ animationDelay: '200ms' }}
          >
            Transformamos ideias em experiências digitais por meio de sites, sistemas, aplicativos e
            soluções tecnológicas personalizadas para o seu negócio.
          </p>

          <div
            className="hero-in mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '280ms' }}
          >
            <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="lg">
              <WhatsAppIcon className="h-5 w-5" />
              Solicitar orçamento
            </ButtonLink>
            <ButtonLink href="#servicos" onClick={handleAnchorClick('servicos')} variant="outline" size="lg">
              Conheça nossos serviços
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
