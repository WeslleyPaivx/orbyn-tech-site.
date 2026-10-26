# Saabooor Energético · projeto conceitual

Experiência cinematográfica inspirada no Saabooor Energético da Mansão Maromba, criada pela **Orbyn Tech** como
peça de portfólio. **Não é o site oficial da marca** e não representa campanha ou parceria.

Stack: Vite + TypeScript (sem framework) + GSAP/ScrollTrigger + Canvas 2D. Sem Three.js.

## Estrutura

| Arquivo | Papel |
| --- | --- |
| `src/components/introSequence.ts` | Abertura com o vídeo real da logo (mudo, inline, pular, fallback estático) |
| `src/components/siteHeader.ts` | Cabeçalho fixo e menu do celular |
| `src/components/productDive.ts` | Hero + mergulho controlado pela rolagem (cinco etapas) |
| `src/lib/frames.ts` | Sequência de quadros: download em passes, decodificação só perto do quadro atual |
| `src/components/zeroShowcase.ts` | Seção Original Zero |
| `src/components/experienceModes.ts` | "Qual é o seu modo?" (Zero, Original, Resenha 18+, Noite 18+) |
| `src/components/productGallery.ts` | Vitrine com transição do cartão até o palco |
| `src/data/products.ts` | **Fonte única** de produtos e modos |
| `src/lib/age.ts` | Confirmação de idade da sessão para a linha alcoólica |

## Arquivos de mídia

- `public/video/abertura.mp4` (1440 px) e `abertura-720.mp4` (celular): vídeo da logo enviado, convertido para H.264,
  recortado no centro, pretos limpos, sem áudio.
- `public/frames/d/` (1920 px, 163 quadros) e `public/frames/m/` (1280 px, 82 quadros): vídeo do mergulho,
  com redução de ruído e nitidez. `manifest.json` guarda também o centro da garrafa em cada quadro (enquadramento no celular).
- `public/produtos/*.webp`: recortes das fotografias originais enviadas, sem alterar rótulos, cores ou proporções.

## Pendente

- **Foto do Original Zero 1L.** Enquanto não chega, aparece um espaço reservado. Para trocar:
  salve a foto em `public/produtos/original-zero.webp` e, em `src/data/products.ts`, troque
  `image: null` por `image: '/produtos/original-zero.webp'` e ajuste `ratio` (largura ÷ altura).
- O vídeo do mergulho mostra a garrafa **Original** (rosa). Por isso os textos sobre ele não dizem "zero açúcar".

## Rodar

```bash
npm install
npm run dev
npm run build
```
