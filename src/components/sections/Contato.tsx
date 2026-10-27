import { heroMedia, site, whatsappMessages } from '../../config/site';
import { whatsappUrl } from '../../lib/whatsapp';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

/**
 * 08 — CONTATO.
 *
 * O campo rosa volta, recortado à direita por uma máscara em degradê: fecha o
 * site com a mesma paisagem que o abriu, sem repetir o hero.
 *
 * O WhatsApp é o canal real. Não há botão de e-mail porque não existe endereço
 * cadastrado — um botão que abre um alerta de "ainda não cadastrado" é pior do
 * que botão nenhum.
 */
export function Contato() {
  return (
    <section className="contact-z" id="contato" aria-labelledby="contato-title">
      <div
        className="contact-photo"
        style={{ backgroundImage: `url(${heroMedia.poster})` }}
        aria-hidden="true"
      />

      <Reveal className="container-z">
        <Eyebrow index="08" label="Contato" />
        <h2 id="contato-title" className="subhead-z">
          Sua próxima evolução
          <br />
          começa aqui.
        </h2>
        <p className="dim-z">Conte o que seu negócio precisa. Nós transformamos ideias em soluções digitais.</p>
        <div className="contact-actions">
          <a
            className="btn-z is-primary"
            href={whatsappUrl(whatsappMessages.quote)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp ↗
          </a>
          <a className="btn-z is-ghost" href={`tel:+${site.whatsapp.number}`}>
            {site.whatsapp.display}
          </a>
        </div>
      </Reveal>

      <div className="bottom-social" aria-hidden="true">
        INSTAGRAM
        <br />
        <span style={{ opacity: 0.7 }}>Novo perfil em definição</span>
      </div>
    </section>
  );
}
