/**
 * Ícones de traço usados no site (substituem a biblioteca de ícones: menos código baixado).
 * Todos herdam a cor do texto e são decorativos (aria-hidden).
 */
import type { ReactNode } from 'react';

type IconProps = { className?: string; strokeWidth?: number };

function Svg({ className, strokeWidth = 1.75, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const CircleAlert = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
  </Svg>
);

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const Send = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z" />
  </Svg>
);

export const Lock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

/* ---------------------------------------------------------------- ícones dos serviços */

export const SitesIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 8.5h18M6 6.25h.01M8.5 6.25h.01" />
    <path d="m10 12-2 2 2 2M14 12l2 2-2 2" />
  </Svg>
);

export const SystemsIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M9 4v16M12.5 9h5M12.5 12.5h5M12.5 16h3" />
  </Svg>
);

export const ChatbotIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12.5a7.5 7.5 0 0 1-11 6.6L4.5 20l1-3.9A7.5 7.5 0 1 1 20 12.5z" />
    <path d="M9 12.5h.01M12.5 12.5h.01M16 12.5h.01" />
  </Svg>
);

export const AutomationIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="5.5" cy="6" r="2.5" />
    <circle cx="18.5" cy="12" r="2.5" />
    <circle cx="5.5" cy="18" r="2.5" />
    <path d="M8 6h3.5a3 3 0 0 1 3 3v.5M8 18h3.5a3 3 0 0 0 3-3v-.5M14.5 12H16" />
  </Svg>
);

export const SaasIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 18.5a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-.5 9H7z" />
    <path d="M12 15.5v-5M9.75 12.5 12 10.25l2.25 2.25" />
  </Svg>
);

/* --- Ícones das soluções da Zaniva ---------------------------------------- */

/** Presença local: alfinete de mapa sobre um traço de rua. */
export const LocalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Z" />
    <circle cx="12" cy="11" r="2.2" />
  </Svg>
);

/** Inteligência artificial e automações: núcleo com nós ligados. */
export const AiIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
  </Svg>
);

/** Suporte e evolução: escudo com seta de continuidade. */
export const SupportIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5.5c0 4 2.9 7.6 7 9.5 4.1-1.9 7-5.5 7-9.5V6l-7-3Z" />
    <path d="M9.5 12.2l1.9 1.9 3.3-3.6" />
  </Svg>
);
