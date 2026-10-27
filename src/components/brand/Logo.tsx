import { brand } from '../../config/site';

/**
 * Marca PROVISÓRIA da ZANIVA.
 * ---------------------------------------------------------------------------
 * O briefing é explícito: a logo da Orbyn não pode ser usada como se fosse da
 * nova empresa, e um símbolo provisório não deve ser tratado como definitivo.
 *
 * Por isso aqui não há arquivo de imagem: o símbolo é um "Z" construído em SVG
 * e o nome é tipográfico. Quando a identidade oficial for aprovada, basta
 * preencher `brand.logoSrc` / `brand.symbolSrc` na configuração central e estes
 * dois componentes passam a servir os arquivos — nenhum outro componente muda.
 *
 * O "Z" é montado em três peças (duas barras e a diagonal) para que a diagonal
 * possa receber cor própria, que é o detalhe que separa a marca de um "Z"
 * qualquer de fonte.
 */

type SymbolProps = {
  className?: string;
  /** Texto alternativo. Omita quando o símbolo for decorativo. */
  title?: string;
  /** Cor da diagonal; por padrão acompanha o tom de acento. */
  accent?: string;
};

/** Símbolo da Zaniva. Defina o tamanho pela classe (ex.: h-10 w-10). */
export function ZanivaSymbol({ className = '', title, accent = 'var(--color-orchid)' }: SymbolProps) {
  if (brand.symbolSrc) {
    return (
      <img
        src={brand.symbolSrc}
        alt={title ?? ''}
        aria-hidden={title ? undefined : true}
        width={320}
        height={320}
        decoding="async"
        draggable={false}
        className={`select-none ${className}`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={`select-none ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d="M24,26 H76 V37 H24 Z" fill="currentColor" />
      <path d="M58,37 H76 L42,63 H24 Z" fill={accent} />
      <path d="M24,63 H76 V74 H24 Z" fill="currentColor" />
    </svg>
  );
}

type LogoProps = {
  /** Classes de altura (ex.: 'h-9 lg:h-10'). */
  className?: string;
  /** Mostra "DIGITAL" ao lado do nome. */
  full?: boolean;
};

/** Assinatura horizontal: símbolo + nome em tipografia. */
export function Logo({ className = 'h-9', full = false }: LogoProps) {
  if (brand.logoSrc) {
    return (
      <img
        src={brand.logoSrc}
        alt={full ? `${brand.wordmark} ${brand.wordmarkSuffix}` : brand.wordmark}
        decoding="async"
        draggable={false}
        className={`block w-auto max-w-none select-none ${className}`}
      />
    );
  }

  return (
    <span className={`flex items-center gap-2.5 select-none ${className}`}>
      <ZanivaSymbol className="h-full w-auto text-sky" />
      <span className="flex items-baseline gap-1.5">
        <span className="font-display text-[1.05em] leading-none font-bold tracking-[0.16em] text-sky">
          {brand.wordmark}
        </span>
        {full && (
          <span className="font-display text-[0.6em] leading-none font-medium tracking-[0.22em] text-orchid">
            {brand.wordmarkSuffix}
          </span>
        )}
      </span>
    </span>
  );
}
