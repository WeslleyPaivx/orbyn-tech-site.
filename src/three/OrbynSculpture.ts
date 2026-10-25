import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  DoubleSide,
  FloatType,
  Group,
  Mesh,
  NearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  type IUniform,
} from 'three';
import { LOGO_CONTOURS } from './logoCurves';
import {
  STAGE_COUNT,
  filamentFragment,
  filamentVertex,
  particleFragment,
  particleVertex,
  solidFragment,
  solidVertex,
} from './shaders';

import type { Quality } from './support';

export type { Quality };

type QualitySpec = {
  filaments: number;
  segments: number;
  particles: number;
  meshU: number;
  meshV: number;
  dprMax: number;
  antialias: boolean;
};

export const QUALITY: Record<Quality, QualitySpec> = {
  high: { filaments: 380, segments: 200, particles: 3000, meshU: 320, meshV: 72, dprMax: 1.75, antialias: true },
  medium: { filaments: 220, segments: 120, particles: 1400, meshU: 200, meshV: 48, dprMax: 1.5, antialias: true },
  // Celulares: sem antisserrilhado da GPU (as fitas já suavizam a borda no shader) e menos vértices
  low: { filaments: 150, segments: 90, particles: 700, meshU: 150, meshV: 36, dprMax: 1.25, antialias: false },
};

/** Enquadramento de cada composição: posição e escala do objeto, câmera e intensidade. */
type StagePreset = {
  pos: [number, number, number];
  scale: number;
  cam: [number, number, number];
  look: [number, number, number];
  bright: number;
};

const DESKTOP: StagePreset[] = [
  { pos: [1.75, -0.05, 0], scale: 0.9, cam: [0, 0.1, 7.4], look: [0, 0, 0], bright: 1 },
  { pos: [0.6, -0.25, 0], scale: 0.92, cam: [0, 0.25, 8.0], look: [0, 0, 0], bright: 0.55 },
  { pos: [2.55, -0.1, 0], scale: 0.86, cam: [0, -0.4, 8.6], look: [0, 0, 0], bright: 0.6 },
  { pos: [0, -0.55, 0], scale: 1, cam: [0, 1.0, 7.6], look: [0, -0.3, 0], bright: 0.5 },
  { pos: [0, 0.78, 0], scale: 0.66, cam: [0, 0, 7.2], look: [0, 0, 0], bright: 1 },
];

const MOBILE: StagePreset[] = [
  { pos: [0, 1.5, 0], scale: 0.58, cam: [0, 0, 8.4], look: [0, 0, 0], bright: 1 },
  { pos: [0, 0.2, 0], scale: 0.62, cam: [0, 0.2, 8.6], look: [0, 0, 0], bright: 0.45 },
  { pos: [0, 0.3, 0], scale: 0.72, cam: [0, -0.4, 9.2], look: [0, 0, 0], bright: 0.45 },
  { pos: [0, -0.6, 0], scale: 0.8, cam: [0, 1.0, 7.8], look: [0, -0.3, 0], bright: 0.42 },
  { pos: [0, 1.05, 0], scale: 0.66, cam: [0, 0, 8.4], look: [0, 0, 0], bright: 1 },
];

export type SculptureOptions = {
  quality: Quality;
  reducedMotion?: boolean;
  /** Tempo fixo (segundos) para capturas determinísticas no laboratório. */
  fixedTime?: number;
  onFirstFrame?: () => void;
  onContextLost?: () => void;
};

const LOGO_SAMPLES = 256;
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Escultura digital da ORBYN TECH.
 * Uma única instância desenha a escultura sólida, os filamentos e as partículas
 * em um canvas fixo atrás da página. O progresso (0 a 4) vem da rolagem.
 */
export class OrbynSculpture {
  readonly canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(35, 1, 0.1, 60);
  private root = new Group();
  private solid: Mesh;
  private filaments: Mesh;
  private particles: Points;
  private logoTexture: DataTexture;
  private uniforms: Record<string, IUniform>;
  private spec: QualitySpec;
  private options: SculptureOptions;

  private target = 0;
  private progress = 0;
  private phaseTarget = 0;
  private phase = 0;
  private fadeTarget = 1;
  private fade = 1;
  private pointer = new Vector2();
  private pointerSmooth = new Vector2();
  private mobile = false;
  private dpr = 1;
  private running = false;
  private frameId = 0;
  private lastTime = 0;
  private elapsed = 0;
  private firstFrameDone = false;
  private perfSamples: number[] = [];
  private warmupFrames = 30;
  private activeFraction = 1;
  /** Último recurso em aparelhos lentos: desenha um quadro sim, outro não (30 fps estáveis). */
  private halfRate = false;
  private skipNext = false;
  private pendingDt = 0;
  private disposed = false;
  private camPos = new Vector3();
  private camLook = new Vector3();

