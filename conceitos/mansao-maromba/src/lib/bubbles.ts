import { reduced, whileVisible } from './env';

/** Bolhas de gás subindo, em canvas 2D leve. Pausa sozinho fora da tela. */
export class Bubbles {
  private ctx: CanvasRenderingContext2D;
  private items: { x: number; y: number; r: number; s: number; w: number; a: number }[] = [];
  private raf = 0;
  private running = false;
  private w = 0;
  private h = 0;
  private dpr = 1;
  color = '233,185,87';

  constructor(
    private canvas: HTMLCanvasElement,
    private density = 1,
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    whileVisible(canvas, (v) => (v ? this.start() : this.stop()));
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = Math.max(1, r.width * this.dpr);
    this.h = Math.max(1, r.height * this.dpr);
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    const n = Math.round(Math.min(90, ((r.width * r.height) / 14000) * this.density));
    this.items = Array.from({ length: n }, () => this.spawn(true));
    if (reduced) this.draw(0);
  }

  private spawn(anywhere = false) {
    const r = (0.8 + Math.random() ** 2.4 * 5.5) * this.dpr;
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : this.h + r * 2,
      r,
      s: (0.25 + Math.random() * 0.9) * this.dpr * (0.6 + r / (6 * this.dpr)),
      w: Math.random() * Math.PI * 2,
      a: 0.25 + Math.random() * 0.55,
    };
  }

  private draw(dt: number) {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    for (let i = 0; i < this.items.length; i++) {
      const b = this.items[i];
      if (dt) {
        b.y -= b.s * dt * 60;
        b.w += dt * 1.6;
        if (b.y < -b.r * 2) this.items[i] = this.spawn();
      }
      const x = b.x + Math.sin(b.w) * b.r * 0.9;
      ctx.beginPath();
      ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${this.color},${b.a})`;
      ctx.lineWidth = Math.max(0.6, b.r * 0.22);
      ctx.stroke();
      if (b.r > 2.5 * this.dpr) {
        ctx.beginPath();
        ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b.a * 0.7})`;
        ctx.fill();
      }
    }
  }

  start() {
    if (this.running || reduced) return;
    this.running = true;
    let last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.draw(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
}
