import { useEffect, useRef } from 'react';
import { supportsWebGL2 } from '../../three/support';

/**
 * Canvas da orbe de partículas, dentro da seção do manifesto.
 *
 * Três cuidados de desempenho, todos deliberados:
 *  - O código 3D só é baixado quando a seção se aproxima da tela.
 *  - A orbe pausa quando sai de vista; não há motivo para queimar GPU
 *    animando partículas que ninguém está vendo.
 *  - Sem WebGL 2 o canvas simplesmente não aparece e a seção segue inteira —
 *    o conteúdo nunca depende da cena.
 */
export function StormOrb() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !supportsWebGL2()) return;

    let cancelled = false;
    let scene: { start(): void; stop(): void; resize(): void; dispose(): void; setPointer(x: number, y: number): void } | null =
      null;
    let visible = false;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const load = async () => {
      try {
        const [{ OrbScene }, { detectQuality }] = await Promise.all([
          import('../../three/OrbScene'),
          import('../../three/support'),
        ]);
        if (cancelled) return;
        scene = new OrbScene(canvas, {
          quality: detectQuality(),
          reducedMotion: reduced,
          onFail: () => scene?.stop(),
        });
        if (visible) scene.start();
      } catch {
        /* Sem a cena a seção continua completa. */
      }
    };

    // Carrega um pouco antes de entrar na tela, para a orbe já estar viva
    // quando a seção chegar — mas nunca no carregamento inicial da página.
    const loader = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        loader.disconnect();
        void load();
      },
      { rootMargin: '300px 0px' },
    );
    loader.observe(host);

    const player = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) scene?.start();
        else scene?.stop();
      },
      { threshold: 0.01 },
    );
    player.observe(host);

    const onResize = () => scene?.resize();
    window.addEventListener('resize', onResize);

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      scene?.setPointer(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      cancelled = true;
      loader.disconnect();
      player.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      scene?.dispose();
    };
  }, []);

  return (
    <div className="particle-wrap" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
