/**
 * Shaders da nebulosa do manifesto.
 *
 * Adaptado do STORM, não copiado. O documento descreve uma esfera de pontos
 * girando em bloco; a montagem aprovada mostra uma NEBULOSA — braços em arco,
 * núcleo aceso, véu atmosférico em volta e profundidade real. A diferença não
 * está no brilho, está na ESTRUTURA, e por isso a geometria tem populações
 * distintas (núcleo, braço, halo) em vez de uma casca estatisticamente
 * uniforme, que foi o que fez a primeira versão parecer confete.
 *
 * Paleta do protótipo: núcleo ameixa, braços magenta, pontas em rosa claro.
 */

const common = /* glsl */ `
#define TAU 6.283185307179586

mat3 rotY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}
`;

export const fieldVertex = /* glsl */ `
${common}
uniform float uTime;
uniform float uSize;
uniform float uMaxSize;
uniform float uOpacity;
uniform float uPixelRatio;
uniform float uBright;
uniform float uTilt;
uniform vec3 uCursor;
uniform float uRepelRadius;
uniform float uRepelStrength;
uniform float uActivity;
uniform vec3 uCore;
uniform vec3 uMid;
uniform vec3 uRim;

attribute float aScale;
attribute float aNoise;
attribute float aRadialPush;
attribute float aMix;
attribute float aSpin;
attribute float aKind;

varying vec3 vColor;
varying float vAlpha;
varying float vSoft;

void main() {
  vec3 pos = position;

  // ROTAÇÃO DIFERENCIAL — o coração do efeito. Cada partícula gira à sua
  // própria taxa, mais rápida perto do centro, como matéria em órbita. É isso
  // que faz os braços se enrolarem e cisalharem com o tempo. Girar tudo à
  // mesma taxa dá um bloco rígido, que é exatamente o que não parece nebulosa.
  pos = rotY(uTime * aSpin) * pos;

  // Respiração fora de fase, por partícula.
  float t = uTime * 0.9 + aNoise * TAU;
  pos *= 1.0 + sin(t) * 0.045 * aRadialPush;

  // Ondulação vertical dependente do raio: desmancha o disco perfeito e dá a
  // irregularidade orgânica que uma nuvem de gás tem.
  pos.y += sin(uTime * 0.55 + aNoise * 7.0 + length(pos.xz) * 0.8) * 0.085 * aRadialPush;

  // A nebulosa é vista de viés, não de frente.
  pos = rotX(uTilt) * pos;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  vec3 away = mv.xyz - uCursor;
  float dist = length(away);
  mv.xyz += normalize(away + 1e-5) * smoothstep(uRepelRadius, 0.0, dist) * uRepelStrength * uActivity;

  gl_Position = projectionMatrix * mv;

  float depth = -mv.z;

  vec3 col = mix(uCore, uMid, smoothstep(0.0, 0.58, aMix));
  col = mix(col, uRim, smoothstep(0.55, 1.0, aMix));

  // O que está atrás escurece e o que está à frente acende: é a transparência
  // somada à profundidade que separa a nuvem de um adesivo chapado.
  float front = smoothstep(10.0, 4.2, depth);

  bool isHalo = aKind > 1.5;
  bool isCore = aKind < 0.5;

  float kindAlpha = isCore ? 1.0 : (isHalo ? 0.20 : 0.9);
  float kindSize = isCore ? 0.75 : (isHalo ? 2.8 : 1.0);

  vColor = col * uBright * (isHalo ? 0.5 : 1.0);
  // O recorte de proximidade evita a mancha na cara do leitor quando o halo
  // passa perto da câmera.
  vAlpha = uOpacity * kindAlpha * (0.32 + 0.68 * front) * smoothstep(1.3, 2.9, depth);
  vSoft = isHalo ? 1.0 : 0.0;

  float size = uSize * aScale * kindSize * uPixelRatio / max(depth, 0.1);
  gl_PointSize = min(size, uMaxSize * uPixelRatio * kindSize);
}
`;

export const fieldFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying float vSoft;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);

  float a = smoothstep(0.25, 0.0, d);
  // Duas assinaturas no mesmo sprite: ponto de luz concentrado para núcleo e
  // braços, véu largo e macio para o halo. Com blending aditivo, dar a queda
  // larga a todo mundo soma centenas de sprites num leite esbranquiçado.
  a = mix(a * a * a, a * 0.5, vSoft);

  if (a < 0.003) discard;

  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;
