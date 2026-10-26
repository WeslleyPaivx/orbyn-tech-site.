import { gsap } from 'gsap';
import { $, reduced } from '../lib/env';

/**
 * Abertura com o vídeo real da logo (ET + espadas).
 * - autoplay mudo e inline, sem áudio
 * - botão para pular; rolar, tocar ou usar o teclado também pula
 * - se o vídeo não tocar (economia de bateria, rede lenta, erro), mostra a logo estática
 */
export function setupIntro(): Promise<void> {
  const root = $('#intro');
  const video = $<HTMLVideoElement>('.intro-video', root);
  const skip = $<HTMLButtonElement>('.intro-skip', root);
  const bar = $('.intro-bar i', root);
  const html = document.documentElement;

  return new Promise((resolve) => {
    let done = false;
    let timers: number[] = [];

    const finish = (fast = false) => {
      if (done) return;
      done = true;
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
      removeListeners();
      html.classList.remove('intro-lock');
      html.classList.add('intro-done');
      const tl = gsap.timeline({
        onComplete: () => {
          video.pause();
          video.removeAttribute('src');
          video.load();
          root.remove();
        },
      });
      if (reduced || fast) {
        tl.to(root, { opacity: 0, duration: 0.45, ease: 'power1.out' });
      } else {
        tl.to([video, '.intro-fallback'], { scale: 0.86, opacity: 0, duration: 0.9, ease: 'power3.in' }, 0)
          .to('.intro-badge, .intro-skip, .intro-bar', { opacity: 0, duration: 0.4 }, 0)
          .to(root, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 0.55);
      }
      // A página aparece enquanto a abertura sai
      window.setTimeout(resolve, reduced || fast ? 50 : 650);
    };

    const onUserIntent = (e: Event) => {
      if (e.type === 'keydown') {
        const k = (e as KeyboardEvent).key;
        if (!['ArrowDown', 'PageDown', ' ', 'End', 'Escape', 'Enter'].includes(k)) return;
        if (k === 'Enter' && document.activeElement === skip) return;
      }
      finish(true);
    };
    const listeners: [string, EventListener][] = [
      ['wheel', onUserIntent],
      ['touchmove', onUserIntent],
      ['keydown', onUserIntent],
    ];
    listeners.forEach(([t, fn]) => window.addEventListener(t, fn, { passive: true }));
    const removeListeners = () => listeners.forEach(([t, fn]) => window.removeEventListener(t, fn));

    skip.addEventListener('click', () => finish(true));

    const showStatic = (ms: number) => {
      root.classList.add('is-static');
      timers.push(window.setTimeout(() => finish(), ms));
    };

    // Link direto para uma seção: não faz o visitante assistir de novo
    if (location.hash && location.hash !== '#inicio') {
      finish(true);
      return;
    }
    if (reduced) {
      showStatic(1300);
      return;
    }

    // Vídeo menor no celular ou em conexão econômica
    const small = window.innerWidth < 768 || window.innerHeight < 700;
    video.src = small ? '/video/abertura-720.mp4' : '/video/abertura.mp4';
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // A logo fica completa por volta de 5,4 s; segura um instante e segue
    const END = 6.3;
    let started = false;
    video.addEventListener('playing', () => {
      started = true;
      root.classList.add('is-playing');
    });
    video.addEventListener('timeupdate', () => {
      bar.style.transform = `scaleX(${Math.min(1, video.currentTime / END)})`;
      if (video.currentTime >= END) finish();
    });
    video.addEventListener('ended', () => finish());
    video.addEventListener('error', () => showStatic(1600));

    const p = video.play();
    if (p) p.catch(() => showStatic(1800));
    // Rede lenta: não prende o visitante
    timers.push(window.setTimeout(() => !started && showStatic(900), 3200));
    // Trava de segurança
    timers.push(window.setTimeout(() => finish(), 11000));
  });
}
