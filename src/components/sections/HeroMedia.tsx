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
  const hostRef = useRef<HTMLDivElement>(null);
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

  // A paisagem recua ao rolar: escurece e afunda um pouco, abrindo espaço para
  // a nuvem de partículas atrás. Fica fora do WebGL de propósito, para que a
  // transição aconteça igual em aparelho sem placa de vídeo.
  //
  // Também pausa o vídeo quando ele sai de vista — decodificar quadros que
  // ninguém vê é gasto puro de bateria.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || reducedMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / height));
      host.style.setProperty('--hero-exit', p.toFixed(4));

      const video = videoRef.current;
      if (video) {
        if (p >= 1 && !video.paused) video.pause();
        else if (p < 1 && video.paused) void video.play().catch(() => {});
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div ref={hostRef} className="hero-stage absolute inset-0 -z-20 overflow-hidden bg-sky" aria-hidden="true">
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
