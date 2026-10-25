import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap ' +
  'transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-soft)] ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none [text-shadow:none]';

const variants: Record<Variant, string> = {
  primary: 'bg-white text-ink hover:bg-[#e6e6e6]',
  outline: 'border border-line text-white hover:border-white/60 hover:bg-white/[0.04]',
  ghost: 'text-white hover:text-mute',
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
