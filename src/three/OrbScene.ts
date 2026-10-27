import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
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

type Spec = { particles: number; dprMax: number; size: number; maxSize: number; peak: number };

/**
 * Orçamento por aparelho. A orbe ocupa uma área delimitada da seção, não a
 * tela inteira, então pode ser mais densa do que o campo global que ela
 * substituiu — mas continua com teto de tamanho e de opacidade.
 */
const QUALITY: Record<Quality, Spec> = {
  high: { particles: 26000, dprMax: 1.75, size: 36, maxSize: 9, peak: 1 },
  medium: { particles: 13000, dprMax: 1.5, size: 38, maxSize: 10, peak: 0.95 },
  low: { particles: 6000, dprMax: 1.25, size: 36, maxSize: 10, peak: 0.85 },
};

/** Paleta do protótipo aprovado. */
const CORE = '#441f58';
const MID = '#e05ac1';
const RIM = '#f7d4ef';

export type OrbOptions = {
  quality: Quality;
  reducedMotion: boolean;
  onFirstFrame?: () => void;
  onFail?: () => void;
};

/**
 * Orbe de partículas do manifesto — o STORM adaptado.
 *
 * Diferenças deliberadas em relação ao documento: sem postprocessing (o brilho
 * sai de blending aditivo com sprite radial, uma ordem de grandeza mais
 * barato), paleta da Zaniva e densidade por aparelho. O documento pede
 * WebGL1Renderer, que não existe mais na Three 0.170 do projeto.
 */
export class OrbScene {
  private canvas: HTMLCanvasElement;
  private options: OrbOptions;
  private spec: Spec;

  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private points: Points;
  private uniforms: Record<string, IUniform>;

  private running = false;
  private frame = 0;
  private sentFirstFrame = false;
  private clockStart = 0;

  private pointerTarget = new Vector3(0, 0, 999);
  private pointer = new Vector3(0, 0, 999);
  private activity = 0;
  private activityTarget = 0;
  private lastMove = 0;

  constructor(canvas: HTMLCanvasElement, options: OrbOptions) {
    this.canvas = canvas;
    this.options = options;
    this.spec = QUALITY[options.quality];

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true, // a seção pinta o fundo; a orbe só soma luz por cima
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
    });
    this.renderer.setClearAlpha(0);

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
      buildOrbGeometry(this.spec.particles),
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
    this.scene.add(this.points);

    this.resize();
  }

  setPointer(x: number, y: number) {
    this.pointerTarget.set(x * 3.2, y * 2, 1.2);
    this.lastMove = performance.now();
    this.activityTarget = 1;
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
    const width = this.canvas.clientWidth || 1;
    const height = this.canvas.clientHeight || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, this.spec.dprMax);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.uniforms.uPixelRatio.value = dpr;
  }

  dispose() {
    this.stop();
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.points.geometry.dispose();
    (this.points.material as ShaderMaterial).dispose();
    this.renderer.dispose();
  }

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.stop();
    this.options.onFail?.();
  };

  private tick = () => {
    if (!this.running) return;
    this.frame = requestAnimationFrame(this.tick);

    const now = performance.now();
    const time = (now - this.clockStart) / 1000;
    const reduced = this.options.reducedMotion;

    if (reduced) {
      this.activity = 0;
    } else {
      if ((now - this.lastMove) / 1000 > 2.5) this.activityTarget = 0;
      this.activity += (this.activityTarget - this.activity) * 0.05;
      this.pointer.lerp(this.pointerTarget, 0.1);
    }

    // Aparição suave na primeira vez que a orbe roda.
    const appear = Math.min(1, time / 1.4);

    this.uniforms.uTime.value = reduced ? 0 : time;
    this.uniforms.uOpacity.value = appear * this.spec.peak;
    this.uniforms.uActivity.value = this.activity;
    (this.uniforms.uCursor.value as Vector3).copy(this.pointer);

    this.renderer.render(this.scene, this.camera);

    if (!this.sentFirstFrame) {
      this.sentFirstFrame = true;
      this.options.onFirstFrame?.();
    }
  };
}

/**
 * Nuvem esférica com viés para a casca. A distribuição de Marsaglia dá pontos
 * uniformes na esfera sem o acúmulo nos polos do sorteio ingênuo de ângulos;
 * o expoente empurra a maioria para fora, deixando o núcleo escuro e a borda
 * acesa — que é o que dá a leitura de orbe em vez de bola sólida.
 */
function buildOrbGeometry(count: number): BufferGeometry {
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
    const rN = Math.pow(Math.random(), 0.4);
    const r = radius * (0.55 + rN * 0.45);

    positions[i3] = u * factor * r;
    positions[i3 + 1] = v * factor * r;
    positions[i3 + 2] = (1 - 2 * s) * r;

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
