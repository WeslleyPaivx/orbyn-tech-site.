import { whatsappMessages } from '../../config/site';
import { whatsappUrl } from '../../lib/whatsapp';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

/**
 * 05 — PRESENÇA NO GOOGLE.
 *
 * O celular à esquerda ilustra o PERFIL DA EMPRESA NO GOOGLE — a ficha que
 * aparece na busca e no Maps —, não anúncios pagos. Por isso a tela mostra
 * avaliações, rota, telefone e horário: é o que o perfil realmente tem.
 */
export function PresencaGoogle() {
  return (
    <section className="section-z surface-dark surface-grid google-z" id="google" aria-labelledby="google-title">
      <div className="container-z google-row">
        <div className="phone-zone">
          {/*
            A entrada e a perspectiva vivem em elementos SEPARADOS de propósito.
            Com as duas no mesmo nó, o `transform: translate3d(...)` do Reveal
            (especificidade maior) sobrescrevia a perspectiva do celular e ele
            renderizava reto — era por isso que parecia uma imagem colada no
            fundo em vez de um objeto no espaço.
          */}
          <Reveal className="phone-reveal">
            <div className="phone-z">
              <div className="phone-glare" aria-hidden="true" />
              <div className="phone-notch" aria-hidden="true" />
              <div className="phone-inner" aria-hidden="true">
              <div className="phone-search">⌕ &nbsp; Sua Empresa</div>
              <div className="phone-cover" />
              <h4>Sua Empresa</h4>
              <div style={{ fontSize: 10, color: '#777' }}>Perfil da Empresa no Google</div>
              <div className="phone-stars">★★★★★</div>
              <div className="phone-row">
                <span>
                  ◉<br />
                  Rotas
                </span>
                <span>
                  ☎<br />
                  Ligar
                </span>
                <span>
                  ▣<br />
                  Website
                </span>
                <span>
                  ⌂<br />
                  Salvar
                </span>
              </div>
                <div className="phone-line" />
                <div className="phone-line is-short" />
                <div className="phone-line" />
                <div className="phone-line is-short" />
              </div>
            </div>
          </Reveal>

          <div className="floating-pill float-a" aria-hidden="true">
            ⌖ &nbsp; Mais visibilidade
          </div>
          <div className="floating-pill float-b" aria-hidden="true">
            ✧ &nbsp; Relatórios de desempenho
          </div>
        </div>

        <Reveal className="google-copy">
          <Eyebrow index="05" label="Presença digital" />
          <h2 id="google-title" className="subhead-z">
            Sua empresa em
            <br />
            destaque no Google.
          </h2>
          <p className="dim-z">
            Gerenciamos e otimizamos o Perfil da Empresa no Google para que seu negócio seja encontrado, gere mais
            conexões e mantenha uma presença profissional e atualizada.
          </p>
          <div className="benefits">
            <span>Mais presença local</span>
            <span>Acompanhamento de avaliações</span>
            <span>Relatórios de desempenho</span>
          </div>
          <a
            className="btn-z is-primary"
            href={whatsappUrl(whatsappMessages.google)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero melhorar minha presença ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
