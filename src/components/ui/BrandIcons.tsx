type IconProps = { className?: string };

/** Ícone do WhatsApp (traço, no mesmo estilo dos ícones Lucide). */
export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.6L3.5 20.5z" />
      <path d="M9 8.6c0-.3.2-.6.5-.6h.6c.2 0 .4.1.5.3l.7 1.6c.1.2 0 .5-.1.6l-.5.5a5.7 5.7 0 0 0 2.6 2.6l.5-.5c.2-.2.4-.2.6-.1l1.6.7c.2.1.3.3.3.5v.6c0 .3-.3.5-.6.5C11.9 15.4 9 12.5 9 8.6z" />
    </svg>
  );
}

/** Ícone do Instagram. */
export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
