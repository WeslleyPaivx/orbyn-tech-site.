import { useEffect, useRef, useState } from 'react';
import { heroMedia } from '../../config/site';
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { HERO_READY_EVENT } from '../../motion/preloader';

/**
 * A paisagem Pink Grass como cenário do hero.
 *
 * São duas montagens do material original, não um arquivo redimensionado: o
 * Pink Grass é 1,34:1 e o celular é ~0,46:1, então recortar o deitado por CSS
 * jogava fora dois terços da largura e borrava o resto. A montagem vertical é
 * recortada na origem, em resolução cheia.
 *
 * O vídeo só entra depois da primeira pintura, nunca sob movimento reduzido, e
 * pausa quando sai de vista.
 */
export function HeroMedia() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmall = useMediaQuery('(max-width: 720px)');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [mountVideo, setMountVideo] = useState(false);

  const poster = isSmall ? heroMedia.posterPortrait : heroMedia.poster;

  // O poster é o LCP e o terceiro portão da cortina. Dispara também em erro:
  // se a imagem falhar, a cortina não pode ficar presa esperando.
  const announceHero = () => window.dispatchEvent(new Event(HERO_READY_EVENT));

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.requestAnimationFrame(() => setMountVideo(true));
    return () => window.cancelAnimationFrame(id);
  }, [reducedMotion]);

  // Alguns navegadores recusam o autoplay mesmo com muted; sem isto o hero
  // ficaria congelado no primeiro quadro sem nenhum aviso.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mountVideo) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => setReady(false));
  }, [mountVideo]);

  // Decodificar quadro que ninguém vê é gasto de bateria sem contrapartida.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    const onScroll = () => {
      const past = window.scrollY > (window.innerHeight || 0);
      if (past && !video.paused) video.pause();
      else if (!past && video.paused) void video.play().catch(() => {});
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion, mountVideo]);

  return (
    <>
      <img
        className="hero-media"
        src={poster}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        onLoad={announceHero}
        onError={announceHero}
      />

      {mountVideo && (
        <video
          ref={videoRef}
          className="hero-media"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 1s var(--ease-cine)' }}
          src={isSmall ? heroMedia.videoPortrait : heroMedia.videoLandscape}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
          onPlaying={() => setReady(true)}
        />
      )}

      <div className="hero-shade" aria-hidden="true" />
      <div className="chip-noise" aria-hidden="true" />
    </>
  );
}
