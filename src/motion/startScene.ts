/**
 * Liga a escultura 3D à rolagem da página.
 * Este módulo (com Three.js e GSAP) é carregado depois que a página já está visível.
 *
 * Cada seção marcada com data-stage="1..4" dispara uma transição da escultura enquanto
 * entra na tela. Como o progresso é derivado da posição da rolagem, voltar a página
 * desfaz as transições na ordem inversa.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OrbynSculpture } from '../three/OrbynSculpture';
import { detectQuality } from '../three/support';

gsap.registerPlugin(ScrollTrigger);

type StartOptions = {
  onReady: () => void;
  onFail: () => void;
};

export function startScene(canvas: HTMLCanvasElement, { onReady, onFail }: StartOptions): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let sculpture: OrbynSculpture;
  try {
    sculpture = new OrbynSculpture(canvas, {
      quality: detectQuality(),
      reducedMotion: reduced,
      onFirstFrame: onReady,
      onContextLost: onFail,
    });
  } catch {
    onFail();
    return () => {};
  }

  const triggers: ScrollTrigger[] = [];
  const markers = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]')).sort(
    (a, b) => Number(a.dataset.stage) - Number(b.dataset.stage),
  );
  const parts = markers.map(() => 0);

  // Movimento reduzido: troca de composição sem animação, só ao atravessar o meio da transição
  let lastStatic = -1;
  const apply = () => {
    const total = parts.reduce((sum, value) => sum + value, 0);
    if (reduced) {
      const snapped = Math.round(total);
      if (snapped !== lastStatic) {
        lastStatic = snapped;
        sculpture.jumpTo(snapped);
        sculpture.renderOnce();
      }
      return;
    }
    sculpture.setTarget(total);
  };

  markers.forEach((marker, index) => {
    triggers.push(
      ScrollTrigger.create({
        trigger: marker,
        start: 'top 82%',
        end: 'top 18%',
        onUpdate: (self) => {
          parts[index] = self.progress;
          apply();
        },
        onRefresh: (self) => {
          parts[index] = self.progress;
          apply();
        },
      }),
    );
  });

  // Dentro de "Serviços", os fios giram conforme cada serviço entra na tela
  const services = document.getElementById('servicos');
  if (services && !reduced) {
    triggers.push(
      ScrollTrigger.create({
        trigger: services,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => sculpture.setPhase(self.progress),
      }),
    );
  }

  // Atrás do formulário de contato a cena recolhe, para não disputar atenção com os campos
  const contact = document.getElementById('contato');
  if (contact) {
    triggers.push(
      ScrollTrigger.create({
        trigger: contact,
        start: 'top 75%',
        end: 'top 15%',
        onUpdate: (self) => {
          sculpture.setFade(1 - self.progress * 0.8);
          if (reduced) sculpture.renderOnce();
        },
      }),
    );
  }

  // Manifesto: as palavras acendem conforme a leitura avança
  const tweens: gsap.core.Tween[] = [];
  if (!reduced) {
    document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((block) => {
      const words = block.querySelectorAll<HTMLElement>('[data-word]');
      if (!words.length) return;
      tweens.push(
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: { trigger: block, start: 'top 78%', end: 'bottom 52%', scrub: 0.6 },
          },
        ),
      );
    });
  }

  ScrollTrigger.refresh();
  // Ao abrir a página no meio (link com #secao ou recarregamento), já começa na composição certa
  const initial = parts.reduce((sum, value) => sum + value, 0);
  sculpture.jumpTo(reduced ? Math.round(initial) : initial);

  if (reduced) sculpture.renderOnce();
  else sculpture.start();

  // Ponteiro: só em dispositivos com mouse
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const onPointer = (event: PointerEvent) => {
    sculpture.setPointer((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
  };
  if (finePointer && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

  let resizeTimer = 0;
  let lastWidth = window.innerWidth;
  let lastHeight = canvas.clientHeight;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // No celular, a barra de endereço muda a altura o tempo todo: só redimensiona em mudanças reais
      const width = window.innerWidth;
      const height = canvas.clientHeight;
      if (width === lastWidth && Math.abs(height - lastHeight) < 120) return;
      lastWidth = width;
      lastHeight = height;
      sculpture.resize();
      if (reduced) sculpture.renderOnce();
    }, 150);
  };
  window.addEventListener('resize', onResize);

  // Economiza bateria quando a aba não está visível
  const onVisibility = () => {
    if (reduced) return;
    if (document.hidden) sculpture.stop();
    else sculpture.start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    triggers.forEach((trigger) => trigger.kill());
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    window.clearTimeout(resizeTimer);
    sculpture.dispose();
  };
}
