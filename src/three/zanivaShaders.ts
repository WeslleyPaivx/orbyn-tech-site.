/**
 * Shaders do campo de partículas da ZANIVA.
 *
 * Adaptado do documento STORM, não copiado dele. Três diferenças deliberadas:
 *
 *  1. Paleta. O STORM fixa carmim, magenta e dourado (e o rodapé do documento
 *     contradiz o próprio corpo, pedindo ciano). Aqui as três paradas saem da
 *     paisagem Pink Grass: ameixa no núcleo, magenta no meio, lavanda na borda.
 *
 *  2. Sem postprocessing. O STORM pede três composers e dois passes de
 *     UnrealBloom sobre 50 mil pontos. O brilho aqui vem de blending aditivo
 *     com um sprite radial suave — mais barato por uma ordem de grandeza e
 *     visualmente muito próximo para uma nuvem de pontos.
 *
 *  3. Densidade por aparelho, definida em ZanivaField.
 *
 * Tudo é calculado na GPU a partir de quatro números por vértice.
 */

const common = /* glsl */ `
#define TAU 6.283185307179586
`;

export const fieldVertex = /* glsl */ `
${common}
uniform float uTime;
uniform float uSize;
uniform float uOpacity;
uniform float uPixelRatio;
uniform float uBright;
uniform float uGrow;
uniform float uSwirl;
uniform vec3 uCursor;
uniform float uRepelRadius;
uniform float uRepelStrength;
uniform float uActivity;
uniform vec3 uCore;
uniform vec3 uMid;
uniform vec3 uRim;
uniform float uMaxSize;

attribute float aScale;
attribute float aNoise;
attribute float aRadialPush;
attribute float aMix;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = position;

  // Respiração: cada partícula pulsa na própria fase, então a nuvem inteira
  // nunca infla junto — é isso que evita o aspecto de "bola piscando".
  float t = uTime * 1.2 + aNoise * TAU;
  pos *= 1.0 + sin(t) * 0.09 * aRadialPush;

  // Giro lento no plano xz. A rolagem acelera o giro sem mexer no relógio.
  float ang = uTime * 0.045 + uSwirl + aNoise * 0.35;
  float c = cos(ang);
  float s = sin(ang);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // Crescimento conduzido pela rolagem
  pos *= 1.0 + uGrow;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  // Repulsão do cursor, em espaço de visão: abre um vazio móvel na nuvem.
  vec3 away = mv.xyz - uCursor;
  float dist = length(away);
  float push = smoothstep(uRepelRadius, 0.0, dist) * uRepelStrength * uActivity;
  mv.xyz += normalize(away + 1e-5) * push;

  gl_Position = projectionMatrix * mv;

  // Gradiente radial em três paradas, pela profundidade da partícula na nuvem
  vec3 col = mix(uCore, uMid, smoothstep(0.0, 0.62, aMix));
  col = mix(col, uRim, smoothstep(0.58, 1.0, aMix));
  vColor = col * uBright;

  float depth = -mv.z;

  // Partícula perto demais vira uma mancha na cara do leitor. Duas travas:
  //
  // 1. TETO no tamanho. Sem ele, dividir pela distância explode: com a câmera
  //    mergulhando e a nuvem crescendo, a frente chega a z ~1,3 e um ponto de
  //    10px vira 46px. Foi isso que cobriu o texto de bolhas.
  // 2. DESVANECIMENTO de proximidade. O que passa perto demais some em vez de
  //    ser só limitado, senão o teto acumula discos opacos no primeiro plano.
  float size = uSize * aScale * uPixelRatio / max(depth, 0.1);
  gl_PointSize = min(size, uMaxSize * uPixelRatio);

  float nearFade = smoothstep(1.6, 3.4, depth);

  vAlpha = uOpacity * (0.34 + 0.66 * aMix) * nearFade;
}
`;

export const fieldFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Sprite radial. O cubo concentra o núcleo e apaga a borda bem antes do
  // limite do quadrado — com blending aditivo, uma queda larga faz centenas de
  // sprites se somarem num leite esbranquiçado em vez de pontos de luz.
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);
  float a = smoothstep(0.2, 0.0, d);
  a = a * a * a;

  if (a < 0.004) discard;

  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;
