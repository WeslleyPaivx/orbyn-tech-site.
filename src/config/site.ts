/**
 * ZANIVA DIGITAL — fonte única de verdade da identidade.
 * ---------------------------------------------------------------------------
 * Altere aqui e todo o site acompanha: cabeçalho, rodapé, botões, metadados
 * e mensagens do WhatsApp. Nenhum componente precisa ser editado.
 *
 * ATENÇÃO — itens herdados da ORBYN TECH que ainda precisam de confirmação:
 *   - instagram: o perfil abaixo ainda é o da Orbyn. Troque quando o perfil
 *     da Zaniva existir. Não foi inventado um handle novo de propósito.
 *   - whatsapp: número real preservado do projeto anterior.
 */

export const site = {
  name: 'ZANIVA',
  fullName: 'ZANIVA DIGITAL',
  /** Frase de assinatura, usada no hero e nos metadados. */
  slogan: 'O digital ganha uma nova dimensão.',
  description:
    'Unimos estratégia, tecnologia e criatividade para transformar a presença digital de negócios.',
  seoDescription:
    'A Zaniva Digital desenvolve sites e landing pages, sistemas e aplicações web, automações com inteligência artificial, chatbots e gestão do Perfil da Empresa no Google.',
  whatsapp: {
    /** Somente dígitos, com DDI e DDD. */
    number: '5511948108450',
    display: '+55 11 94810-8450',
  },
  instagram: {
    /** TODO: substituir pelo perfil da Zaniva quando existir. */
    handle: '@orbyn.tech',
    url: 'https://www.instagram.com/orbyn.tech/',
  },
  founders: [
    { name: 'Weslley Paiva', photo: '' },
    { name: 'Dener Zanetoni', photo: '' },
  ],
} as const;

/**
 * Marca visual. O símbolo é PROVISÓRIO — um wordmark tipográfico com um "Z"
 * construído, mantido separado dos componentes justamente para poder ser
 * trocado pela identidade oficial sem refatoração.
 */
export const brand = {
  isProvisional: true,
  wordmark: 'ZANIVA',
  wordmarkSuffix: 'DIGITAL',
  /** Quando houver arquivo oficial, aponte aqui e o componente Logo o usa. */
  logoSrc: '',
  symbolSrc: '',
} as const;

/** Mídia da paisagem Pink Grass, já otimizada para web. */
export const heroMedia = {
  videoLarge: '/media/hero-1920.mp4',
  videoSmall: '/media/hero-960.mp4',
  poster: '/media/hero-poster.webp',
  blur: '/media/hero-blur.webp',
  /** Proporção nativa do material (2892×2160). */
  aspectRatio: 1920 / 1434,
  alt:
    'Paisagem de colinas cobertas por capim rosa e violeta, com pedras escuras e céu claro.',
} as const;

/** Mensagens pré-preenchidas enviadas ao abrir o WhatsApp. */
export const whatsappMessages = {
  quote: 'Olá, Zaniva! Gostaria de solicitar um orçamento para um projeto digital.',
  floating: 'Olá, Zaniva! Vim pelo site e tenho interesse nos serviços de vocês.',
  google: 'Olá, Zaniva! Quero melhorar a presença da minha empresa no Google.',
  service: (service: string) =>
    `Olá, Zaniva! Tenho interesse em ${service} e gostaria de solicitar um orçamento.`,
} as const;

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'solucoes', label: 'Soluções' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'processo', label: 'Processo' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
];