  constructor(canvas: HTMLCanvasElement, options: SculptureOptions) {
    this.canvas = canvas;
    this.options = options;
    this.spec = QUALITY[options.quality];

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: this.spec.antialias,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setClearColor(0x050505, 1);

    canvas.addEventListener('webglcontextlost', this.onContextLost, false);

    const { filaments, segments, particles, meshU, meshV } = this.spec;

    this.logoTexture = buildLogoTexture(filaments);

    this.uniforms = {
      uTime: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uLocal: { value: 0 },
      uPhase: { value: 0 },
      uCount: { value: filaments },
      uActive: { value: filaments },
      uLogo: { value: this.logoTexture },
      uLogoSamples: { value: LOGO_SAMPLES },
      uResolution: { value: new Vector2(1, 1) },
      uWidth: { value: 1.4 },
      uSegments: { value: segments },
      uBright: { value: 1 },
      uDissolve: { value: -0.2 },
      uPixelRatio: { value: 1 },
      uSizeScale: { value: 1 },
    };

    // Escultura sólida
    const solidGeometry = new PlaneGeometry(1, 1, meshU, meshV);
    this.solid = new Mesh(
      solidGeometry,
      new ShaderMaterial({
        vertexShader: solidVertex,
        fragmentShader: solidFragment,
        uniforms: this.uniforms,
        side: DoubleSide,
      }),
    );
    this.solid.frustumCulled = false;
    this.solid.renderOrder = 0;

    // Filamentos
    this.filaments = new Mesh(
      buildFilamentGeometry(filaments, segments),
      new ShaderMaterial({
        vertexShader: filamentVertex,
        fragmentShader: filamentFragment,
        uniforms: this.uniforms,
        side: DoubleSide,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.filaments.frustumCulled = false;
    this.filaments.renderOrder = 1;

    // Partículas
    this.particles = new Points(
      buildParticleGeometry(particles, filaments),
      new ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: this.uniforms,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.particles.frustumCulled = false;
    this.particles.renderOrder = 2;

    this.root.add(this.solid, this.filaments, this.particles);
    this.scene.add(this.root);

    this.resize();
    this.applyFraction();
  }

  /* -------------------------------------------------------------- controle externo */

  /** Progresso da rolagem, de 0 (escultura) a 4 (símbolo). */
  setTarget(value: number) {
    this.target = Math.min(Math.max(value, 0), STAGE_COUNT - 1);
  }

  /** Posiciona imediatamente (sem amortecimento): carregamento no meio da página e testes. */
  jumpTo(value: number) {
    this.setTarget(value);
    this.progress = this.target;
  }

  /** Fase secundária (avanço dentro da seção de serviços). */
  setPhase(value: number) {
    this.phaseTarget = value;
  }

  /** Intensidade geral (1 = normal). Usada para recolher a cena atrás do formulário. */
  setFade(value: number) {
    this.fadeTarget = Math.min(Math.max(value, 0), 1);
  }

  /** Ponteiro normalizado de -1 a 1. */
  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.mobile = width < 768;
    const desired = Math.min(window.devicePixelRatio || 1, this.spec.dprMax);
    this.dpr = this.dprCap ? Math.min(desired, this.dprCap) : desired;
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Em telas estreitas, abre o campo de visão para a forma caber
    this.camera.fov = width / height < 0.8 ? 46 : 35;
    this.camera.updateProjectionMatrix();
    const size = this.renderer.getDrawingBufferSize(new Vector2());
    (this.uniforms.uResolution.value as Vector2).copy(size);
    this.uniforms.uPixelRatio.value = this.dpr;
    this.uniforms.uSizeScale.value = (height / 900) * 13;
    this.uniforms.uWidth.value = (this.mobile ? 1.15 : 1.35) * this.dpr;
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  /** Desenha um único quadro (movimento reduzido e capturas). */
  renderOnce() {
    this.update(0);
    this.renderer.render(this.scene, this.camera);
    this.notifyFirstFrame();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost, false);
    this.solid.geometry.dispose();
    (this.solid.material as ShaderMaterial).dispose();
    this.filaments.geometry.dispose();
    (this.filaments.material as ShaderMaterial).dispose();
    this.particles.geometry.dispose();
    (this.particles.material as ShaderMaterial).dispose();
    this.logoTexture.dispose();
    this.renderer.dispose();
  }

  /* -------------------------------------------------------------- quadro a quadro */

  private dprCap = 0;

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.frameId = requestAnimationFrame(this.tick);
    if (this.halfRate) {
      this.pendingDt += dt;
      this.skipNext = !this.skipNext;
      if (this.skipNext) return;
    }
    const step = this.halfRate ? Math.min(this.pendingDt, 0.1) : dt;
    this.pendingDt = 0;
    this.update(step);
    this.renderer.render(this.scene, this.camera);
    this.notifyFirstFrame();
    this.monitor(step);
  };

  private update(dt: number) {
    const reduced = Boolean(this.options.reducedMotion);
    if (this.options.fixedTime !== undefined) this.elapsed = this.options.fixedTime;
    else if (!reduced) this.elapsed += dt;

    // Amortecimento: a forma acompanha a rolagem com inércia, nos dois sentidos
    const k = reduced ? 1 : 1 - Math.exp(-dt * 3.2);
    this.progress += (this.target - this.progress) * (dt === 0 ? 1 : k);
    this.phase += (this.phaseTarget - this.phase) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 2.5));
    this.fade += (this.fadeTarget - this.fade) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 3));
    this.pointerSmooth.lerp(this.pointer, reduced ? 0 : dt === 0 ? 1 : 1 - Math.exp(-dt * 2.0));

    const p = Math.min(Math.max(this.progress, 0), STAGE_COUNT - 1);
    let from = Math.floor(p);
    let local = p - from;
    if (from >= STAGE_COUNT - 1) {
      from = STAGE_COUNT - 1;
      local = 0;
    }
    if (local < 1e-4) local = 0;
    const to = local > 0 ? from + 1 : from;

    const u = this.uniforms;
    u.uTime.value = this.elapsed;
    u.uFrom.value = from;
    u.uTo.value = to;
    u.uLocal.value = local;
    u.uPhase.value = this.phase;

    // Escultura sólida: dissolve no início da primeira transição
    const dissolve = from === 0 ? smooth(Math.min(local / 0.55, 1)) : 1;
    u.uDissolve.value = lerp(-0.2, 1.15, dissolve);
    this.solid.visible = from === 0 && dissolve < 0.999;

    // Enquadramento interpolado entre as composições
    const presets = this.mobile ? MOBILE : DESKTOP;
    const a = presets[from];
    const b = presets[to];
    const s = smooth(local);
    const root = this.root;
    root.position.set(lerp(a.pos[0], b.pos[0], s), lerp(a.pos[1], b.pos[1], s), lerp(a.pos[2], b.pos[2], s));
    root.scale.setScalar(lerp(a.scale, b.scale, s));
    const drift = reduced ? 0 : this.elapsed;
    root.rotation.set(
      this.pointerSmooth.y * 0.12,
      this.pointerSmooth.x * 0.22 + Math.sin(drift * 0.11) * 0.08,
      0,
    );
    // A escultura gira lentamente sobre si mesma enquanto está inteira
    if (from === 0) root.rotation.y += Math.sin(drift * 0.16) * 0.35 * (1 - s);

    this.camPos.set(lerp(a.cam[0], b.cam[0], s), lerp(a.cam[1], b.cam[1], s), lerp(a.cam[2], b.cam[2], s));
    this.camPos.x += Math.sin(drift * 0.07) * 0.25 + this.pointerSmooth.x * 0.3;
    this.camPos.y += Math.cos(drift * 0.09) * 0.12 + this.pointerSmooth.y * 0.18;
    this.camLook.set(lerp(a.look[0], b.look[0], s), lerp(a.look[1], b.look[1], s), lerp(a.look[2], b.look[2], s));
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);

    u.uBright.value = lerp(a.bright, b.bright, s) * this.fade;
  }

  /**
   * Qualidade adaptativa. A cada 40 quadros, se o quadro típico passar de 20 ms (abaixo de 50 fps),
   * reduz um degrau: primeiro a resolução, depois a quantidade de fios e, por fim, a taxa de quadros.
   */
  private monitor(dt: number) {
    if (dt <= 0) return;
    if (this.warmupFrames > 0) {
      this.warmupFrames--;
      return;
    }
    this.perfSamples.push(dt);
    if (this.perfSamples.length < 40) return;
    const sorted = [...this.perfSamples].sort((x, y) => x - y);
    const median = sorted[Math.floor(sorted.length / 2)];
    this.perfSamples = [];
    const budget = this.halfRate ? 1 / 26 : 1 / 50;
    if (median <= budget) return;
    if (this.dpr > 0.8) {
      this.dprCap = Math.max(0.75, this.dpr - 0.2);
      this.resize();
    } else if (this.activeFraction > 0.5) {
      this.activeFraction = Math.max(0.4, this.activeFraction - 0.2);
      this.applyFraction();
    } else if (!this.halfRate) {
      this.halfRate = true;
    }
    this.warmupFrames = 10;
  }

  private applyFraction() {
    const { filaments, segments, particles } = this.spec;
    const active = Math.max(24, Math.round(filaments * this.activeFraction));
    this.uniforms.uActive.value = active;
    this.filaments.geometry.setDrawRange(0, active * segments * 6);
    this.particles.geometry.setDrawRange(0, Math.round(particles * this.activeFraction));
  }

  private notifyFirstFrame() {
    if (this.firstFrameDone) return;
    this.firstFrameDone = true;
    this.options.onFirstFrame?.();
  }

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.stop();
    this.options.onContextLost?.();
  };
}

