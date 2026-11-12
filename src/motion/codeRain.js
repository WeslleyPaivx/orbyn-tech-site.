// Código em cachoeira: colunas de código de verdade (sites, automação, CRM, chatbot) descendo pela tela,
// a cabeça clara e o rastro rosa se apagando. O cursor é uma pedra no meio da água: o código abre
// caminho em volta dele, acelera, acende em lilás e embaralha um pouco.
// Cada quadro é redesenhado do zero (sem rastro acumulado, que deixava fantasmas na tela).
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
const GLITCH = '{}<>/=;:01[]()*+#';
const rnd = (a, b) => a + Math.random() * (b - a);

export function codeRain({ canvas, reduced, strength = 1 }) {
  const ctx = canvas.getContext('2d');
  const host = canvas.parentElement;
  let w = 0, h = 0, fs = 16, rows = 0, trail = 16, drops = [];
  const pointer = { x: -1e4, y: -1e4, on: false };
  const R = () => Math.min(170, w * 0.22); // raio da "pedra"

  const spawn = (x, first) => ({
    x,
    s: SNIPPETS[(Math.random() * SNIPPETS.length) | 0],
    row0: first ? Math.floor(rnd(-rows, rows * 0.7)) : Math.floor(rnd(-12, 0)),
    p: 0, // quantas letras já desceram
    speed: rnd(10, 22), // letras por segundo
    wait: first ? 0 : rnd(0, 1.2),
  });

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fs = w < 720 ? 13 : 16;
    rows = Math.ceil(h / fs);
    trail = w < 720 ? 12 : 16;
    const step = fs * 1.2;
    const cols = Math.floor(w / step);
    drops = [];
    for (let i = 0; i < cols; i++) if (Math.random() < 0.8) drops.push(spawn(i * step + step * 0.2, true));
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${fs}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'top';
    const r = R();
    for (const d of drops) {
      if (d.wait > 0) { d.wait -= dt; continue; }
      // a coluna perto do cursor corre mais
      const colNear = pointer.on && Math.abs(d.x - pointer.x) < r;
      d.p += d.speed * (colNear ? 2.4 : 1) * dt;
      const head = Math.floor(d.p);
      if (head - trail > d.s.length || (d.row0 + head - trail) * fs > h) {
        Object.assign(d, spawn(d.x, false));
        continue;
      }
      const k0 = Math.max(0, head - trail);
      const k1 = Math.min(head, d.s.length - 1);
      for (let k = k0; k <= k1; k++) {
        const y = (d.row0 + k) * fs;
        if (y < -fs || y > h) continue;
        const age = (head - k) / trail; // 0 = cabeça, 1 = some
        let x = d.x;
        let a = (1 - age) * strength;
        let color = k === head ? '255, 240, 252' : '234, 54, 194';
        let ch = d.s[k];
        if (pointer.on) {
          const dx = x - pointer.x, dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < r) {
            const f = 1 - dist / r;
            // a água abre caminho em volta da pedra
            x += Math.sign(dx || 1) * f * f * r * 0.75;
            a = Math.min(1, a + f * 0.7);
            color = f > 0.55 ? '255, 255, 255' : '201, 166, 255';
            if (Math.random() < f * 0.25) ch = GLITCH[(Math.random() * GLITCH.length) | 0];
          }
        }
        if (a <= 0.02) continue;
        ctx.fillStyle = `rgba(${color}, ${a})`;
        ctx.fillText(ch, x, y);
      }
    }
  }

  resize();
  addEventListener('resize', resize);
  const move = (e) => {
    const b = canvas.getBoundingClientRect();
    pointer.x = e.clientX - b.left;
    pointer.y = e.clientY - b.top;
    pointer.on = true;
  };
  host.addEventListener('pointermove', move);
  host.addEventListener('pointerdown', move);
  host.addEventListener('pointerleave', () => (pointer.on = false));

  if (reduced) {
    drops.forEach((d) => (d.p = Math.min(d.s.length, rnd(4, 30))));
    draw(0);
    return;
  }
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  gsap.ticker.add((t, dtMs) => {
    if (!visible) return;
    draw(Math.min(0.05, dtMs / 1000));
  });
}
