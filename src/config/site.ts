/**
 * Informações oficiais da ORBYN TECH.
 * Altere aqui e todo o site é atualizado (cabeçalho, rodapé, botões e formulário).
 */
export const site = {
  name: 'ORBYN TECH',
  slogan: 'Grandes ideias merecem grandes soluções digitais.',
  altSlogan: 'Seu projeto digital começa aqui.',
  description:
    'Agência de tecnologia especializada em soluções digitais personalizadas: sites, landing pages, sistemas, aplicativos e automação com inteligência artificial.',
  whatsapp: {
    /** Somente dígitos, com DDI e DDD. */
    number: '5511948108450',
    display: '+55 11 94810-8450',
  },
  instagram: {
    handle: '@orbyn.tech',
    url: 'https://www.instagram.com/orbyn.tech/',
  },
} as const;

/** Mensagens pré-preenchidas enviadas ao abrir o WhatsApp. */
export const whatsappMessages = {
  quote: 'Olá, ORBYN TECH! Gostaria de solicitar um orçamento para um projeto digital.',
  floating: 'Olá, ORBYN TECH! Vim pelo site e tenho interesse nos serviços de vocês.',
  service: (service: string) =>
    `Olá, ORBYN TECH! Tenho interesse em ${service} e gostaria de solicitar um orçamento.`,
} as const;

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'sobre', label: 'Sobre nós' },
  { id: 'contato', label: 'Contato' },
];
