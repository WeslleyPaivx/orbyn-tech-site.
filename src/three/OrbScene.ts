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
  high: { particles: 26000, dprMax: 1.75, size: 26, maxSize: 6, peak: 1 },
  medium: { particles: 13000, dprMax: 1.5, size: 28, maxSize: 6.5, peak: 0.95 },
  low: { particles: 6000, dprMax: 1.25, size: 28, maxSize: 7, peak: 0.85 },
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
      // ~26°: a nebulosa é vista de viés, como na montagem, e não de frente.
      uTilt: { value: 0.46 },
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

/** Amostra normal (Box-Muller). Dispersão natural, sem bordas duras. */
function gauss(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const ARMS = 3;
/** Voltas que cada braço dá. Acima de ~0,8 os braços se cruzam e viram anel. */
const TURNS = 0.62;

/**
 * Geometria da nebulosa — TRÊS POPULAÇÕES, não uma casca uniforme.
 *
 * A versão anterior sorteava todos os pontos sobre uma esfera com a mesma
 * estatística. Sem variação de densidade não existe arco, filamento nem
 * silhueta: o olho lê confete. Aqui cada partícula pertence a uma das três
 * populações que compõem a imagem da montagem:
 *
 *   NÚCLEO (0) — concentrado e aceso no centro, em ameixa profunda.
 *   BRAÇO  (1) — espirais logarítmicas que esfiapam para fora. São elas que
 *                desenham os arcos luminosos.
 *   HALO   (2) — poucos pontos, grandes e quase apagados, formando a bruma
 *                que dá atmosfera e profundidade em volta.
 *
 * O `aSpin` cai com o raio: matéria perto do centro gira mais rápido, então os
 * braços se enrolam sozinhos com o tempo em vez de rodarem rígidos.
 */
function buildOrbGeometry(count: number): BufferGeometry {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const noises = new Float32Array(count);
  const radialPush = new Float32Array(count);
  const mix = new Float32Array(count);
  const spin = new Float32Array(count);
  const kind = new Float32Array(count);

  const coreCount = Math.round(count * 0.24);
  const haloCount = Math.round(count * 0.18);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x = 0;
    let y = 0;
    let z = 0;
    let radius = 0;

    if (i < coreCount) {
      // Núcleo: denso no meio, caindo rápido para fora.
      const r = Math.pow(Math.random(), 1.9) * 0.95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.cos(phi) * 0.62;
      z = r * Math.sin(phi) * Math.sin(theta);
      radius = r;

      kind[i] = 0;
      mix[i] = 0.04 + Math.random() * 0.3;
      scales[i] = 0.5 + Math.random() * 0.7;
    } else if (i < coreCount + haloCount) {
      // Halo: bruma larga e esparsa em volta de tudo.
      const r = 1.5 + Math.pow(Math.random(), 0.7) * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.cos(phi) * 0.78;
      z = r * Math.sin(phi) * Math.sin(theta);
      radius = r;

      kind[i] = 2;
      mix[i] = 0.3 + Math.random() * 0.3;
      scales[i] = 0.6 + Math.random() * 0.9;
    } else {
      // Braço: espiral logarítmica que esfiapa conforme se afasta.
      const arm = i % ARMS;
      const t = Math.sqrt(Math.random());
      const r = 0.5 + t * 2.05;

      // A dispersão cresce com o raio: colado na origem, aberto na ponta.
      const spread = 0.05 + t * 0.2;
      const angle = (arm * Math.PI * 2) / ARMS + t * TURNS * Math.PI * 2 + gauss() * spread;
      const rr = r + gauss() * (0.04 + t * 0.18);

      x = Math.cos(angle) * rr;
      z = Math.sin(angle) * rr;
      y = gauss() * (0.07 + t * 0.26);
      radius = rr;

      kind[i] = 1;
      // Mais aceso na parte interna do braço; faíscas raras chegam ao rosa claro.
      const sparkle = Math.random() < 0.07 ? 0.3 : 0;
      mix[i] = Math.min(1, 0.45 + (1 - t) * 0.35 + Math.random() * 0.15 + sparkle);
      scales[i] = 0.4 + Math.random() * 0.75;
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    noises[i] = Math.random();
    radialPush[i] = 0.35 + Math.random() * 0.9;
    // Rotação kepleriana aproximada: cai com o raio, nunca divide por zero.
    spin[i] = 0.5 / (0.75 + radius * 0.85);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
  geometry.setAttribute('aNoise', new BufferAttribute(noises, 1));
  geometry.setAttribute('aRadialPush', new BufferAttribute(radialPush, 1));
  geometry.setAttribute('aMix', new BufferAttribute(mix, 1));
  geometry.setAttribute('aSpin', new BufferAttribute(spin, 1));
  geometry.setAttribute('aKind', new BufferAttribute(kind, 1));
  return geometry;
}
