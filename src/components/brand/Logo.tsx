/**
 * Marca oficial da ORBYN TECH (identidade 2.0).
 * Usa os arquivos originais fornecidos, com transparência real, sem redesenho nem efeitos.
 *   /brand/orbyn-tech-logo.webp  logo horizontal (símbolo + ORBYN TECH), proporção 1363 × 362
 *   /brand/orbyn-symbol.webp     somente o símbolo, proporção 1 × 1
 * Os arquivos em alta resolução (PNG) ficam ao lado, em /public/brand.
 */
const LOGO_RATIO = 1363 / 362;

type SymbolProps = {
  className?: string;
  /** Texto alternativo. Omita quando o símbolo for decorativo. */
  title?: string;
};

/** Símbolo oficial da ORBYN TECH. Defina o tamanho pela classe (ex.: h-10 w-10). */
export function OrbynSymbol({ className = '', title }: SymbolProps) {
  return (
    <img
      src="/brand/orbyn-symbol.webp"
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

type LogoProps = {
  /** Classes de altura (ex.: 'h-9 lg:h-10'); a largura acompanha a proporção original. */
  className?: string;
  /** Carregamento prioritário (cabeçalho; o index.html também pré-carrega o arquivo). */
  priority?: boolean;
};

/** Logo horizontal oficial. Largura calculada pela proporção original para evitar mudança de layout. */
export function Logo({ className = 'h-10', priority = false }: LogoProps) {
  const height = 144;
  const width = Math.round(height * LOGO_RATIO);
  return (
    <img
      src="/brand/orbyn-tech-logo.webp"
      alt="ORBYN TECH"
      width={width}
      height={height}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      draggable={false}
      className={`block w-auto max-w-none select-none ${className}`}
    />
  );
}
