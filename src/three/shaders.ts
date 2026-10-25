/**
 * Shaders da escultura ORBYN.
 *
 * Todas as formas são calculadas na GPU a partir de três números por vértice:
 * a posição ao longo do filamento (t), o lado da fita (±1) e o índice do filamento.
 * Assim, os mesmos filamentos podem assumir composições completamente diferentes
 * sem recriar geometria: basta mudar os uniforms uFrom, uTo e uLocal.
 *
 *   0  Escultura   — anel torcido em sela, superfície sólida cromada
 *   1  Fluxo       — feixe de fios que se desenrola atravessando a tela
 *   2  Treliça     — torre hiperbolóide de fios cruzados
 *   3  Horizonte   — campo de linhas ondulando em profundidade
 *   4  Símbolo     — os fios desenham o símbolo oficial da ORBYN TECH
 */

export const STAGE_COUNT = 5;

const common = /* glsl */ `
#define PI 3.141592653589793
#define TAU 6.283185307179586

uniform float uTime;
uniform int uFrom;
uniform int uTo;
uniform float uLocal;
uniform float uPhase;
uniform float uCount;
uniform float uActive;
uniform sampler2D uLogo;
uniform float uLogoSamples;

float hash11(float n) { return fract(sin(n * 91.3458) * 47453.5453); }

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

/* Distribuição de baixa discrepância: qualquer prefixo de filamentos cobre a forma inteira,
   o que permite reduzir a quantidade desenhada sem abrir buracos. */
float filamentCoord(float fi) { return fract((fi + 1.0) * 0.6180339887); }

/* ---------------------------------------------------------------- 0 · Escultura */
vec3 sculptSurface(float u, float v, float k) {
  float R = 1.5;
  float a = (0.46 + 0.16 * cos(2.0 * u + 0.6)) * k;
  float b = (0.07 + 0.11 * (0.5 + 0.5 * sin(3.0 * u + 1.3))) * k;
  float tw = u + 0.35 * sin(2.0 * u);
  vec2 cs = vec2(a * cos(v), b * sin(v));
  float ct = cos(tw), st = sin(tw);
  cs = vec2(ct * cs.x - st * cs.y, st * cs.x + ct * cs.y);
  float r = R + cs.x;
  vec3 p = vec3(r * cos(u), cs.y + 0.42 * sin(2.0 * u + 0.4), r * sin(u));
  p += 0.03 * sin(3.0 * u + uTime * 0.5 + v) * vec3(cos(u), 0.5, sin(u));
  return rotZ(0.32) * rotX(1.05) * p;
}

/* ---------------------------------------------------------------- 1 · Fluxo */
vec3 shapeFlow(float t, float f, vec3 h) {
  float env = sin(PI * t);
  float x = (t - 0.5) * 11.0;
  vec3 c = vec3(
    x,
    0.85 * sin(t * 4.2 + 0.5 + uTime * 0.18) * env,
    1.1 * cos(t * 3.1 + uTime * 0.13) * env - 0.3
  );
  float ang = f * TAU + t * 6.0 + uPhase * 3.0 + uTime * 0.12;
  float rad = (0.12 + 0.88 * pow(max(env, 0.0), 0.7)) * (0.45 + 0.55 * h.x) * 0.95;
  vec3 p = c + vec3(0.0, cos(ang) * rad, sin(ang) * rad * 1.25);
  return rotZ(0.10) * rotY(-0.30) * p;
}

/* ---------------------------------------------------------------- 2 · Treliça */
vec3 shapeLattice(float t, float f, float fi, vec3 h) {
  float dir = mod(fi, 2.0) < 0.5 ? 1.0 : -1.0;
  float a = f * TAU + uTime * 0.05;
  float phi = 2.4 * dir;
  float H = 2.3;
  float R = 1.5;
  vec3 B = vec3(R * cos(a - phi * 0.5), -H, R * sin(a - phi * 0.5));
  vec3 T = vec3(R * cos(a + phi * 0.5), H, R * sin(a + phi * 0.5));
  vec3 p = mix(B, T, t);
  vec2 radial = normalize(p.xz + vec2(1e-4));
  p.xz += radial * 0.18 * sin(PI * t) * (0.6 + 0.4 * h.y);
  return rotZ(-0.18) * rotX(0.22) * p;
}

/* ---------------------------------------------------------------- 3 · Horizonte */
vec3 shapeHorizon(float t, float f) {
  float x = (t - 0.5) * 16.0;
  float z = mix(-7.0, 2.2, f);
  float y = -1.55
    + 0.38 * sin(x * 0.55 + z * 0.8 + uTime * 0.3)
    + 0.22 * sin(x * 1.25 - z * 0.45 - uTime * 0.22);
  y += 0.55 * exp(-x * x * 0.08) * exp(-(z + 1.5) * (z + 1.5) * 0.15);
  return vec3(x, y, z);
}

/* ---------------------------------------------------------------- 4 · Símbolo */
vec3 shapeLogo(float t, float fi) {
  float s = t * uLogoSamples;
  float i0 = floor(s);
  float fr = s - i0;
  int row = int(fi);
  int x0 = int(mod(i0, uLogoSamples));
  int x1 = int(mod(i0 + 1.0, uLogoSamples));
  vec3 a = texelFetch(uLogo, ivec2(x0, row), 0).xyz;
  vec3 b = texelFetch(uLogo, ivec2(x1, row), 0).xyz;
  vec3 p = mix(a, b, fr) * 1.55;
  return rotY(0.28 * sin(uTime * 0.18)) * rotX(0.1 * sin(uTime * 0.14)) * p;
}

vec3 shapeAt(int s, float t, float f, float fi, vec3 h) {
  if (s == 0) return sculptSurface(t * TAU, f * TAU + t * TAU, 1.012);
  if (s == 1) return shapeFlow(t, f, h);
  if (s == 2) return shapeLattice(t, f, fi, h);
  if (s == 3) return shapeHorizon(t, f);
  return shapeLogo(t, fi);
}

float shapeOpen(int s) { return (s == 1 || s == 2 || s == 3) ? 1.0 : 0.0; }

/* Transição: cada fio parte em um momento diferente e passa por uma turbulência suave,
   como se a forma fosse desfeita e reconstruída fio a fio. Funciona nos dois sentidos. */
vec3 morphPosition(float t, float f, float fi, vec3 h, out float e) {
  float st = clamp(uLocal * 1.7 - h.x * 0.55 - t * 0.15, 0.0, 1.0);
  e = st * st * (3.0 - 2.0 * st);
  vec3 a = shapeAt(uFrom, t, f, fi, h);
  vec3 p = a;
  if (uFrom != uTo) {
    vec3 b = shapeAt(uTo, t, f, fi, h);
    p = mix(a, b, e);
    float tb = sin(PI * e);
    vec3 swirl = vec3(
      sin(p.y * 1.6 + uTime * 0.7 + h.y * TAU),
      sin(p.z * 1.4 + uTime * 0.6 + h.z * TAU),
      sin(p.x * 1.2 + uTime * 0.5 + h.x * TAU)
    );
    p += tb * (swirl * 0.55 + normalize(p + vec3(1e-4)) * 0.45);
  }
  return p;
}

vec3 filamentHash(float fi) {
  return vec3(hash11(fi * 1.31 + 0.17), hash11(fi * 2.17 + 3.1), hash11(fi * 0.73 + 7.7));
}

float stageWeight(int s, float e) {
  return (uFrom == s ? 1.0 - e : 0.0) + (uTo == s && uFrom != uTo ? e : 0.0);
}
`;

