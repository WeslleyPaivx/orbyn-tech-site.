import { useEffect, useRef, useState } from 'react';
import { supportsWebGL2 } from '../../three/support';

export type SceneMode = 'loading' | 'webgl' | 'fallback';

type SceneLayerProps = { onModeChange?: (mode: SceneMode) => void };

/**
 * Canvas fixo atrás de toda a página, onde vive a escultura 3D.
 * O código 3D (Three.js + GSAP) só é baixado depois que o conteúdo já apareceu.
 * Sem WebGL 2, ou se algo falhar, a página segue normalmente com a versão leve do hero.
 */
export function SceneLayer({ onModeChange }: SceneLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !supportsWebGL2()) {
      setFailed(true);
      onModeChange?.('fallback');
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const fail = () => {
      if (cancelled) return;
      setFailed(true);
      onModeChange?.('fallback');
    };

    const load = () => {
      import('../../motion/startScene')
        .then(({ startScene }) => {
          if (cancelled) return;
          cleanup = startScene(canvas, {
            onReady: () => {
              if (cancelled) return;
              setReady(true);
              onModeChange?.('webgl');
            },
            onFail: fail,
          });
        })
        .catch(fail);
    };

    // Carregamento progressivo: espera o navegador ficar livre depois da primeira pintura
    // requestIdleCallback não existe no Safari
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idle = hasIdle ? window.requestIdleCallback(load, { timeout: 1500 }) : window.setTimeout(load, 400);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, [onModeChange]);

  if (failed) return null;

  return (
    <div className="scene-layer" aria-hidden="true">
      <canvas ref={canvasRef} className={`scene-canvas ${ready ? 'is-ready' : ''}`} />
    </div>
  );
}
