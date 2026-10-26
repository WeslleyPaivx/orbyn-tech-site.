import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Flavor } from './brand';
import { buildCan } from './can';

/**
 * Cena do produto guiada pela rolagem.
 *
 * Dois modos com a mesma interface:
 *  - FrameSequence: quadros de um vídeo (ex.: gerado no Kling) avançando com a rolagem.
 *    Basta colocar os quadros em /public/frames e o arquivo /public/frames/manifest.json.
 *  - LiveDive: versão provisória desenhada por código (a lata cai, mergulha e sobe com bolhas).
 */
export interface ProductScene {
  setProgress(p: number): void;
  resize(): void;
  setVisible(v: boolean): void;
  dispose(): void;
}

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const band = (x: number, a: number, b: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ======================================================================= quadros de vídeo */

export type FrameManifest = { count: number; pattern: string; width: number; height: number };

/** Lê /frames/manifest.json; se não existir, a cena usa a versão por código. */
export async function loadFrameManifest(): Promise<FrameManifest | null> {
  try {
    const res = await fetch('/frames/manifest.json', { cache: 'no-cache' });
    if (!res.ok) return null;
    const data = (await res.json()) as FrameManifest;
    return data.count > 1 ? data : null;
  } catch {
    return null;
  }
}

export class FrameSequence implements ProductScene {
  private ctx: CanvasRenderingContext2D;
  private frames: (HTMLImageElement | null)[];
  private target = 0;
  private current = -1;
  private raf = 0;
  private dpr = 1;

  constructor(private canvas: HTMLCanvasElement, private manifest: FrameManifest, mobile: boolean) {
    this.ctx = canvas.getContext('2d')!;
    this.frames = new Array(manifest.count).fill(null);
    this.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    this.resize();
    this.preload();
  }

  /** Carrega primeiro um quadro a cada 8, depois preenche o resto (a cena já funciona cedo). */
  private preload() {
    const order: number[] = [];
    for (const step of [8, 4, 2, 1]) {
      for (let i = 0; i < this.manifest.count; i += step) if (!order.includes(i)) order.push(i);
    }
    let cursor = 0;
    const next = () => {
      if (cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.src = this.manifest.pattern.replace('%04d', String(i + 1).padStart(4, '0'));
      img.onload = () => {
        this.frames[i] = img;
        if (this.current < 0) this.draw(true);
        next();
      };
      img.onerror = next;
    };
    for (let k = 0; k < 4; k++) next();
  }

  setProgress(p: number) {
    this.target = clamp01(p) * (this.manifest.count - 1);
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => this.draw(false));
  }

  private draw(force: boolean) {
    let i = Math.round(this.target);
    // Usa o quadro carregado mais próximo enquanto os demais chegam
    for (let d = 0; d < this.frames.length && !this.frames[i]; d++) {
      if (this.frames[i - d]) i = i - d;
      else if (this.frames[i + d]) i = i + d;
    }
    const img = this.frames[i];
    if (!img || (!force && i === this.current)) return;
    this.current = i;
    const { width: cw, height: ch } = this.canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  resize() {
    this.canvas.width = Math.round(this.canvas.clientWidth * this.dpr);
    this.canvas.height = Math.round(this.canvas.clientHeight * this.dpr);
    this.draw(true);
  }

  setVisible() {}

  dispose() {
    cancelAnimationFrame(this.raf);
  }
}

/* ======================================================================= versão por código */

const bgVertex = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

const bgFragment = /* glsl */ `
uniform float uLevel;   // altura da superfície do líquido na tela (0 = embaixo, 1 = em cima)
uniform float uTime;
uniform float uImpact;  // intensidade da ondulação do impacto
uniform float uDepth;   // 0 = superfície, 1 = fundo
uniform float uAspect;
varying vec2 vUv;

float wave(float x) {
  float cx = (x - 0.5) * uAspect;
  float base = sin(cx * 7.0 + uTime * 1.8) * 0.006 + sin(cx * 17.0 - uTime * 2.6) * 0.003;
  float ring = sin(abs(cx) * 26.0 - uTime * 14.0) * exp(-abs(cx) * 2.6) * 0.03 * uImpact;
  return base + ring;
}

void main() {
  vec2 uv = vUv;
  float level = uLevel + wave(uv.x);
  float below = 1.0 - smoothstep(level - 0.002, level + 0.002, uv.y);

  // Ar: escuro com um brilho quente vindo do líquido
  vec3 air = mix(vec3(0.03, 0.025, 0.028), vec3(0.16, 0.06, 0.02), exp(-max(uv.y - level, 0.0) * 5.0) * 0.8);

  // Líquido: dourado perto da superfície, laranja e vinho no fundo
  float d = clamp(level - uv.y, 0.0, 1.0);
  vec3 top = vec3(1.0, 0.72, 0.16);
  vec3 mid = vec3(1.0, 0.33, 0.08);
  vec3 deep = vec3(0.24, 0.05, 0.02);
  vec3 liquid = mix(top, mid, smoothstep(0.0, 0.35, d + uDepth * 0.25));
  liquid = mix(liquid, deep, smoothstep(0.25, 1.1, d + uDepth * 0.45));
  // Raios de luz entrando pela superfície
  float cx = (uv.x - 0.5) * uAspect;
  float rays = sin(cx * 9.0 + uv.y * 3.0 + uTime * 0.5) * sin(cx * 13.0 - uv.y * 2.0 - uTime * 0.35);
  liquid += vec3(1.0, 0.6, 0.2) * max(rays, 0.0) * 0.12 * (1.0 - smoothstep(0.0, 0.7, d));
  // Vinheta
  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(uAspect, 1.0)));
  vec3 col = mix(air, liquid, below) * mix(0.55, 1.0, vig);
  // Linha brilhante da superfície
  col += vec3(1.0, 0.85, 0.55) * exp(-pow((uv.y - level) * 220.0, 2.0)) * 0.9;
  gl_FragColor = vec4(col, 1.0);
}
`;

const dropVertex = /* glsl */ `
attribute vec3 aSeed;
uniform float uPhase;   // 0 a 1 depois do impacto (determinístico: funciona nos dois sentidos)
uniform float uScale;
uniform float uSurface; // altura da superfície no mundo
varying float vA;
void main() {
  float q = uPhase;
  float ang = aSeed.x * 6.2831;
  float sp = 1.2 + aSeed.y * 2.4;
  vec3 p = vec3(cos(ang) * sp * q * 0.9, uSurface + sp * 1.4 * q - 4.9 * q * q, sin(ang) * sp * q * 0.6 + 0.4);
  vA = (1.0 - q) * step(0.001, q) * step(uSurface - 0.05, p.y);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (3.0 + aSeed.z * 6.0) * uScale / -mv.z;
}
`;

const bubbleVertex = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime;
uniform float uScale;
uniform float uSurface;
uniform float uAmount;
varying float vA;
void main() {
  float h = fract(aSeed.y + uTime * (0.05 + aSeed.z * 0.08));
  vec3 p = vec3((aSeed.x - 0.5) * 7.0 + sin(uTime * 2.0 + aSeed.z * 30.0) * 0.08, mix(-4.5, 4.5, h), -0.8 - aSeed.z * 2.0);
  vA = uAmount * 0.8 * step(p.y, uSurface - 0.35) * smoothstep(0.0, 0.15, h) * (1.0 - smoothstep(0.85, 1.0, h));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.0 + aSeed.z * aSeed.z * 9.0) * uScale / -mv.z;
}
`;

const pointFragment = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c) * 2.0;
  float ring = smoothstep(1.0, 0.75, r) * (0.35 + smoothstep(0.55, 0.9, r));
  float a = ring * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor * a, a);
}
`;

export class LiveDive implements ProductScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(30, 1, 0.1, 50);
  private bgScene = new Scene();
  private bgCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private bg: ShaderMaterial;
  private can: Group;
  private drops: Points;
  private bubbles: Points;
  private progress = 0;
  private smooth = 0;
  private time = 0;
  private running = false;
  private raf = 0;
  private last = 0;
  private visible = false;

  constructor(private canvas: HTMLCanvasElement, flavor: Flavor, private mobile: boolean, private reduced: boolean) {
    this.renderer = new WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
    this.renderer.autoClear = false;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    const pmrem = new PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const key = new DirectionalLight('#FFD9A8', 1.6);
    key.position.set(-2, 3, 4);
    const rim = new DirectionalLight('#FF6A2A', 2.2);
    rim.position.set(3, -1, -2);
    this.scene.add(key, rim);

    this.bg = new ShaderMaterial({
      vertexShader: bgVertex,
      fragmentShader: bgFragment,
      depthWrite: false,
      uniforms: { uLevel: { value: 0 }, uTime: { value: 0 }, uImpact: { value: 0 }, uDepth: { value: 0 }, uAspect: { value: 1 } },
    });
    this.bgScene.add(new Mesh(new PlaneGeometry(2, 2), this.bg));

    this.can = buildCan(flavor, this.renderer.capabilities.getMaxAnisotropy());
    this.scene.add(this.can);

    const seeds = (n: number) => {
      const a = new Float32Array(n * 3);
      for (let i = 0; i < a.length; i++) a[i] = Math.random();
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3));
      g.setAttribute('aSeed', new BufferAttribute(a, 3));
      return g;
    };
    const pointMat = (vertex: string, color: string, extra: Record<string, { value: unknown }>) =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uScale: { value: 1 }, uSurface: { value: 0 }, uColor: { value: new Color(color) }, ...extra },
      });
    this.drops = new Points(seeds(mobile ? 90 : 180), pointMat(dropVertex, '#FFE0A6', { uPhase: { value: 0 } }));
    this.bubbles = new Points(seeds(mobile ? 110 : 220), pointMat(bubbleVertex, '#FFF1D6', { uTime: { value: 0 }, uAmount: { value: 0 } }));
    for (const p of [this.drops, this.bubbles]) {
      p.frustumCulled = false;
      this.scene.add(p);
    }
    this.resize();
  }

  setProgress(p: number) {
    this.progress = clamp01(p);
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.start();
    else this.stop();
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.4 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Em telas estreitas a câmera se afasta para a lata caber
    this.camera.position.set(0, 0, w / h < 0.8 ? 11 : 7.5);
    this.camera.updateProjectionMatrix();
    this.bg.uniforms.uAspect.value = w / h;
    const scale = (h / 900) * dpr * 16;
    (this.drops.material as ShaderMaterial).uniforms.uScale.value = scale;
    (this.bubbles.material as ShaderMaterial).uniforms.uScale.value = scale;
  }

  start() {
    if (this.running || !this.visible) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.render(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Quadro com tempo fixo (capturas). */
  renderAt(p: number, time: number) {
    this.progress = this.smooth = p;
    this.time = time;
    this.render(0);
  }

  dispose() {
    this.stop();
    this.renderer.dispose();
  }

  private render(dt: number) {
    if (!this.reduced) this.time += dt;
    this.smooth += (this.progress - this.smooth) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 7));
    const p = this.smooth;
    const t = this.time;

    // Linha do tempo: cai (0–0,34), impacto (0,34), mergulho (0,34–0,7), sobe e se apresenta (0,7–1)
    const impact = 0.34;
    const fall = band(p, 0, impact);
    const dive = band(p, impact, 0.7);
    const show = band(p, 0.72, 1);

    // Superfície do líquido no mundo: sobe até a lata e depois passa por cima da câmera
    const surface = p < impact ? lerp(-3.4, -0.35, fall) : lerp(-0.35, 4.2, dive);
    const canY = p < impact ? lerp(2.4, -0.35, fall) : lerp(-0.35, 0.05, dive) + Math.sin(t * 1.4) * 0.06 * dive;
    this.can.position.set(lerp(0.0, 0.0, show), canY, 0);
    this.can.rotation.set(
      lerp(0.55, 0.0, band(p, 0.2, 0.75)) + Math.sin(t * 0.8) * 0.04,
      lerp(-1.6, 0.0, band(p, 0.0, 0.9)) + (1 - show) * Math.sin(t * 0.5) * 0.15,
      lerp(-0.42, 0.0, band(p, 0.15, 0.8)),
    );
    const sc = lerp(1, 1.12, show);
    this.can.scale.setScalar(sc);

    // Altura da superfície na tela para o fundo
    const s = new Vector3(0, surface, 0).project(this.camera);
    this.bg.uniforms.uLevel.value = s.y * 0.5 + 0.5;
    this.bg.uniforms.uTime.value = t;
    this.bg.uniforms.uImpact.value = p > impact ? Math.exp(-(p - impact) * 18) : 0;
    this.bg.uniforms.uDepth.value = dive;

    const q = p > impact ? clamp01((p - impact) / 0.14) : 0;
    const drops = (this.drops.material as ShaderMaterial).uniforms;
    drops.uPhase.value = q;
    drops.uSurface.value = surface;
    const bub = (this.bubbles.material as ShaderMaterial).uniforms;
    bub.uTime.value = t;
    bub.uSurface.value = surface;
    bub.uAmount.value = band(p, impact - 0.02, impact + 0.1) * (1 - show * 0.5);

    this.renderer.clear();
    this.renderer.render(this.bgScene, this.bgCam);
    this.renderer.render(this.scene, this.camera);
  }
}

/** Gera imagens das latas de cada sabor (uma vez, ao carregar) para o seletor de sabores. */
export function renderCanSnapshots(flavors: Flavor[], width: number, height: number): Promise<Record<string, string>> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const key = new DirectionalLight('#ffffff', 1.4);
  key.position.set(-2, 3, 4);
  const rim = new DirectionalLight('#FF8A4A', 1.6);
  rim.position.set(3, 1, -2);
  scene.add(key, rim);
  const camera = new PerspectiveCamera(24, width / height, 0.1, 50);
  camera.position.set(0, 0.25, 6.6);
  camera.lookAt(0, 0.05, 0);

  const out: Record<string, string> = {};
  for (const flavor of flavors) {
    const can = buildCan(flavor, renderer.capabilities.getMaxAnisotropy());
    can.rotation.set(0.04, -0.22, -0.05);
    scene.add(can);
    renderer.clear();
    renderer.render(scene, camera);
    out[flavor.id] = canvas.toDataURL('image/webp', 0.9);
    scene.remove(can);
  }
  renderer.dispose();
  renderer.forceContextLoss();
  return Promise.resolve(out);
}
