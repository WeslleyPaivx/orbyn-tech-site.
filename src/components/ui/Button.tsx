import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * O site alterna entre fundo claro (hero, sobre a paisagem) e fundo escuro
 * (demais seções), então cada variante declara em qual fundo ela vive:
 *   - `primary`   violeta sólido, legível nos dois fundos
 *   - `outline`   contorno ameixa, para usar SOBRE FUNDO CLARO
 *   - `onDark`    contorno claro, para usar SOBRE FUNDO ESCURO
 */
type Variant = 'primary' | 'outline' | 'onDark' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap ' +
  'transition-[background-color,color,border-color,box-shadow] duration-300 ease-[var(--ease-soft)] ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none [text-shadow:none]';

const variants: Record<Variant, string> = {
  primary:
    'btn-shine bg-violet text-sky hover:bg-plum hover:shadow-[0_0_0_4px_rgb(121_56_116/0.18)]',
  outline:
    'border border-plum/25 text-plum hover:border-violet hover:bg-violet/[0.07]',
  onDark:
    'border border-sky/20 text-sky hover:border-orchid/60 hover:bg-orchid/[0.08]',
  ghost: 'text-sky hover:text-orchid',
};

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-[0.9rem]',
  lg: 'min-h-12 px-6 text-[0.95rem] sm:min-h-[3.25rem] sm:px-7',
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean };

/** Link com aparência de botão. `external` abre em nova aba com segurança. */
export function ButtonLink({
  variant,
  size,
  className,
  external,
  children,
  ...rest
}: LinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a className={buttonClasses(variant, size, className)} {...externalProps} {...rest}>
      {children}
    </a>
  );
}

type BtnProps = Common & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, className, children, type = 'button', ...rest }: BtnProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
