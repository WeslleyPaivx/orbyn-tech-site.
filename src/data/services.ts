export type ServiceIcon = 'sites' | 'local' | 'ai' | 'chatbot' | 'systems' | 'support';

export type Service = {
  id: string;
  /** Numeração editorial exibida no cartão. */
  number: string;
  title: string;
  description: string;
  /** O que entra em cada frente de trabalho. */
  includes: string[];
  icon: ServiceIcon;
  /** Como o serviço aparece na mensagem de WhatsApp. */
  messageLabel: string;
};

/**
 * As seis soluções da ZANIVA DIGITAL, na ordem em que aparecem no site.
 *
 * As descrições são comerciais e concretas, sem promessa de resultado
 * garantido: nada de "primeira posição no Google" ou número de vendas.
 */
export const services: Service[] = [
  {
    id: 'sites',
    number: '01',
    title: 'Sites e experiências web',
    description: 'Sites institucionais e landing pages que realmente impressionam.',
    includes: ['Sites institucionais', 'Landing pages', 'Performance e SEO técnico', 'Acessibilidade'],
    icon: 'sites',
    messageLabel: 'um site ou landing page',
  },
  {
    id: 'google',
    number: '02',
    title: 'Google Meu Negócio e presença local',
    description: 'Mais visibilidade para o seu negócio no Google, Maps e nas buscas.',
    includes: ['Perfil estruturado', 'Rotina de publicações', 'Acompanhamento de avaliações', 'Leitura de indicadores'],
    icon: 'local',
    messageLabel: 'a gestão do Perfil da Empresa no Google',
  },
  {
    id: 'ia',
    number: '03',
    title: 'Inteligência artificial e automações',
    description: 'Processos mais rápidos, inteligentes e eficientes para o seu dia a dia.',
    includes: ['Automação de processos', 'Integração entre sistemas', 'IA aplicada ao fluxo', 'Relatórios automáticos'],
    icon: 'ai',
    messageLabel: 'automações com inteligência artificial',
  },
  {
    id: 'chatbots',
    number: '04',
    title: 'Chatbots e atendimento',
    description: 'Atendimento automático 24 horas, com mais agilidade no primeiro contato.',
    includes: ['WhatsApp e site', 'Atendimento fora de horário', 'Triagem de contatos', 'Passagem para humano'],
    icon: 'chatbot',
    messageLabel: 'um chatbot ou atendimento automatizado',
  },
  {
    id: 'sistemas',
    number: '05',
    title: 'Sistemas e aplicações',
    description: 'Soluções sob medida para as necessidades do seu negócio.',
    includes: ['Sistemas sob medida', 'Painéis de gestão', 'Áreas restritas', 'Integrações'],
    icon: 'systems',
    messageLabel: 'um sistema ou aplicação web',
  },
  {
    id: 'suporte',
    number: '06',
    title: 'Suporte e evolução digital',
    description: 'Manutenção, melhorias e novas funcionalidades para seus projetos.',
    includes: ['Manutenção e correções', 'Novas funcionalidades', 'Consultoria de presença digital', 'Acompanhamento'],
    icon: 'support',
    messageLabel: 'suporte e evolução digital',
  },
];

/** Opções do campo "Tipo de serviço" no formulário. */
export const serviceOptions = [
  'Site institucional',
  'Landing page',
  'Google Meu Negócio e presença local',
  'Automação com inteligência artificial',
  'Chatbot e atendimento automatizado',
  'Sistema ou aplicação web',
  'Suporte e manutenção',
  'Ainda não sei / Outro',
];
