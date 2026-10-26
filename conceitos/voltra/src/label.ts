import type { Flavor } from './brand';

/**
 * Emblema da VOLTRA: duas asas angulares formando um "V".
 * Desenhado por código, usado no rótulo da lata e no favicon.
 */
export function drawEmblem(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 100, size / 100);
  ctx.fillStyle = color;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side, 1);
    // Três lâminas por asa, da maior (externa) para a menor
    const blades = [
      [6, 30, 92, -22, 70, -6, 16, 38],
      [8, 40, 74, -2, 56, 12, 16, 46],
      [10, 50, 54, 18, 40, 28, 16, 54],
    ];
    for (const b of blades) {
      ctx.beginPath();
      ctx.moveTo(b[0], b[1]);
      ctx.lineTo(b[2], b[3]);
      ctx.lineTo(b[4], b[5]);
      ctx.lineTo(b[6], b[7]);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  // Ponta do V
  ctx.beginPath();
  ctx.moveTo(-10, 40);
  ctx.lineTo(10, 40);
  ctx.lineTo(0, 66);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Rótulo da lata (envolve o cilindro inteiro): frente com logo e sabor,
 * verso com o aviso de marca fictícia.
 */
export function createLabelCanvas(flavor: Flavor, width = 1024, height = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const { base, band, text, accent } = flavor.can;

  // Fundo com leve gradiente vertical
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, shade(base, 0.12));
  bg.addColorStop(0.5, base);
  bg.addColorStop(1, shade(base, -0.18));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Faixa elétrica diagonal que dá a volta na lata
  ctx.save();
  ctx.fillStyle = band;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.66);
  ctx.lineTo(width, height * 0.5);
  ctx.lineTo(width, height * 0.6);
  ctx.lineTo(0, height * 0.76);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.79);
  ctx.lineTo(width, height * 0.63);
  ctx.lineTo(width, height * 0.645);
  ctx.lineTo(0, height * 0.805);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Frente (centro do rótulo)
  const cx = width * 0.5;
  drawEmblem(ctx, cx, height * 0.15, height * 0.19, accent);

  ctx.fillStyle = text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${Math.round(height * 0.24)}px Anton, Impact, sans-serif`;
  ctx.fillText('VOLTRA', cx, height * 0.54);

  ctx.font = `${Math.round(height * 0.075)}px Anton, Impact, sans-serif`;
  ctx.fillStyle = flavor.id === 'zero' ? '#F4F5F7' : base;
  ctx.fillText(flavor.name.toUpperCase(), cx, height * 0.685);

  ctx.fillStyle = text;
  ctx.globalAlpha = 0.85;
  ctx.font = `600 ${Math.round(height * 0.04)}px system-ui, sans-serif`;
  ctx.fillText('ENERGY DRINK  ·  473 ml', cx, height * 0.9);
  ctx.globalAlpha = 1;

  // Verso: aviso de conceito
  ctx.save();
  ctx.fillStyle = text;
  ctx.globalAlpha = 0.6;
  ctx.font = `600 ${Math.round(height * 0.032)}px system-ui, sans-serif`;
  const back = width * 0.02;
  ['PROJETO CONCEITUAL', 'MARCA FICTÍCIA', 'ORBYN TECH'].forEach((line, i) => {
    ctx.fillText(line, back + width * 0.08, height * (0.3 + i * 0.06));
    ctx.fillText(line, width - back - width * 0.08, height * (0.3 + i * 0.06));
  });
  ctx.restore();

  return canvas;
}

/** Clareia (amount > 0) ou escurece (amount < 0) uma cor hexadecimal. */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount))));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
