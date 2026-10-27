import { useEffect, useRef, useState } from 'react';
import { heroMedia } from '../../config/site';
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery';

/**
 * A paisagem Pink Grass como cenário do hero.
 *
 * Arte dirigida: o material é 1,34:1 e nenhuma tela tem essa proporção, então
 * o ponto de foco muda entre desktop e celular (tokens --hero-focus-*).
 *
 * O vídeo só entra depois que o poster já pintou, e nunca entra quando o
 * visitante pede menos movimento — nesses casos a imagem estática fica.
 */
export function HeroMedia() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmall = useMediaQuery('(max-width: 767px)');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  // O vídeo só é montado depois da primeira pintura: o poster leva o LCP,
  // o vídeo entra em seguida sem disputar banda com o conteúdo crítico.
  const [mountVideo, setMountVideo] = useState(false);
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.requestAnimationFrame(() => setMountVideo(true));
    return () => window.cancelAnimationFrame(id);
  }, [reducedMotion]);

  // Alguns navegadores recusam o autoplay mesmo com muted; sem isso o hero
  // ficaria congelado no primeiro quadro sem nenhum aviso.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mountVideo) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => setReady(false));
    }
  }, [mountVideo]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-sky" aria-hidden="true">
      <img
        src={heroMedia.poster}
        alt=""
        decoding="async"
        fetchPriority="high"
        className="hero-media absolute inset-0 h-full w-full object-cover"
      />

      {mountVideo && (
        <video
          ref={videoRef}
          className="hero-media absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-[var(--ease-cine)]"
          style={{ opacity: ready ? 1 : 0 }}
          src={isSmall ? heroMedia.videoSmall : heroMedia.videoLarge}
          poster={heroMedia.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          tabIndex={-1}
          onPlaying={() => setReady(true)}
        />
      )}

      {/* Garante contraste do texto escuro mesmo se a área clara do céu
          deslocar durante o loop. Leve o bastante para não achatar a cor. */}
      <div className="hero-scrim pointer-events-none absolute inset-0" />
    </div>
  );
}
