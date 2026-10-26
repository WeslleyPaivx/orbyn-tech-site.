import { whatsappMessages } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { ButtonLink } from '../ui/Button';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { Container } from '../ui/Container';
import { Magnetic } from '../ui/Magnetic';
import { Reveal } from '../ui/Reveal';
import { SplitWords } from '../ui/SplitWords';

/**
 * Encerramento: os fios se reorganizam no símbolo da ORBYN TECH (data-stage="4"),
 * que fica no alto da tela enquanto a mensagem final aparece embaixo.
 */
export function FinalCta() {
  return (
    <section
      id="futuro"
      data-stage="4"
      aria-labelledby="futuro-title"
      className="relative flex min-h-[100svh] flex-col justify-end pt-32 pb-16 sm:pb-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/75 to-transparent"
        aria-hidden="true"
      />
      <Container className="legible relative text-center">
        <Reveal>
          <p className="eyebrow justify-center">
            <span className="text-white/85">07</span>
            <span className="h-px w-6 bg-white/20" aria-hidden="true" />
            Próximo passo
          </p>
        </Reveal>
        <SplitWords
          id="futuro-title"
          lines={['Seu futuro digital', 'começa aqui.']}
          accentPeriod
          className="mx-auto mt-7 max-w-[16ch] text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.98] font-medium tracking-[-0.05em] text-white"
        />
        <Reveal delay={150}>
          <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-mute">
            Conte o que você precisa e receba um orçamento sem compromisso, direto no WhatsApp.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="lg">
                <WhatsAppIcon className="h-5 w-5" />
                Solicitar um orçamento
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="#contato" onClick={handleAnchorClick('contato')} variant="outline" size="lg">
                Preencher formulário
              </ButtonLink>
            </Magnetic>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
