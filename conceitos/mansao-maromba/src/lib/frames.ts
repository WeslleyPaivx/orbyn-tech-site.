import { clamp, lerp } from './env';

/**
 * Sequência de quadros do mergulho, desenhada num canvas e controlada pela rolagem.
 *
 * Memória: os quadros ficam guardados comprimidos (WebP, ~70 KB cada). Só uma janela
 * pequena em volta do quadro atual é decodificada; o resto é liberado. Assim a página
 * não segura 160 imagens Full HD abertas ao mesmo tempo.
 */

export interface FrameSet {
  count: number;
  pattern: string;
  width: number;
  height: number;
  /** Cada quadro deste conjunto equivale a `step` quadros do vídeo original. */
  step: number;
}

export interface Manifest {
  desktop: FrameSet;
  mobile: FrameSet;
  fps: number;
  /** Centro da garrafa em cada quadro do vídeo original (0–1), para enquadrar no celular. */
  focusX: number[];
  focusY: number[];
}

type Drawable = ImageBitmap | HTMLImageElement;

const canBitmap = typeof window.createImageBitmap === 'function';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

interface Store {
  loaded: number;
  load(first?: number, concurrency?: number): Promise<void>;
  focus(center: number, dir: number): void;
  get(i: number): Drawable | null;
  has(i: number): boolean;
  dispose(): void;
}

/**
 * Celular: todos os quadros (leves, 960 px) ficam carregados como imagens.
 * O quadro pedido é sempre desenhado na hora, sem esperar decodificação assíncrona,
 * então a garrafa nunca "congela" enquanto o dedo rola rápido.
 */
class ImageStore implements Store {
  private imgs: (HTMLImageElement | null)[];
  private urls: string[];
  loaded = 0;

  constructor(
    readonly set: FrameSet,
    private onReady: () => void,
  ) {
    this.imgs = new Array(set.count).fill(null);
    this.urls = Array.from({ length: set.count }, (_, i) => set.pattern.replace('%04d', String(i).padStart(4, '0')));
  }

