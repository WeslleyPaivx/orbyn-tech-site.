type EyebrowProps = {
  /** Número da seção, ex.: "02". */
  index?: string;
  label: string;
  className?: string;
};

/** Rótulo de seção: número em branco, traço de respiro e o nome em rosa. */
export function Eyebrow({ index, label, className = '' }: EyebrowProps) {
  return (
    <p className={`eyebrow-z ${className}`}>
      {index && <b>{index}</b>}
      {label}
    </p>
  );
}