/* -------------------------------------------------------------------------------------------
 * Filamentos: fitas finas sempre voltadas para a câmera, com largura constante em pixels
 * e brilho de fibra (modelo Kajiya-Kay), para parecerem fios de seda metálica.
 * ----------------------------------------------------------------------------------------- */
export const filamentVertex = /* glsl */ `
${common}
uniform vec2 uResolution;
uniform float uWidth;
uniform float uSegments;
uniform float uBright;
varying float vSide;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float t = position.x;
  float side = position.y;
  float fi = position.z;
  float f = filamentCoord(fi);
  vec3 h = filamentHash(fi);

  float e;
  float dt = 0.5 / uSegments;
  float sgn = t < 0.999 ? 1.0 : -1.0;
  vec3 p = morphPosition(t, f, fi, h, e);
  float e2;
  vec3 q = morphPosition(t + dt * sgn, f, fi, h, e2);

  vec4 mvP = modelViewMatrix * vec4(p, 1.0);
  vec4 mvQ = modelViewMatrix * vec4(q, 1.0);
  vec4 cp = projectionMatrix * mvP;
  vec4 cq = projectionMatrix * mvQ;
  vec2 sp = cp.xy / cp.w * uResolution;
  vec2 sq = cq.xy / cq.w * uResolution;
  vec2 dir = (sq - sp) * sgn;
  dir = length(dir) > 1e-5 ? normalize(dir) : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);

  float solid = stageWeight(0, e);
  float width = uWidth * mix(1.0, 0.75, solid) + 1.0;
  cp.xy += nrm * side * width / uResolution * cp.w;
  gl_Position = cp;

  vec3 wp = (modelMatrix * vec4(p, 1.0)).xyz;
  vec3 T = normalize((modelMatrix * vec4((q - p) * sgn, 0.0)).xyz + vec3(1e-6));
  vec3 V = normalize(cameraPosition - wp);
  vec3 L = normalize(vec3(-0.4, 0.8, 0.6));
  vec3 H = normalize(L + V);
  float th = dot(T, H);
  float spec = pow(sqrt(max(1.0 - th * th, 0.0)), 70.0);
  float tl = dot(T, L);
  float diff = sqrt(max(1.0 - tl * tl, 0.0));

  float open = mix(shapeOpen(uFrom), shapeOpen(uTo), uFrom != uTo ? e : 0.0);
  float taper = mix(1.0, smoothstep(0.0, 0.07, t) * smoothstep(1.0, 0.93, t), open);
  float fog = smoothstep(15.0, 4.5, -mvP.z);
  float variation = 0.55 + 0.45 * h.z;
  float alpha = mix(0.3, 0.2, solid);

  vSide = side;
  vColor = vec3(0.74, 0.77, 0.82) * (0.22 + 0.78 * diff) + vec3(1.0) * spec * 1.4;
  vAlpha = alpha * taper * fog * variation * uBright;
}
`;