  async load(first = 10, concurrency = 6) {
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < this.set.count && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    for (let i = 0; i < first; i++) push(i);
    for (const stride of [6, 3, 1]) for (let i = 0; i < this.set.count; i += stride) push(i);
    let next = 0;
    const worker = async () => {
      while (next < order.length) {
        const i = order[next++];
        try {
          const img = await loadImage(this.urls[i]);
          try {
            await img.decode();
          } catch {
            /* decodifica no primeiro desenho */
          }
          this.imgs[i] = img;
          this.loaded++;
          this.onReady();
        } catch {
          /* quadro ausente: o vizinho cobre */
        }
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  focus() {
    /* tudo já fica em memória */
  }

  get(i: number) {
    if (this.imgs[i]) return this.imgs[i];
    for (let d = 1; d < this.set.count; d++) {
      const a = this.imgs[i - d] ?? this.imgs[i + d];
      if (a) return a;
    }
    return null;
  }

  has(i: number) {
    return Boolean(this.imgs[i]);
  }

  dispose() {
    this.imgs.fill(null);
  }
}

class FrameStore implements Store {
  private blobs: (Blob | null)[];
  private decoded = new Map<number, Drawable>();
  private decoding = new Set<number>();
  private urls: string[];
  private center = 0;
  loaded = 0;

  constructor(
    readonly set: FrameSet,
    private onDecoded: () => void,
  ) {
    this.blobs = new Array(set.count).fill(null);
    this.urls = Array.from({ length: set.count }, (_, i) => set.pattern.replace('%04d', String(i).padStart(4, '0')));
  }

  /** Baixa em passes: primeiro o começo, depois 1 a cada 8, 4, 2 e o resto. */
  async load(first = 10, concurrency = 5) {
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < this.set.count && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    for (let i = 0; i < first; i++) push(i);
    for (const stride of [8, 4, 2, 1]) for (let i = 0; i < this.set.count; i += stride) push(i);

    let next = 0;
    const worker = async () => {
      while (next < order.length) {
        const i = order[next++];
        try {
          const res = await fetch(this.urls[i]);
          if (!res.ok) throw new Error(String(res.status));
          this.blobs[i] = await res.blob();
          this.loaded++;
          if (Math.abs(i - this.center) <= 6) this.decode(i);
        } catch {
          /* quadro ausente: o vizinho mais próximo cobre */
        }
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  private async decode(i: number) {
    const blob = this.blobs[i];
    if (!blob || this.decoded.has(i) || this.decoding.has(i)) return;
    this.decoding.add(i);
    try {
      let img: Drawable;
      if (canBitmap) img = await createImageBitmap(blob);
      else {
        const url = URL.createObjectURL(blob);
        img = await loadImage(url);
        URL.revokeObjectURL(url);
      }
      // Pode ter saído da janela enquanto decodificava
      if (Math.abs(i - this.center) > 12) {
        if ('close' in img) img.close();
      } else {
        this.decoded.set(i, img);
        this.onDecoded();
      }
    } catch {
      /* ignora quadro corrompido */
    } finally {
      this.decoding.delete(i);
    }
  }

  /** Mantém decodificados só os quadros perto do atual (com folga na direção do movimento). */
  focus(center: number, dir: number) {
    this.center = center;
    const ahead = dir >= 0 ? 6 : 3;
    const behind = dir >= 0 ? 3 : 6;
    for (let i = center - behind; i <= center + ahead; i++) if (i >= 0 && i < this.set.count) this.decode(i);
    for (const [i, img] of this.decoded) {
      if (Math.abs(i - center) > 12) {
        if ('close' in img) img.close();
        this.decoded.delete(i);
      }
    }
  }

  /** Quadro pedido ou o decodificado mais próximo. */
  get(i: number): Drawable | null {
    const exact = this.decoded.get(i);
    if (exact) return exact;
    for (let d = 1; d < 14; d++) {
      const a = this.decoded.get(i - d) ?? this.decoded.get(i + d);
      if (a) return a;
    }
    return null;
  }

  has(i: number) {
    return this.decoded.has(i);
  }

  dispose() {
    for (const img of this.decoded.values()) if ('close' in img) img.close();
    this.decoded.clear();
  }
}

export interface DiveLayout {
  /** 'cover' no desktop; 'band' no celular (faixa central com reflexos em cima e embaixo). */
  mode: 'cover' | 'band';
  /** Topo da faixa em fração da altura (modo band). */
  bandTop: number;
  bandHeight: number;
}

export class DiveRenderer {
  private ctx: CanvasRenderingContext2D;
  private store: Store;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private last = -1;
  private lastDir = 1;
  private dirty = true;
  /** Deslocamento extra da faixa no celular enquanto o título do hero está na tela (0–1). */
  heroOffset = 0;
  /** Zoom extra de "câmera acompanhando" (0–1). */
  follow = 0;
  /** Escurecimento final para emendar com a próxima seção (0–1). */
  fadeOut = 0;
  /** Já desenhou ao menos um quadro real. */
  painted = false;
  /** Chamado quando um quadro novo termina de decodificar. */
  onFrame: (() => void) | null = null;
  layout: DiveLayout = { mode: 'cover', bandTop: 0.22, bandHeight: 0.56 };

  constructor(
    private canvas: HTMLCanvasElement,
    readonly manifest: Manifest,
    readonly set: FrameSet,
    private maxDpr: number,
  ) {
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    const onReady = () => {
      this.dirty = true;
      this.onFrame?.();
    };
    this.store = set.step > 1 ? new ImageStore(set, onReady) : new FrameStore(set, onReady);
    this.resize();
  }

  get sourceFrames() {
    return this.manifest.focusX.length;
  }

  load() {
    return this.store.load(10, this.set.step > 1 ? 4 : 6);
  }

  get loadedRatio() {
    return this.store.loaded / this.set.count;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    this.w = Math.max(1, Math.round(rect.width * this.dpr));
    this.h = Math.max(1, Math.round(rect.height * this.dpr));
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    const portrait = rect.width / rect.height < 1;
    this.layout = portrait
      ? { mode: 'band', bandTop: 0.21, bandHeight: Math.min(0.58, (rect.width * 1.32) / rect.height) }
      : { mode: 'cover', bandTop: 0, bandHeight: 1 };
    this.dirty = true;
  }

  /** `f` é a posição em quadros do vídeo original (pode ser fracionária). */
  render(f: number, force = false) {
    const local = clamp(f / this.set.step, 0, this.set.count - 1);
    if (!force && !this.dirty && Math.abs(local - this.last) < 0.004) return;
    if (local !== this.last) this.lastDir = local > this.last ? 1 : -1;
    this.last = local;
    this.dirty = false;

    const a = Math.floor(local);
    const b = Math.min(a + 1, this.set.count - 1);
    const t = local - a;
    this.store.focus(a, this.lastDir);

    const imgA = this.store.get(a);
    const imgB = this.store.has(b) ? this.store.get(b) : null;
    const { ctx, w, h } = this;
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    if (!imgA) {
      this.dirty = true;
      return;
    }
    this.painted = true;

    const src = Math.round(clamp(f, 0, this.sourceFrames - 1));
    const fx = this.manifest.focusX[src] ?? 0.5;
    const fy = this.manifest.focusY[src] ?? 0.5;
    const box = this.frameBox(fx, fy);

    if (this.layout.mode === 'band') this.drawReflections(imgA, box);
    ctx.drawImage(imgA, box.x, box.y, box.w, box.h);
    if (imgB && imgB !== imgA && t > 0.03) {
      ctx.globalAlpha = t;
      ctx.drawImage(imgB, box.x, box.y, box.w, box.h);
      ctx.globalAlpha = 1;
    }
    if (this.layout.mode === 'band') this.drawSeams(box);
    if (this.fadeOut > 0) {
      ctx.fillStyle = `rgba(5,5,5,${this.fadeOut})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  private frameBox(fx: number, fy: number) {
    const { w, h } = this;
    const ar = this.set.width / this.set.height;
    if (this.layout.mode === 'cover') {
      const zoom = 1 + this.follow * 0.16 + this.heroOffset * 0.07;
      let bw = Math.max(w, h * ar) * zoom;
      let bh = bw / ar;
      if (bh < h) {
        bh = h * zoom;
        bw = bh * ar;
      }
      // Centraliza no meio da tela, puxando para a garrafa conforme o zoom aumenta
      // No hero a garrafa vai um pouco para a direita, abrindo espaço para o título
      const cx = lerp(0.5, fx, this.follow * 0.7) - this.heroOffset * 0.07;
      const cy = lerp(0.5, fy, this.follow * 0.5);
      const x = clamp(w / 2 - cx * bw, w - bw, 0);
      const y = clamp(h / 2 - cy * bh, h - bh, 0);
      return { x, y, w: bw, h: bh };
    }
    // Celular: faixa central com a garrafa sempre enquadrada
    const zoom = 1 + this.follow * 0.12;
    const bh = h * this.layout.bandHeight * zoom;
    const bw = bh * ar;
    const x = clamp(w / 2 - fx * bw, w - bw, 0);
    const top = h * (this.layout.bandTop + this.heroOffset * 0.07) - (bh - h * this.layout.bandHeight) * fy;
    return { x, y: top, w: bw, h: bh };
  }

  /** Reflexo espelhado acima e abaixo da faixa (preenche a tela vertical sem esticar). */
  private drawReflections(img: Drawable, box: { x: number; y: number; w: number; h: number }) {
    const { ctx, h } = this;
    const sw = this.set.width;
    const sh = this.set.height;
    const below = h - (box.y + box.h);
    if (below > 0) {
      const srcH = Math.min(sh, (below / box.h) * sh);
      ctx.save();
      ctx.translate(0, box.y + box.h);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, sh - srcH, sw, srcH, box.x, -below, box.w, below);
      ctx.restore();
    }
    // Acima da faixa fica preto: o topo do vídeo já é escuro
  }

  private drawSeams(box: { x: number; y: number; w: number; h: number }) {
    const { ctx, w, h } = this;
    const feather = box.h * 0.12;
    // Acima: escurece o reflexo até virar preto
    if (box.y > 0) {
      const g = ctx.createLinearGradient(0, 0, 0, box.y + feather);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(box.y / (box.y + feather), 'rgba(0,0,0,0.9)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, box.y + feather);
    }
    const bottom = box.y + box.h;
    if (bottom < h) {
      const g = ctx.createLinearGradient(0, bottom - feather, 0, h);
      g.addColorStop(0, 'rgba(5,5,5,0)');
      g.addColorStop(0.3, 'rgba(5,5,5,0.55)');
      g.addColorStop(1, 'rgba(5,5,5,0.96)');
      ctx.fillStyle = g;
      ctx.fillRect(0, bottom - feather, w, h - bottom + feather);
    }
  }

  markDirty() {
    this.dirty = true;
  }

  dispose() {
    this.store.dispose();
  }
}

/**
 * Rolagem → quadro do vídeo. Quase linear: a garrafa começa a cair no primeiro
 * movimento do dedo e o vídeo anda num ritmo constante, sem trechos parados.
 */
const KEYS: [number, number][] = [
  [0, 0],
  [0.34, 56],
  [0.6, 104],
  [0.9, 158],
  [1, 162],
];

export function progressToFrame(p: number, last = 162) {
  const scale = last / 162;
  for (let i = 1; i < KEYS.length; i++) {
    const [p1, f1] = KEYS[i];
    const [p0, f0] = KEYS[i - 1];
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0);
      return lerp(f0, f1, t) * scale;
    }
  }
  return last;
}

