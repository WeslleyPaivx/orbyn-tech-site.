import { useEffect, useRef, useState } from 'react';
import { navItems, site, whatsappMessages } from '../../config/site';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { handleAnchorClick } from '../../lib/scroll';
import { whatsappUrl } from '../../lib/whatsapp';
import { Logo } from '../brand/Logo';
import { ButtonLink } from '../ui/Button';
import { InstagramIcon, WhatsAppIcon } from '../ui/BrandIcons';

const sectionIds = navItems.map((item) => item.id);

type HeaderProps = { onMenuChange?: (open: boolean) => void };

export function Header({ onMenuChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(sectionIds);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu mobile: trava a rolagem, fecha com Esc e devolve o foco ao botão
  useEffect(() => {
    onMenuChange?.(open);
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    firstLinkRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open, onMenuChange]);

  const close = () => setOpen(false);
  const solid = scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        solid
          ? 'border-b border-line/80 bg-ink/95 lg:bg-ink/80 lg:backdrop-blur-xl lg:backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Pular para o conteúdo
      </a>

      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-10">
        <a
          href="#inicio"
          onClick={handleAnchorClick('inicio', close)}
          className="rounded-md"
          aria-label="ZANIVA DIGITAL — voltar ao início"
        >
          <Logo full className="h-7 sm:h-8 lg:h-9" />
        </a>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={handleAnchorClick(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative flex h-10 items-center rounded-full px-4 text-[0.9rem] transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-mute hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_rgb(54_221_232/0.8)] transition-[opacity,transform] duration-300 ${
                        isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="md">
              Solicitar orçamento
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/[0.06] lg:hidden"
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-transform duration-300 ease-[var(--ease-soft)] ${
                  open ? 'top-[5px] rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] rounded-full bg-current transition-all duration-300 ease-[var(--ease-soft)] ${
                  open ? 'top-[5px] w-5 -rotate-45' : 'top-[10px] w-3.5'
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Menu mobile (fora do <header> porque o desfoque do cabeçalho prenderia o posicionamento fixo) */}
      <div
        id="menu-mobile"
        className={`fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-ink transition-[opacity,visibility] duration-400 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Navegação principal (celular)" className="flex min-h-full flex-col px-5 pt-6 pb-10 sm:px-8">
          <ul className="flex flex-col">
            {navItems.map((item, index) => {
              const isActive = active === item.id;
              return (
                <li
                  key={item.id}
                  className={`border-b border-line transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] ${
                    open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: open ? `${80 + index * 50}ms` : '0ms' }}
                >
                  <a
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={`#${item.id}`}
                    onClick={handleAnchorClick(item.id, close)}
                    aria-current={isActive ? 'true' : undefined}
                    className="flex items-center justify-between py-5 text-[1.75rem] font-medium tracking-[-0.02em] text-white"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full bg-accent transition-opacity ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div
            className={`mt-auto flex flex-col gap-3 pt-10 transition-[opacity,transform] duration-500 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
            style={{ transitionDelay: open ? '340ms' : '0ms' }}
          >
            <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="lg" onClick={close}>
              <WhatsAppIcon className="h-5 w-5" />
              Solicitar orçamento
            </ButtonLink>
            <ButtonLink href={site.instagram.url} external size="lg" variant="outline" onClick={close}>
              <InstagramIcon className="h-5 w-5" />
              {site.instagram.handle}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </>
  );
}
