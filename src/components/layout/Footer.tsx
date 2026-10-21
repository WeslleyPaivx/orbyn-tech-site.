import { navItems, site, whatsappMessages } from '../../config/site';
import { services } from '../../data/services';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { Logo } from '../brand/Logo';
import { InstagramIcon, WhatsAppIcon } from '../ui/BrandIcons';
import { Container } from '../ui/Container';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-20 pb-28 sm:pb-12">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <a href="#inicio" onClick={handleAnchorClick('inicio')} aria-label="ORBYN TECH — voltar ao início" className="inline-block rounded-md">
              <Logo />
            </a>
            <p className="mt-6 max-w-xs leading-relaxed text-mute">{site.description}</p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-sm font-medium text-white">Navegação</h2>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={handleAnchorClick(item.id)}
                    className="text-mute transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-medium text-white">Serviços</h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href={whatsappUrl(whatsappMessages.service(service.messageLabel))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mute transition-colors hover:text-white"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h2 className="text-sm font-medium text-white">Contato</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={whatsappUrl(whatsappMessages.floating)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-mute transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />
                  {site.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-mute transition-colors hover:text-white"
                >
                  <InstagramIcon className="h-[1.1rem] w-[1.1rem]" />
                  {site.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Todos os direitos reservados.
          </p>
          <p>{site.slogan}</p>
        </div>
      </Container>
    </footer>
  );
}
