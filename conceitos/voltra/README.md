# VOLTRA — conceito de site de produto

Energético **fictício** criado pela ORBYN TECH para mostrar uma experiência de produto em 3D guiada pela rolagem.
VOLTRA não é uma marca real; nome, logo, latas e textos foram inventados para este conceito.

**Stack:** Vite · TypeScript · Three.js (WebGL) · GSAP ScrollTrigger. Sem React: a página é leve e direta.

## Seções

1. **Abertura:** asas cromadas feitas de lâminas com bordas em laranja elétrico, raios entre as pontas e faíscas (`src/wings.ts`). Ao rolar, batem mais forte e decolam.
2. **Mergulho:** a lata cai, mergulha no líquido e sobe (`src/product.ts`). Funciona com vídeo ou por código (veja abaixo).
3. **Palavras:** ENERGIA, FOCO, ALTITUDE, IMPULSO correndo com a rolagem.
4. **Sabores:** Original, Ciclone e Zero. As latas são geradas pelo mesmo modelo 3D (`src/can.ts`, rótulo em `src/label.ts`).
5. **Qual é o seu modo?:** escolha um modo e veja a lata recomendada.
6. **Chamada final:** leva ao WhatsApp da ORBYN TECH.

Sabores, modos e textos ficam em `src/brand.ts`.

## Usar um vídeo (ex.: gerado no Kling) na cena do mergulho

Enquanto não houver vídeo, a cena é desenhada por código. Para trocar pelo vídeo:

1. Gere um vídeo de 5 a 8 s, câmera parada, fundo escuro (ex.: lata caindo em câmera lenta num líquido laranja).
2. Transforme em quadros WebP (cerca de 120), com largura de 1280 px:
   `ffmpeg -i video.mp4 -vf "fps=16,scale=1280:-2" -c:v libwebp -quality 72 public/frames/f_%04d.webp`
3. Edite `public/frames/manifest.json` com a quantidade de quadros:
   `{ "count": 120, "pattern": "/frames/f_%04d.webp", "width": 1280, "height": 720 }`

O site passa a usar os quadros automaticamente (o vídeo avança e volta junto com a rolagem).

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Publicado na Vercel como projeto separado, com a pasta `conceitos/voltra` como raiz.

A fonte Anton é distribuída sob a SIL Open Font License (`public/fonts/ANTON-OFL.txt`).
