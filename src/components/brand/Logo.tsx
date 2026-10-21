import { SYMBOL_PATH, SYMBOL_VIEWBOX } from './symbolPath';

type SymbolProps = {
  className?: string;
  /** Texto alternativo. Omita quando o símbolo for decorativo. */
  title?: string;
};

/** Símbolo oficial da ORBYN TECH (herda a cor do texto via currentColor). */
export function OrbynSymbol({ className, title }: SymbolProps) {
  return (
    <svg
      viewBox={SYMBOL_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={SYMBOL_PATH} />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md';
};

/**
 * Assinatura completa: símbolo + ORBYN / TECH, como nas peças da marca.
 * O nome é texto real (melhor para acessibilidade e nitidez em qualquer tela).
 */
export function Logo({ className = '', size = 'md' }: LogoProps) {
  const symbol = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8 sm:h-9 sm:w-9';
  const name = size === 'sm' ? 'text-[0.95rem]' : 'text-[1.02rem] sm:text-[1.1rem]';

  return (
    <span className={`inline-flex items-center gap-2.5 text-white ${className}`}>
      <OrbynSymbol className={`${symbol} shrink-0`} />
      <span className="sr-only">ORBYN TECH</span>
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span className={`${name} font-semibold tracking-[0.32em]`}>
          ORBYN
        </span>
        <span
          className="mt-[3px] pl-[0.08em] text-[0.5rem] font-medium tracking-[0.92em] text-mute"
        >
          TECH
        </span>
      </span>
    </span>
  );
}
