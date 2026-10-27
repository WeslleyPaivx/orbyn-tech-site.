import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
  type IUniform,
} from 'three';
import { fieldFragment, fieldVertex } from './zanivaShaders';
import type { Quality } from './support';

export type { Quality };

type QualitySpec = {
  particles: number;
  dprMax: number;
  size: number;
  /** Teto do ponto em pixels CSS. Sem isto a frente da nuvem vira mancha. */
  maxSize: number;
  /** Opacidade máxima do campo. A nuvem é fundo; o texto vem na frente. */
  peak: number;
};

/**
 * Orçamento de densidade. O STORM pede 50 mil pontos; isso é peso de demonstração.
 * Aqui o teto é metade disso no desktop forte e um décimo no celular, porque a
 * cena é enfeite — a parte comercial do site não depende dela.
 */
export const QUALITY: Record<Quality, QualitySpec> = {
  high: { particles: 24000, dprMax: 1.75, size: 30, maxSize: 7, peak: 0.5 },
  medium: { particles: 11000, dprMax: 1.5, size: 32, maxSize: 8, peak: 0.46 },
  // Celular: ponto menor, não maior. Aumentar o tamanho para compensar a
  // densidade menor foi exatamente o erro que encheu a tela de bolhas.
  low: { particles: 4500, dprMax: 1.25, size: 30, maxSize: 8, peak: 0.4 },
};

/** Paleta amostrada da paisagem Pink Grass. */
const CORE = '#2A1D3F';
const MID = '#D06AB7';
const RIM = '#F0EFFD';
const BACKGROUND = 0x120f25;

export type FieldOptions = {
  quality: Quality;
  reducedMotion: boolean;
  onFirstFrame: () => void;
  onContextLost: () => void;
};

/** Nuvem de partículas que responde à rolagem e ao cursor. */
export class ZanivaField {
  private canvas: HTMLCanvasElement;
  private options: FieldOptions;
  private spec: QualitySpec;

  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private group = new Group();
  private points: Points;
  private uniforms: Record<string, IUniform>;

  private dpr = 1;
  private running = false;
  private frame = 0;
  private firstFrameSent = false;
  private clockStart = 0;

  // Alvos e valores correntes: tudo é interpolado para que a rolagem não
  // produza saltos quando o navegador entrega eventos irregulares.
  private progressTarget = 0;
  private progress = 0;
  private fadeTarget = 1;
  private fade = 1;
  private phase = 0;

  private pointerTarget = new Vector3();
  private pointer = new Vector3();
  private activityTarget = 0;
  private activity = 0;
  private lastPointerMove = 0;

