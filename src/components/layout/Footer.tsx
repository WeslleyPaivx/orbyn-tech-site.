import { navItems, site } from '../../config/site';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';

const SERVICE_LINKS = [
  { id: 'solucoes', label: 'Desenvolvimento de sites' },
  { id: 'google', label: 'Google Meu Negócio' },
  { id: 'solucoes', label: 'Automações e IA' },
  { id: 'solucoes', label: 'Chatbots' },
  { id: 'solucoes', label: 'Sistemas e aplicações' },
];

/** 09 — RODAPÉ. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-z">
      <div className="container-z">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="brand-z" href="#inicio" onClick={handleAnchorClick('inicio')}>
              zaniva.
            </a>
            <p className="eyebrow-z" style={{ marginTop: 8 }}>
              AGÊNCIA DIGITAL
            </p>
            <p className="dim-z">Estratégia. Tecnologia. Resultados.</p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="foot-title">Navegação</h2>
            <div className="foot-group">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={handleAnchorClick(item.id)}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div>
            <h2 className="foot-title">Serviços</h2>
            <div className="foot-group">
              {SERVICE_LINKS.map((item) => (
                <a key={item.label} href={`#${item.id}`} onClick={handleAnchorClick(item.id)}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="foot-title">Conecte-se</h2>
            <div className="foot-group">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href={`tel:+${site.whatsapp.number}`}>{site.whatsapp.display}</a>
            </div>
          </div>

          <div className="foot-cta">
            <p>Vamos conversar sobre seu projeto?</p>
            <a className="btn-z is-primary" href="#contato" onClick={handleAnchorClick('contato')}>
              Solicitar orçamento ↗
            </a>
          </div>
        </div>

        <div className="copyright-z">
          <span>© {year} Zaniva Digital. Todos os direitos reservados.</span>
          <span>{site.whatsapp.display}</span>
        </div>
      </div>
    </footer>
  );
}
