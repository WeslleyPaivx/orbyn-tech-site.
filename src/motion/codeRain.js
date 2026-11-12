// Código em cachoeira: colunas de código de verdade (sites, automação, CRM, chatbot) descendo pela tela,
// a cabeça clara e o rastro rosa se apagando no roxo-noite. Perto do cursor, a água acelera e acende.
// Para quando sai da tela; com movimento reduzido, fica um quadro parado.
import { gsap } from 'gsap';

const SNIPPETS = [
  'const site = zaniva.criar({ marca, seo: true })',
  'site.publicar() // no ar',
  '<section class="hero">',
  'await whatsapp.enviar(lead)',
  'crm.cadastrar(contato)',
  'if (cliente.novo) bot.responder()',
  'google.perfil.postar({ fotos })',
  'export default function Hero() {',
  'fetch("/api/leads").then(r => r.json())',
  'motion.play({ ease: "expo.out" })',
  ':root { --rosa: #ea36c2 }',
  'cobranca.link({ valor, vencimento })',
  'for (const lead of funil) {',
  'return <Site rapido bonito />',
  'npm run build && deploy --prod',
  'agenda.marcar("sábado", "10h")',
  'design.paleta(["#0b0620", "#c9a6ff"])',
  'automacao.quando("novo lead").fazer(crm)',
];
const BG = '13, 7, 24'; // #0d0718
const rnd = (a, b) => a + Math.random() * (b - a);

export function codeRain({ canvas, reduced, strength = 1 }) {
  const ctx = canvas.getContext('2d');
  const host = canvas.parentElement;
  let w = 0, h = 0, fs = 16, drops = [];
  const pointer = { x: -1e4, y: -1e4 };

  const newDrop = (x, first) => ({
    x,
    y: first ? rnd(-h, h * 0.6) : rnd(-fs * 30, -fs),
    s: SNIPPETS[(Math.random() * SNIPPETS.length) | 0],
    k: 0,
    speed: rnd(9, 22), // linhas por segundo
    acc: 0,
    wait: first ? 0 : rnd(0, 2.5),
    prev: '',
  });

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fs = w < 720 ? 13 : 16;
    ctx.font = `${fs}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'top';
    const cols = Math.floor(w / (fs * 1.15));
    const gap = w / cols;
    // nem toda coluna corre ao mesmo tempo: cachoeira, não parede
    drops = Array.from({ length: cols }, (_, i) => newDrop(i * gap + gap * 0.2, true)).filter(() => Math.random() < 0.6);
    ctx.fillStyle = `rgb(${BG})`;
    ctx.fillRect(0, 0, w, h);
  }

  function step(dt) {
    // o rastro: cada quadro cobre um pouco de roxo-noite por cima
    ctx.fillStyle = `rgba(${BG}, ${Math.min(1, 0.09 * dt * 60)})`;
    ctx.fillRect(0, 0, w, h);
    for (const d of drops) {
      if (d.wait > 0) { d.wait -= dt; continue; }
      const near = Math.hypot(d.x - pointer.x, d.y - pointer.y) < 140;
      d.acc += d.speed * (near ? 3 : 1) * dt;
      while (d.acc >= 1) {
        d.acc -= 1;
        // a letra de antes deixa de ser cabeça e vira água rosa
        if (d.prev) {
          ctx.fillStyle = near ? 'rgba(201, 166, 255, 0.95)' : `rgba(234, 54, 194, ${0.75 * strength})`;
          ctx.fillText(d.prev, d.x, d.y - fs);
        }
        const ch = d.s[d.k] ?? ' ';
        ctx.fillStyle = near ? '#ffffff' : `rgba(255, 236, 250, ${0.95 * strength})`;
        ctx.fillText(ch, d.x, d.y);
        d.prev = ch;
        d.y += fs;
        d.k += 1;
        if (d.k >= d.s.length || d.y > h + fs) {
          Object.assign(d, newDrop(d.x, false));
          break;
        }
      }
    }
  }

  resize();
  addEventListener('resize', resize);
  host.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  });
  host.addEventListener('pointerleave', () => { pointer.x = pointer.y = -1e4; });

  if (reduced) {
    for (let i = 0; i < 240; i++) step(1 / 30);
    return;
  }
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  gsap.ticker.add((t, dtMs) => {
    if (!visible) return;
    step(Math.min(0.05, dtMs / 1000));
  });
}