export const filamentFragment = /* glsl */ `
varying float vSide;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float edge = 1.0 - abs(vSide);
  float a = smoothstep(0.0, 0.65, edge) * vAlpha;
  if (a < 0.002) discard;
  gl_FragColor = vec4(vColor, a);
}
`;

/* -------------------------------------------------------------------------------------------
 * Partículas luminosas que correm ao longo dos filamentos.
 * ----------------------------------------------------------------------------------------- */
export const particleVertex = /* glsl */ `
${common}
attribute float aSize;
uniform float uPixelRatio;
uniform float uSizeScale;
uniform float uBright;
varying float vAlpha;

void main() {
  float fi = mod(position.x, uActive);
  float f = filamentCoord(fi);
  vec3 h = filamentHash(fi);
  float t = fract(position.y + uTime * position.z);

  float e;
  vec3 p = morphPosition(t, f, fi, h, e);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float open = mix(shapeOpen(uFrom), shapeOpen(uTo), uFrom != uTo ? e : 0.0);
  float taper = mix(1.0, smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t), open);
  float fog = smoothstep(15.0, 4.5, -mv.z);
  float twinkle = 0.65 + 0.35 * sin(uTime * (1.5 + h.y * 2.0) + position.y * 40.0);

  gl_PointSize = aSize * uPixelRatio * uSizeScale / max(-mv.z, 0.5);
  vAlpha = taper * fog * twinkle * uBright * mix(1.0, 0.55, stageWeight(0, e));
}
`;

export const particleFragment = /* glsl */ `
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c) * 4.0;
  float core = exp(-r2 * 16.0);
  float halo = exp(-r2 * 3.5) * 0.28;
  float a = (core + halo) * vAlpha;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vec3(1.0, 0.985, 0.96), a);
}
`;

/* -------------------------------------------------------------------------------------------
 * Escultura sólida: a mesma superfície dos filamentos, em grafite cromado iluminado
 * por um estúdio procedural. Ao rolar, ela se dissolve com uma borda luminosa e
 * revela os filamentos que a compunham.
 * ----------------------------------------------------------------------------------------- */
export const solidVertex = /* glsl */ `
${common}
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vLocal;

void main() {
  float u = uv.x * TAU;
  float v = uv.y * TAU;
  vec3 p = sculptSurface(u, v, 1.0);
  vec3 pu = sculptSurface(u + 0.01, v, 1.0);
  vec3 pv = sculptSurface(u, v + 0.01, 1.0);
  vec3 n = normalize(cross(pu - p, pv - p));
  vLocal = p;
  vec4 w = modelMatrix * vec4(p, 1.0);
  vWorld = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * n);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const solidFragment = /* glsl */ `
uniform float uDissolve;
uniform float uBright;
uniform float uTime;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vLocal;

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

float noise3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), f.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}

void main() {
  float n = noise3(vLocal * 3.2 + vec3(0.0, uTime * 0.04, 0.0)) * 0.65 + noise3(vLocal * 9.0) * 0.35;
  if (n < uDissolve) discard;
  float edge = uDissolve > -0.05 ? 1.0 - smoothstep(0.0, 0.035, n - uDissolve) : 0.0;

  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorld);
  if (dot(N, V) < 0.0) N = -N;
  vec3 R = reflect(-V, N);

  float key = smoothstep(0.55, 0.93, dot(R, normalize(vec3(-0.55, 0.65, 0.55))));
  float fill = smoothstep(0.72, 0.98, dot(R, normalize(vec3(0.85, 0.05, 0.5)))) * 0.45;
  float top = smoothstep(0.25, 1.0, R.y) * 0.22;
  float strip = exp(-pow((R.y + 0.05) * 9.0, 2.0)) * 0.32;
  float env = key * 1.5 + fill + top + strip;

  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  float diff = max(dot(N, normalize(vec3(-0.4, 0.8, 0.6))), 0.0);
  vec3 base = vec3(0.022, 0.024, 0.028) + diff * 0.035;
  vec3 col = base + vec3(0.88, 0.9, 0.94) * env * mix(0.5, 1.0, fres);
  col += vec3(0.6, 0.63, 0.68) * fres * 0.18;
  col += vec3(1.0, 0.97, 0.92) * edge * edge * 0.9;

  gl_FragColor = vec4(col * uBright, 1.0);
}
`;
