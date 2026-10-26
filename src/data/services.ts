export type ServiceIcon = 'sites' | 'systems' | 'chatbot' | 'automation' | 'saas';

export type Service = {
  id: string;
  title: string;
  description: string;
  /** O que entra em cada frente de trabalho. */
  includes: string[];
  icon: ServiceIcon;
  /** Como o serviço aparece na mensagem de WhatsApp. */
  messageLabel: string;
};

/** Os cinco serviços da ORBYN TECH, na ordem em que aparecem no site. */
export const services: Service[] = [
  {
    id: 'sites',
    title: 'Desenvolvimento de Sites',
    description: 'Sites profissionais, responsivos e personalizados.',
    includes: ['Sites institucionais', 'Landing pages', 'Catálogos', 'SEO e performance'],
    icon: 'sites',
    messageLabel: 'o desenvolvimento de um site',
  },
  {
    id: 'sistemas',
    title: 'Sistemas e Aplicações Web',
    description: 'Soluções digitais desenvolvidas conforme a necessidade de cada negócio.',
    includes: ['Sistemas sob medida', 'Painéis de gestão', 'Aplicativos', 'Integrações'],
    icon: 'systems',
    messageLabel: 'um sistema ou aplicação web',
  },
  {
    id: 'chatbots',
    title: 'Chatbots com Inteligência Artificial',
    description: 'Atendimento automatizado e integração com canais comerciais.',
    includes: ['WhatsApp e site', 'Atendimento 24 horas', 'Triagem de contatos'],
    icon: 'chatbot',
    messageLabel: 'um chatbot com inteligência artificial',
  },
  {
    id: 'automacoes',
    title: 'Automações Inteligentes',
    description: 'Otimização de processos e redução de tarefas repetitivas.',
    includes: ['Fluxos automáticos', 'Relatórios e documentos', 'IA aplicada ao processo'],
    icon: 'automation',
    messageLabel: 'automações inteligentes',
  },
  {
    id: 'saas',
    title: 'Soluções SaaS',
    description: 'Plataformas digitais e sistemas disponibilizados pela internet.',
    includes: ['Plataformas por assinatura', 'Acesso de qualquer lugar', 'Escalável'],
    icon: 'saas',
    messageLabel: 'uma solução SaaS',
  },
];

/** Opções do campo "Tipo de serviço" no formulário. */
export const serviceOptions = [
  'Site institucional',
  'Landing page',
  'Sistema ou aplicação web',
  'Chatbot com IA',
  'Automação inteligente',
  'Solução SaaS',
  'Aplicativo Android e iOS',
  'Ainda não sei / Outro',
];