/* ------------------------------------------------------------------ geometrias */

/** Cada filamento é uma fita: dois vértices por ponto (lado -1 e +1). position = (t, lado, índice). */
function buildFilamentGeometry(count: number, segments: number): BufferGeometry {
  const perFil = (segments + 1) * 2;
  const positions = new Float32Array(count * perFil * 3);
  const indices = new Uint32Array(count * segments * 6);
  let p = 0;
  let q = 0;
  for (let f = 0; f < count; f++) {
    const base = f * perFil;
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      positions[p++] = t;
      positions[p++] = -1;
      positions[p++] = f;
      positions[p++] = t;
      positions[p++] = 1;
      positions[p++] = f;
      if (j < segments) {
        const a = base + j * 2;
        indices[q++] = a;
        indices[q++] = a + 1;
        indices[q++] = a + 2;
        indices[q++] = a + 1;
        indices[q++] = a + 3;
        indices[q++] = a + 2;
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setIndex(new BufferAttribute(indices, 1));
  return geometry;
}

/** Partículas: position = (filamento, fase inicial, velocidade). */
function buildParticleGeometry(count: number, filaments: number): BufferGeometry {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.floor(rand() * filaments * 997);
    positions[i * 3 + 1] = rand();
    positions[i * 3 + 2] = (0.012 + rand() * 0.03) * (rand() < 0.5 ? 1 : -1);
    const big = rand() < 0.06;
    sizes[i] = big ? 9 + rand() * 7 : 3 + rand() * 4;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new BufferAttribute(sizes, 1));
  return geometry;
}

/**
 * Textura com o caminho de cada filamento na composição final (símbolo da marca).
 * Os filamentos são distribuídos pelos contornos proporcionalmente ao comprimento,
 * com pequenos deslocamentos laterais e em profundidade para dar volume ao traço.
 */
function buildLogoTexture(count: number): DataTexture {
  const contours = LOGO_CONTOURS.map((c) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < c.points.length; i += 2) pts.push([c.points[i], c.points[i + 1]]);
    return { length: c.length, pts };
  });
  const total = contours.reduce((sum, c) => sum + c.length, 0);
  const cumulative: number[] = [];
  let acc = 0;
  for (const c of contours) {
    acc += c.length / total;
    cumulative.push(acc);
  }

  const data = new Float32Array(LOGO_SAMPLES * count * 4);
  for (let fi = 0; fi < count; fi++) {
    // Mesma sequência de baixa discrepância usada no shader
    const f = (((fi + 1) * 0.6180339887) % 1 + 1) % 1;
    let ci = cumulative.findIndex((v) => f <= v);
    if (ci < 0) ci = contours.length - 1;
    const pts = contours[ci].pts;
    const n = pts.length;
    const h1 = fract(Math.sin(fi * 12.9898) * 43758.5453);
    const h2 = fract(Math.sin(fi * 78.233) * 12543.123);
    const h3 = fract(Math.sin(fi * 39.425) * 24634.634);
    const lateral = (h1 - 0.5) * 0.06;
    const depth = (h2 - 0.5) * 0.36;
    const shift = h3 * n;

    for (let s = 0; s < LOGO_SAMPLES; s++) {
      const pos = ((s / LOGO_SAMPLES) * n + shift) % n;
      const i0 = Math.floor(pos);
      const fr = pos - i0;
      const a = pts[i0 % n];
      const b = pts[(i0 + 1) % n];
      const x = a[0] + (b[0] - a[0]) * fr;
      const y = a[1] + (b[1] - a[1]) * fr;
      const prev = pts[(i0 - 1 + n) % n];
      const next = pts[(i0 + 2) % n];
      let tx = next[0] - prev[0];
      let ty = next[1] - prev[1];
      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;
      const o = (fi * LOGO_SAMPLES + s) * 4;
      // Ondulação discreta ao longo do traço, para o volume não parecer um carimbo
      const wave = Math.sin((s / LOGO_SAMPLES) * Math.PI * 2 * 3 + h1 * 6.28) * 0.012;
      data[o] = x - ty * (lateral + wave);
      data[o + 1] = y + tx * (lateral + wave);
      data[o + 2] = depth * (0.7 + 0.3 * Math.sin((s / LOGO_SAMPLES) * Math.PI * 4 + h2 * 6.28));
      data[o + 3] = 1;
    }
  }
  const texture = new DataTexture(data, LOGO_SAMPLES, count, RGBAFormat, FloatType);
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

function fract(x: number) {
  return x - Math.floor(x);
}
