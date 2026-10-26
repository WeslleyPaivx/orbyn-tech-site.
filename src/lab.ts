/**
 * Laboratório isolado da escultura 3D (somente desenvolvimento).
 * Parâmetros: ?p=0..4 (composição), ?t=segundos (tempo fixo), ?q=high|medium|low, ?phase=0..1
 */
import { OrbynSculpture } from './three/OrbynSculpture';
import { supportsWebGL2, type Quality } from './three/support';

const params = new URLSearchParams(location.search);
const canvas = document.getElementById('lab-canvas') as HTMLCanvasElement;
const range = document.getElementById('lab-progress') as HTMLInputElement;
const phase = document.getElementById('lab-phase') as HTMLInputElement;
const out = document.getElementById('lab-out') as HTMLOutputElement;

Object.assign(document.body.style, { margin: '0', background: '#080B10', color: '#F5F7FA', font: '13px Inter, system-ui' });
Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh', display: 'block' });
const ui = document.getElementById('lab-ui') as HTMLElement;
Object.assign(ui.style, { position: 'fixed', left: '16px', bottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' });
if (params.has('hideui')) ui.style.display = 'none';

declare global {
  interface Window {
    __lab?: { sculpture: OrbynSculpture | null; ready: boolean; webgl2: boolean };
  }
}

const webgl2 = supportsWebGL2();
window.__lab = { sculpture: null, ready: false, webgl2 };

if (webgl2) {
  const fixed = params.get('t');
  const sculpture = new OrbynSculpture(canvas, {
    quality: (params.get('q') as Quality) || 'high',
    fixedTime: fixed !== null ? Number(fixed) : undefined,
    onFirstFrame: () => {
      window.__lab!.ready = true;
    },
  });
  window.__lab.sculpture = sculpture;
  const p0 = Number(params.get('p') ?? 0);
  range.value = String(p0);
  sculpture.jumpTo(p0);
  sculpture.setPhase(Number(params.get('phase') ?? 0));
  range.addEventListener('input', () => sculpture.setTarget(Number(range.value)));
  phase.addEventListener('input', () => sculpture.setPhase(Number(phase.value)));
  window.addEventListener('resize', () => sculpture.resize());
  window.addEventListener('pointermove', (e) =>
    sculpture.setPointer((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)),
  );
  const show = () => {
    out.textContent = Number(range.value).toFixed(2);
    requestAnimationFrame(show);
  };
  show();
  if (params.has('once')) sculpture.renderOnce();
  else sculpture.start();
} else {
  out.textContent = 'WebGL 2 indisponível';
}
