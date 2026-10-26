import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  ExtrudeGeometry,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  LinearFilter,
  Matrix4,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Shape,
  Vector3,
  WebGLRenderer,
} from 'three';

/* ==========================================================================================
 * Asas da VOLTRA
 * Cada asa é feita de lâminas cromadas (instâncias de uma mesma peça), com bordas que acendem
 * em laranja elétrico, raios que saltam entre as pontas e faíscas que se soltam no bater.
 * ======================================================================================== */

const VOLT = new Color('#FF4A1C');
const SPARK = new Color('#FFB21E');

type Tier = 'leading' | 'covert' | 'secondary' | 'primary';
type Feather = { tier: Tier; k: number; n: number };

const FEATHERS: Feather[] = [
  { tier: 'leading', k: 0, n: 1 },
  ...range(10).map((k) => ({ tier: 'covert' as Tier, k, n: 10 })),
  ...range(9).map((k) => ({ tier: 'secondary' as Tier, k, n: 9 })),
  ...range(9).map((k) => ({ tier: 'primary' as Tier, k, n: 9 })),
];

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const deg = (d: number) => (d * Math.PI) / 180;
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const easeOutBack = (x: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** Lâmina: comprimento 1 ao longo de +x, largura 1, com um entalhe agressivo perto da ponta. */
function bladeShape(): Shape {
  const s = new Shape();
  s.moveTo(0, -0.26);
  s.quadraticCurveTo(0.45, -0.3, 0.82, -0.1);
  s.lineTo(1.0, 0.0);
  s.lineTo(0.9, 0.1);
  s.lineTo(0.76, 0.28);
  s.lineTo(0.7, 0.2);
  s.quadraticCurveTo(0.45, 0.44, 0.08, 0.34);
  s.lineTo(0, 0.3);
  s.closePath();
  return s;
}

function bladeGeometry() {
  const geo = new ExtrudeGeometry(bladeShape(), {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 1,
    curveSegments: 6,
  });
  geo.translate(0, 0, -0.015);
  geo.computeVertexNormals();
  return geo;
}

/** Mapa do brilho das bordas (desenhado uma vez em canvas): contorno e nervura central. */
function edgeTexture(): CanvasTexture {
  const w = 512;
  const h = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  const P = (x: number, y: number): [number, number] => [x * w, (0.5 - y) * h];
  const outline: [number, number][] = [
    [0, -0.26], [0.2, -0.29], [0.45, -0.27], [0.65, -0.2], [0.82, -0.1], [1.0, 0.0], [0.9, 0.1],
    [0.76, 0.28], [0.7, 0.2], [0.55, 0.33], [0.3, 0.38], [0.08, 0.34], [0, 0.3],
  ];
  const draw = (width: number, blur: number, alpha: number) => {
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = width;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = blur;
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    outline.forEach(([x, y], i) => (i ? ctx.lineTo(...P(x, y)) : ctx.moveTo(...P(x, y))));
    ctx.closePath();
    ctx.stroke();
    // Nervura central
    ctx.beginPath();
    ctx.moveTo(...P(0.02, 0.02));
    ctx.quadraticCurveTo(...P(0.5, 0.06), ...P(0.97, 0.0));
    ctx.lineWidth = width * 0.5;
    ctx.stroke();
    ctx.restore();
  };
  draw(10, 18, 0.55);
  draw(4, 6, 1);
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function glowTexture(inner: string, outer: string): CanvasTexture {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.25, outer);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new CanvasTexture(c);
}

const bladeVertex = /* glsl */ `
attribute float aGlow;
varying vec3 vN;
varying vec3 vW;
varying vec2 vLocal;
varying float vGlow;
void main() {
  vLocal = position.xy;
  vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vW = world.xyz;
  vec3 n = normal;
  // Curvatura falsa na largura da lâmina: o reflexo corre de uma borda à outra
  if (abs(normal.z) > 0.5) n = normalize(n + vec3(0.0, -position.y * 1.8, 0.0));
  vN = normalize(mat3(modelMatrix * instanceMatrix) * n);
  vGlow = aGlow;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const bladeFragment = /* glsl */ `
uniform sampler2D uEdge;
uniform vec3 uVolt;
uniform float uEnergy;
varying vec3 vN;
varying vec3 vW;
varying vec2 vLocal;
varying float vGlow;
void main() {
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  vec3 R = reflect(-V, N);
  // Estúdio procedural: luz principal, recorte lateral, céu e faixa de horizonte
  float key = smoothstep(0.55, 0.95, dot(R, normalize(vec3(-0.45, 0.7, 0.55))));
  float side = smoothstep(0.7, 0.98, dot(R, normalize(vec3(0.85, 0.15, 0.45)))) * 0.55;
  float sky = smoothstep(-0.2, 1.0, R.y) * 0.22;
  float strip = exp(-pow(R.y * 6.0, 2.0)) * 0.35;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 col = vec3(0.035, 0.038, 0.048) + vec3(0.86, 0.89, 0.94) * (key * 1.35 + side + sky + strip);
  // Reflexo quente do núcleo de energia, embaixo e no centro
  float warm = smoothstep(0.2, 1.0, dot(R, normalize(vec3(-vW.x, -vW.y - 1.0, 1.2))));
  col += uVolt * warm * 0.16 * uEnergy;
  col += uVolt * fres * 0.12 * uEnergy;
  float edge = texture2D(uEdge, vec2(vLocal.x, 0.5 - vLocal.y)).r;
  col += uVolt * edge * edge * (0.55 + vGlow * 2.6) * uEnergy;
  col += vec3(1.0, 0.86, 0.7) * edge * vGlow * 1.4;
  gl_FragColor = vec4(col, 1.0);
}
`;

const boltVertex = /* glsl */ `
attribute float aSide;
attribute float aFade;
varying float vSide;
varying float vFade;
void main() {
  vSide = aSide;
  vFade = aFade;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const boltFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uAlpha;
varying float vSide;
varying float vFade;
void main() {
  float core = exp(-vSide * vSide * 14.0);
  float halo = exp(-vSide * vSide * 2.5) * 0.45;
  vec3 col = mix(uColor, vec3(1.0, 0.95, 0.88), core);
  gl_FragColor = vec4(col * (core + halo), (core + halo) * uAlpha * vFade);
}
`;

const sparkVertex = /* glsl */ `
attribute float aLife;
attribute float aSize;
uniform float uScale;
varying float vLife;
void main() {
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uScale * (0.4 + aLife) / max(-mv.z, 0.5);
}
`;

const sparkFragment = /* glsl */ `
uniform vec3 uHot;
uniform vec3 uCool;
varying float vLife;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c) * 4.0;
  float a = exp(-d * 5.0) * vLife;
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(uCool, uHot, vLife), a);
}
`;

const BOLT_POINTS = 33;
const BOLT_COUNT = 5;

type Bolt = { mesh: Mesh; life: number; ttl: number; from: Vector3; to: Vector3; width: number };

export type WingsOptions = { mobile: boolean; reducedMotion: boolean };

export class Wings {
  readonly canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(35, 1, 0.1, 100);
  private rig = new Group();
  private right = new Group();
  private left = new Group();
  private rightMesh: InstancedMesh;
  private leftMesh: InstancedMesh;
  private glowRight: InstancedBufferAttribute;
  private glowLeft: InstancedBufferAttribute;
  private bladeMaterial: ShaderMaterial;
  private core: Mesh;
  private haze: Mesh;
  private bolts: Bolt[] = [];
  private sparks: Points;
  private sparkPos: Float32Array;
  private sparkVel: Float32Array;
  private sparkLife: Float32Array;
  private sparkCount: number;
  private sparkCursor = 0;
  private tips: Vector3[] = FEATHERS.map(() => new Vector3());
  private dummy = new Object3D();
  private time = 0;
  private openT = 0;
  private scroll = 0;
  private scrollSmooth = 0;
  private pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  private nextBolt = 0.4;
  private running = false;
  private frame = 0;
  private last = 0;
  private visible = true;
  private opts: WingsOptions;
  private fitDistance = 12;

  constructor(canvas: HTMLCanvasElement, opts: WingsOptions) {
    this.canvas = canvas;
    this.opts = opts;
    this.renderer = new WebGLRenderer({ canvas, antialias: !opts.mobile, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);

    const geo = bladeGeometry();
    this.bladeMaterial = new ShaderMaterial({
      vertexShader: bladeVertex,
      fragmentShader: bladeFragment,
      side: DoubleSide,
      uniforms: { uEdge: { value: edgeTexture() }, uVolt: { value: VOLT.clone() }, uEnergy: { value: 1 } },
    });
    const count = FEATHERS.length;
    this.rightMesh = new InstancedMesh(geo, this.bladeMaterial, count);
    this.leftMesh = new InstancedMesh(geo, this.bladeMaterial, count);
    this.leftMesh.instanceMatrix = this.rightMesh.instanceMatrix; // mesma pose, espelhada pelo grupo
    this.rightMesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.glowRight = new InstancedBufferAttribute(new Float32Array(count), 1).setUsage(DynamicDrawUsage);
    this.glowLeft = new InstancedBufferAttribute(new Float32Array(count), 1).setUsage(DynamicDrawUsage);
    geo.setAttribute('aGlow', this.glowRight);
    // A asa esquerda precisa do próprio brilho: geometria clonada que compartilha os vértices
    const geoLeft = geo.clone();
    geoLeft.setAttribute('aGlow', this.glowLeft);
    this.leftMesh.geometry = geoLeft;
    for (const m of [this.rightMesh, this.leftMesh]) m.frustumCulled = false;

    this.right.add(this.rightMesh);
    this.left.add(this.leftMesh);
    this.left.scale.x = -1;
    this.rig.add(this.right, this.left);

    // Núcleo de energia e névoa quente
    this.core = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uMap: { value: glowTexture('rgba(255,236,210,1)', 'rgba(255,74,28,0.85)') }, uAlpha: { value: 1 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'uniform sampler2D uMap; uniform float uAlpha; varying vec2 vUv; void main(){ vec4 c = texture2D(uMap, vUv); gl_FragColor = vec4(c.rgb * c.a * uAlpha, c.a * uAlpha); }',
      }),
    );
    this.core.position.set(0, -0.15, 0.3);
    this.haze = new Mesh(
      new PlaneGeometry(1, 1),
      (this.core.material as ShaderMaterial).clone(),
    );
    (this.haze.material as ShaderMaterial).uniforms.uMap.value = glowTexture('rgba(255,90,40,0.55)', 'rgba(120,20,0,0.25)');
    this.haze.position.set(0, -0.3, -1.2);
    this.haze.scale.setScalar(11);
    this.rig.add(this.haze, this.core);

    // Raios
    const boltMat = new ShaderMaterial({
      vertexShader: boltVertex,
      fragmentShader: boltFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uColor: { value: VOLT.clone().lerp(SPARK, 0.35) }, uAlpha: { value: 1 } },
    });
    for (let i = 0; i < BOLT_COUNT; i++) {
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(new Float32Array(BOLT_POINTS * 2 * 3), 3).setUsage(DynamicDrawUsage));
      const side = new Float32Array(BOLT_POINTS * 2);
      const fade = new Float32Array(BOLT_POINTS * 2);
      for (let j = 0; j < BOLT_POINTS; j++) {
        side[j * 2] = -1;
        side[j * 2 + 1] = 1;
        const t = j / (BOLT_POINTS - 1);
        fade[j * 2] = fade[j * 2 + 1] = Math.sin(Math.PI * t) * 0.8 + 0.2;
      }
      g.setAttribute('aSide', new BufferAttribute(side, 1));
      g.setAttribute('aFade', new BufferAttribute(fade, 1));
      const idx: number[] = [];
      for (let j = 0; j < BOLT_POINTS - 1; j++) {
        const a = j * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      g.setIndex(idx);
      const mesh = new Mesh(g, boltMat.clone());
      mesh.frustumCulled = false;
      mesh.visible = false;
      this.rig.add(mesh);
      this.bolts.push({ mesh, life: 0, ttl: 0, from: new Vector3(), to: new Vector3(), width: 0.04 });
    }

    // Faíscas
    this.sparkCount = opts.mobile ? 220 : 520;
    this.sparkPos = new Float32Array(this.sparkCount * 3);
    this.sparkVel = new Float32Array(this.sparkCount * 3);
    this.sparkLife = new Float32Array(this.sparkCount);
    const sizes = new Float32Array(this.sparkCount);
    for (let i = 0; i < this.sparkCount; i++) sizes[i] = 6 + Math.random() * 16;
    const sg = new BufferGeometry();
    sg.setAttribute('position', new BufferAttribute(this.sparkPos, 3).setUsage(DynamicDrawUsage));
    sg.setAttribute('aLife', new BufferAttribute(this.sparkLife, 1).setUsage(DynamicDrawUsage));
    sg.setAttribute('aSize', new BufferAttribute(sizes, 1));
    this.sparks = new Points(
      sg,
      new ShaderMaterial({
        vertexShader: sparkVertex,
        fragmentShader: sparkFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uScale: { value: 1 }, uHot: { value: new Color('#FFE2B0') }, uCool: { value: VOLT.clone() } },
      }),
    );
    this.sparks.frustumCulled = false;
    this.rig.add(this.sparks);

    this.scene.add(this.rig);
    this.resize();
    if (opts.reducedMotion) this.openT = 1;
  }

  /** Progresso da rolagem dentro da abertura (0 a 1). */
  setScroll(v: number) {
    this.scroll = clamp01(v);
  }

  setPointer(x: number, y: number) {
    this.pointer.x = x;
    this.pointer.y = y;
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.start();
    else this.stop();
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.mobile ? 1.5 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    // Enquadra as asas abertas (≈ 9,6 × 5,4 unidades) em qualquer proporção de tela
    const t = Math.tan(deg(this.camera.fov / 2));
    const byHeight = 2.9 / t;
    const byWidth = 5.1 / (t * this.camera.aspect);
    // No celular (tela em pé) as pontas das asas podem sair um pouco da tela: ficam maiores e mais agressivas
    const portrait = this.camera.aspect < 0.85;
    this.fitDistance = portrait ? Math.max(byHeight * 0.9, byWidth * 0.52) : Math.max(byHeight, byWidth) * 1.05;
    (this.sparks.material as ShaderMaterial).uniforms.uScale.value = (h / 900) * dpr * 9;
  }

  start() {
    if (this.running || !this.visible) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.update(dt);
      this.renderer.render(this.scene, this.camera);
      this.frame = requestAnimationFrame(loop);
    };
    this.frame = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  /** Um quadro com tempo fixo (capturas e movimento reduzido). */
  renderAt(time: number, scroll = this.scroll) {
    this.time = time;
    this.openT = 1;
    this.scroll = this.scrollSmooth = scroll;
    this.update(0);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.renderer.dispose();
  }

  /* ------------------------------------------------------------------------------------ */

  private update(dt: number) {
    const reduced = this.opts.reducedMotion;
    this.time += reduced ? 0 : dt;
    if (!reduced) this.openT = Math.min(1, this.openT + dt / 1.9);
    this.scrollSmooth += (this.scroll - this.scrollSmooth) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 6));
    this.pointer.sx += (this.pointer.x - this.pointer.sx) * (1 - Math.exp(-dt * 3));
    this.pointer.sy += (this.pointer.y - this.pointer.sy) * (1 - Math.exp(-dt * 3));

    const s = this.scrollSmooth;
    const t = this.time;
    // Abertura: as asas se abrem com um tranco (passa um pouco do ponto e volta)
    const open = easeOutBack(clamp01(this.openT)) * (1 - smoothBand(s, 0.62, 0.95) * 0.75);
    // Batida: suave parada, forte conforme a rolagem avança
    const beatAmp = reduced ? 0 : 0.07 + smoothBand(s, 0.0, 0.5) * 0.22;
    const beatSpeed = 2.2 + s * 2.2;
    const beat = Math.sin(t * beatSpeed) * beatAmp;
    const energy = 0.8 + smoothBand(s, 0.05, 0.55) * 0.6 + Math.max(0, Math.sin(t * 9.0)) * 0.05;
    this.bladeMaterial.uniforms.uEnergy.value = energy;

    this.layoutWing(open, t);
    for (const g of [this.right, this.left]) {
      g.rotation.set(0, deg(-14) + beat * 0.9, beat);
    }

    // Rig: sobe e se afasta no fim da abertura, inclina com o ponteiro
    const exit = smoothBand(s, 0.6, 1.0);
    this.rig.position.set(0, lerp(0.15, 3.6, exit) + Math.sin(t * 1.1) * 0.06, 0);
    this.rig.rotation.set(-this.pointer.sy * 0.16 + exit * 0.5, this.pointer.sx * 0.28, 0);
    this.rig.scale.setScalar(lerp(1, 0.72, exit));

    this.camera.position.set(this.pointer.sx * 0.4, this.pointer.sy * 0.25, this.fitDistance * lerp(1, 0.86, smoothBand(s, 0, 0.5)));
    this.camera.lookAt(0, 0, 0);

    // Núcleo pulsando
    const pulse = 1 + Math.sin(t * 6.0) * 0.06 + Math.max(0, Math.sin(t * 13.0)) * 0.04;
    this.core.scale.setScalar(lerp(1.3, 2.2, open) * pulse * (0.9 + energy * 0.15));
    (this.core.material as ShaderMaterial).uniforms.uAlpha.value = 0.85 * (1 - exit * 0.6);
    (this.haze.material as ShaderMaterial).uniforms.uAlpha.value = 0.55 * (1 - exit * 0.7);

    this.updateGlow(dt);
    if (!reduced) {
      this.updateBolts(dt, energy, s);
      this.updateSparks(dt, beat, energy);
    }
  }

  /** Posiciona cada lâmina (asa direita; a esquerda é o espelho). */
  private layoutWing(open: number, t: number) {
    const o = clamp01(open);
    const S = new Vector3(0.22, 0.05, 0);
    const W = new Vector3(lerp(0.75, 1.75, o), lerp(-0.35, 0.5, o), 0);
    const m = new Matrix4();
    FEATHERS.forEach((f, i) => {
      const u = f.n > 1 ? f.k / (f.n - 1) : 0;
      let pos: Vector3;
      let angle: number;
      let len: number;
      let width: number;
      let z: number;
      if (f.tier === 'leading') {
        pos = S.clone();
        angle = Math.atan2(W.y - S.y, W.x - S.x);
        len = S.distanceTo(W) * 1.18;
        width = 0.34;
        z = 0.12;
      } else if (f.tier === 'covert') {
        const uu = (f.k + 0.6) / f.n;
        pos = S.clone().lerp(W, uu).add(new Vector3(0, 0.04, 0));
        angle = lerp(lerp(deg(-108), deg(-92), uu), lerp(deg(-88), deg(-22), uu), o);
        len = lerp(0.6, 0.9, uu) * lerp(0.8, 1, o);
        width = 0.62;
        z = 0.07 - f.k * 0.004;
      } else if (f.tier === 'secondary') {
        const uu = (f.k + 1) / (f.n + 0.5);
        pos = S.clone().lerp(W, uu);
        angle = lerp(lerp(deg(-118), deg(-98), uu), lerp(deg(-104), deg(-40), uu), o);
        len = lerp(1.3, 1.75, uu) * lerp(0.85, 1, o);
        width = 0.56;
        z = -0.02 - f.k * 0.012;
      } else {
        pos = W.clone().add(new Vector3(f.k * 0.035, f.k * 0.012, 0));
        angle = lerp(lerp(deg(-100), deg(-82), u), lerp(deg(-30), deg(42), u), o);
        len = (2.05 + Math.sin(Math.PI * (f.k + 1) / (f.n + 1)) * 0.95) * lerp(0.8, 1, o);
        width = 0.46;
        z = -0.18 - f.k * 0.014;
      }
      // Leve ondulação individual: as lâminas "respiram" fora de sincronia
      angle += Math.sin(t * 2.0 + i * 0.7) * deg(1.6) * o;
      const twist = 0.32 + Math.sin(t * 0.9 + i * 0.45) * 0.12;
      this.dummy.position.set(pos.x, pos.y, z);
      this.dummy.rotation.set(twist, 0, angle, 'ZYX');
      this.dummy.scale.set(len, width, 1);
      this.dummy.updateMatrix();
      this.rightMesh.setMatrixAt(i, this.dummy.matrix);
      // Ponta da lâmina (para raios e faíscas), no espaço do grupo da asa
      m.copy(this.dummy.matrix);
      this.tips[i].set(1, 0, 0).applyMatrix4(m);
    });
    this.rightMesh.instanceMatrix.needsUpdate = true;
  }

  private updateGlow(dt: number) {
    const decay = Math.exp(-dt * 5);
    for (const attr of [this.glowRight, this.glowLeft]) {
      const a = attr.array as Float32Array;
      for (let i = 0; i < a.length; i++) a[i] *= decay;
      attr.needsUpdate = true;
    }
  }

  private wingTipWorld(i: number, left: boolean, out: Vector3) {
    const g = left ? this.left : this.right;
    g.updateMatrix();
    return out.copy(this.tips[i]).applyMatrix4(g.matrix);
  }

  private updateBolts(dt: number, energy: number, s: number) {
    this.nextBolt -= dt * (0.8 + s * 2.4);
    if (this.nextBolt <= 0 && this.openT > 0.55) {
      this.nextBolt = 0.18 + Math.random() * 0.55;
      const bolt = this.bolts.find((b) => b.life <= 0);
      if (bolt) {
        const left = Math.random() < 0.5;
        const primaries = FEATHERS.map((f, i) => (f.tier === 'primary' ? i : -1)).filter((i) => i >= 0);
        const a = primaries[Math.floor(Math.random() * primaries.length)];
        if (Math.random() < 0.55) {
          bolt.from.set(0, -0.15, 0.3);
          this.wingTipWorld(a, left, bolt.to);
        } else {
          const b = Math.min(a + 1 + Math.floor(Math.random() * 2), primaries[primaries.length - 1]);
          this.wingTipWorld(a, left, bolt.from);
          this.wingTipWorld(b, left, bolt.to);
        }
        bolt.ttl = bolt.life = 0.16 + Math.random() * 0.14;
        bolt.width = 0.03 + Math.random() * 0.03;
        const glow = (left ? this.glowLeft : this.glowRight).array as Float32Array;
        glow[a] = 1;
        this.emitSparks(bolt.to, 14);
      }
    }
    for (const bolt of this.bolts) {
      if (bolt.life <= 0) {
        bolt.mesh.visible = false;
        continue;
      }
      bolt.life -= dt;
      bolt.mesh.visible = true;
      // Redesenha o traçado a cada quadro: o raio tremula
      this.shapeBolt(bolt);
      (bolt.mesh.material as ShaderMaterial).uniforms.uAlpha.value = clamp01(bolt.life / bolt.ttl) * Math.min(1.4, energy);
    }
  }

  private shapeBolt(bolt: Bolt) {
    const pts: Vector3[] = new Array(BOLT_POINTS);
    pts[0] = bolt.from.clone();
    pts[BOLT_POINTS - 1] = bolt.to.clone();
    const subdivide = (a: number, b: number, rough: number) => {
      if (b - a < 2) return;
      const mid = (a + b) >> 1;
      const p = pts[a].clone().lerp(pts[b], 0.5);
      const dir = pts[b].clone().sub(pts[a]);
      const nrm = new Vector3(-dir.y, dir.x, 0).normalize();
      p.addScaledVector(nrm, (Math.random() - 0.5) * rough);
      p.z += (Math.random() - 0.5) * rough * 0.4;
      pts[mid] = p;
      subdivide(a, mid, rough * 0.55);
      subdivide(mid, b, rough * 0.55);
    };
    subdivide(0, BOLT_POINTS - 1, bolt.from.distanceTo(bolt.to) * 0.35);
    const pos = bolt.mesh.geometry.getAttribute('position') as BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let j = 0; j < BOLT_POINTS; j++) {
      const p = pts[j];
      const q = pts[Math.min(j + 1, BOLT_POINTS - 1)];
      const r = pts[Math.max(j - 1, 0)];
      const dir = q.clone().sub(r);
      const nrm = new Vector3(-dir.y, dir.x, 0).normalize().multiplyScalar(bolt.width);
      arr.set([p.x - nrm.x, p.y - nrm.y, p.z, p.x + nrm.x, p.y + nrm.y, p.z], j * 6);
    }
    pos.needsUpdate = true;
  }

  private emitSparks(at: Vector3, n: number) {
    for (let k = 0; k < n; k++) {
      const i = this.sparkCursor;
      this.sparkCursor = (this.sparkCursor + 1) % this.sparkCount;
      this.sparkPos.set([at.x, at.y, at.z], i * 3);
      const a = Math.random() * Math.PI * 2;
      const sp = 0.6 + Math.random() * 1.8;
      this.sparkVel.set([Math.cos(a) * sp, Math.sin(a) * sp + 0.4, (Math.random() - 0.5) * sp], i * 3);
      this.sparkLife[i] = 0.6 + Math.random() * 0.4;
    }
  }

  private updateSparks(dt: number, beat: number, energy: number) {
    // Faíscas contínuas soltando das pontas, mais intensas no bater das asas
    const rate = (this.opts.mobile ? 24 : 60) * (0.5 + Math.abs(beat) * 3 + (energy - 0.8));
    const emit = Math.floor(rate * dt + Math.random());
    const tmp = new Vector3();
    for (let e = 0; e < emit; e++) {
      const i = 20 + Math.floor(Math.random() * 9); // primárias
      this.wingTipWorld(i, Math.random() < 0.5, tmp);
      this.emitSparks(tmp, 1);
    }
    for (let i = 0; i < this.sparkCount; i++) {
      if (this.sparkLife[i] <= 0) continue;
      this.sparkLife[i] = Math.max(0, this.sparkLife[i] - dt * 0.9);
      this.sparkVel[i * 3 + 1] -= dt * 1.4;
      this.sparkVel[i * 3] *= 1 - dt * 0.6;
      this.sparkPos[i * 3] += this.sparkVel[i * 3] * dt;
      this.sparkPos[i * 3 + 1] += this.sparkVel[i * 3 + 1] * dt;
      this.sparkPos[i * 3 + 2] += this.sparkVel[i * 3 + 2] * dt;
    }
    const g = this.sparks.geometry;
    (g.getAttribute('position') as BufferAttribute).needsUpdate = true;
    (g.getAttribute('aLife') as BufferAttribute).needsUpdate = true;
  }
}

/** 0 antes de a, 1 depois de b, suave no meio. */
function smoothBand(x: number, a: number, b: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