  constructor(canvas: HTMLCanvasElement, options: FieldOptions) {
    this.canvas = canvas;
    this.options = options;
    this.spec = QUALITY[options.quality];

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false, // os sprites já são suaves; MSAA aqui só custa
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
    });
    this.renderer.setClearColor(BACKGROUND, 1);

    canvas.addEventListener('webglcontextlost', this.onContextLost, false);

    this.camera = new PerspectiveCamera(45, 1, 0.1, 80);
    this.camera.position.set(0, 0, 7);

    this.uniforms = {
      uTime: { value: 0 },
      uSize: { value: this.spec.size },
      uMaxSize: { value: this.spec.maxSize },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
      uBright: { value: 1 },
      uGrow: { value: 0 },
      uSwirl: { value: 0 },
      uCursor: { value: new Vector3(0, 0, 999) },
      uRepelRadius: { value: 1.5 },
      uRepelStrength: { value: 0.9 },
      uActivity: { value: 0 },
      uCore: { value: new Color(CORE) },
      uMid: { value: new Color(MID) },
      uRim: { value: new Color(RIM) },
    };

    this.points = new Points(
      buildFieldGeometry(this.spec.particles),
      new ShaderMaterial({
        vertexShader: fieldVertex,
        fragmentShader: fieldFragment,
        uniforms: this.uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
      }),
    );
    this.points.frustumCulled = false;

    this.group.add(this.points);
    this.scene.add(this.group);

    this.resize();
  }

  // --- controles usados pelo startScene -----------------------------------

  /** Progresso acumulado da rolagem; conduz mergulho, crescimento e giro. */
  setTarget(progress: number) {
    this.progressTarget = progress;
  }

  /** Variação fina dentro de uma seção. */
  setPhase(phase: number) {
    this.phase = phase;
  }

  /** Recolhe a cena onde ela não deve disputar atenção (formulário, por exemplo). */
  setFade(fade: number) {
    this.fadeTarget = Math.max(0, Math.min(1, fade));
  }

  /** Coordenadas normalizadas (-1..1). */
  setPointer(x: number, y: number) {
    this.pointerTarget.set(x * 3.2, y * 2.0, 1.2);
    this.lastPointerMove = performance.now();
    this.activityTarget = 1;
  }

  /** Começa já na composição certa (link com âncora, recarregamento no meio). */
  jumpTo(progress: number) {
    this.progressTarget = progress;
    this.progress = progress;
  }

  start() {
    if (this.running) return;
    this.running = true;
    if (!this.clockStart) this.clockStart = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.spec.dprMax);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.uniforms.uPixelRatio.value = this.dpr;
  }

  dispose() {
    this.stop();
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.points.geometry.dispose();
    (this.points.material as ShaderMaterial).dispose();
    this.renderer.dispose();
  }

  // --- laço ---------------------------------------------------------------

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.stop();
    this.options.onContextLost();
  };

  private tick = () => {
    if (!this.running) return;
    this.frame = requestAnimationFrame(this.tick);

    const now = performance.now();
    const time = (now - this.clockStart) / 1000;
    const reduced = this.options.reducedMotion;

    // Interpolações. Com movimento reduzido a cena ainda acompanha a rolagem,
    // que é movimento iniciado pela própria pessoa; só a deriva automática e a
    // reação ao ponteiro ficam paradas.
    this.progress += (this.progressTarget - this.progress) * 0.075;
    this.fade += (this.fadeTarget - this.fade) * 0.08;

    if (reduced) {
      this.activity = 0;
    } else {
      const idle = (now - this.lastPointerMove) / 1000;
      if (idle > 2.5) this.activityTarget = 0;
      this.activity += (this.activityTarget - this.activity) * 0.05;
      this.pointer.lerp(this.pointerTarget, 0.1);
    }

    const p = this.progress;

    this.uniforms.uTime.value = reduced ? 0 : time;
    // Crescimento e mergulho contidos: o que empurrava a nuvem para cima do
    // leitor era a combinação dos dois no fim da rolagem.
    this.uniforms.uGrow.value = p * 0.16;
    this.uniforms.uSwirl.value = p * 0.85;
    this.uniforms.uActivity.value = this.activity;
    (this.uniforms.uCursor.value as Vector3).copy(this.pointer);

    // A nuvem aparece conforme a paisagem do hero sai de cena. O teto por
    // nível de aparelho mantém ela como FUNDO: o texto é que tem de ganhar.
    const emerge = Math.min(1, Math.max(0, p * 1.6));
    this.uniforms.uOpacity.value = emerge * this.fade * this.spec.peak;
    this.uniforms.uBright.value = 0.92 + this.phase * 0.22;

    // Mergulho da câmera
    this.camera.position.z = 7 - p * 1.1;
    if (!reduced) {
      this.camera.position.x = this.pointer.x * 0.12;
      this.camera.position.y = this.pointer.y * 0.1;
    }
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);

    if (!this.firstFrameSent) {
      this.firstFrameSent = true;
      this.options.onFirstFrame();
    }
  };
}

/**
 * Nuvem esférica com viés para a casca. A distribuição de Marsaglia dá pontos
 * uniformes na esfera sem o acúmulo nos polos que o sorteio ingênuo de ângulos
 * produz; o expoente em rN empurra a maioria para fora, deixando o núcleo
 * escuro e a borda acesa.
 */
function buildFieldGeometry(count: number): BufferGeometry {
  const radius = 2.5;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const noises = new Float32Array(count);
  const radialPush = new Float32Array(count);
  const mix = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    let u = 0;
    let v = 0;
    let s = 0;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);

    const factor = 2 * Math.sqrt(1 - s);
    const dx = u * factor;
    const dy = v * factor;
    const dz = 1 - 2 * s;

    const rN = Math.pow(Math.random(), 0.4);
    const r = radius * (0.55 + rN * 0.45);

    positions[i3] = dx * r;
    positions[i3 + 1] = dy * r;
    positions[i3 + 2] = dz * r;

    mix[i] = rN;
    scales[i] = 0.45 + Math.random() * 0.8;
    noises[i] = Math.random();
    radialPush[i] = 0.4 + rN * 1.1;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
  geometry.setAttribute('aNoise', new BufferAttribute(noises, 1));
  geometry.setAttribute('aRadialPush', new BufferAttribute(radialPush, 1));
  geometry.setAttribute('aMix', new BufferAttribute(mix, 1));
  return geometry;
}
