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
            <span className="text-sky/85">08</span>
            <span className="h-px w-6 bg-sky/20" aria-hidden="true" />
            Próximo passo
          </p>
        </Reveal>
        <SplitWords
          id="futuro-title"
          lines={['Sua próxima evolução', 'começa aqui.']}
          accentPeriod
          className="mx-auto mt-7 max-w-[17ch] font-display text-[clamp(2.4rem,8vw,6.4rem)] leading-[0.98] font-bold tracking-[-0.03em] text-sky"
        />
        <Reveal delay={150}>
          <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-mute">
            Conte o que seu negócio precisa. Nós transformamos ideias em soluções digitais.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="lg">
                <WhatsAppIcon className="h-5 w-5" />
                Solicitar um orçamento
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="#contato" onClick={handleAnchorClick('contato')} variant="onDark" size="lg">
                Preencher formulário
              </ButtonLink>
            </Magnetic>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
