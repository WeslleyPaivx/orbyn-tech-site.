import { useEffect, useState } from 'react';
import { site, whatsappMessages } from '../../config/site';
import { whatsappUrl } from '../../lib/whatsapp';
import { InstagramIcon, WhatsAppIcon } from '../ui/BrandIcons';

type FloatingButtonsProps = { hidden?: boolean };

/**
 * Atalhos fixos para WhatsApp e Instagram.
 * Ficam ocultos no topo da página e enquanto o formulário de contato está na tela
 * (onde já existem esses botões), para não cobrir textos, campos nem o botão de envio.
 */
export function FloatingButtons({ hidden = false }: FloatingButtonsProps) {
  const [contactVisible, setContactVisible] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  // Aparecem depois do início da página, onde os botões principais já estão visíveis
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const contact = document.getElementById('contato');
    if (!contact || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const hide = hidden || contactVisible || !pastHero;

  return (
    <div
      className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-center gap-3 transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] sm:right-6 sm:bottom-6 ${
        hide ? 'pointer-events-none translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      }`}
      aria-hidden={hide}
    >
      <a
        href={site.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hide ? -1 : 0}
        aria-label={`Instagram da ORBYN TECH (${site.instagram.handle})`}
        title={`Instagram ${site.instagram.handle}`}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink-2 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/50"
      >
        <InstagramIcon className="h-5 w-5" />
      </a>
      <a
        href={whatsappUrl(whatsappMessages.floating)}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hide ? -1 : 0}
        aria-label="Conversar com a ORBYN TECH pelo WhatsApp"
        title="Conversar pelo WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03]"
      >
        <span
          className="absolute inset-0 rounded-full border border-white/40 motion-safe:animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]"
          aria-hidden="true"
        />
        <WhatsAppIcon className="relative h-[1.6rem] w-[1.6rem]" />
      </a>
    </div>
  );
}
