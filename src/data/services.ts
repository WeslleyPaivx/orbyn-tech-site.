export type Service = {
  id: string;
  title: string;
  description: string;
  /** O que entra em cada frente de trabalho. */
  includes: string[];
  /** Como o serviço aparece na mensagem de WhatsApp. */
  messageLabel: string;
};

/** As quatro frentes da ORBYN TECH, na ordem em que aparecem no site. */
export const services: Service[] = [
  {
    id: 'sites',
    title: 'Desenvolvimento de sites',
    description:
      'Sites institucionais e landing pages modernos, rápidos e responsivos, criados para fortalecer a presença digital da sua empresa e transformar visitantes em oportunidades de negócio.',
    includes: ['Sites institucionais', 'Landing pages', 'Catálogos de produtos', 'SEO e performance'],
    messageLabel: 'o desenvolvimento de um site',
  },
  {
    id: 'chatbots',
    title: 'Chatbots inteligentes',
    description:
      'Assistentes virtuais que respondem clientes a qualquer hora, tiram dúvidas frequentes, organizam pedidos de orçamento e encaminham cada conversa para a pessoa certa da sua equipe.',
    includes: ['Atendimento no WhatsApp e no site', 'Respostas 24 horas', 'Triagem de contatos', 'Integração com seus sistemas'],
    messageLabel: 'um chatbot inteligente',
  },
  {
    id: 'automacao-ia',
    title: 'Automação com inteligência artificial',
    description:
      'Soluções inteligentes para agilizar processos, reduzir tarefas repetitivas, melhorar o atendimento e apoiar as decisões da operação da sua empresa.',
    includes: ['Fluxos automáticos', 'Integração entre ferramentas', 'Relatórios e documentos', 'IA aplicada ao seu processo'],
    messageLabel: 'automação com inteligência artificial',
  },
  {
    id: 'sistemas',
    title: 'Sistemas personalizados',
    description:
      'Ferramentas sob medida, plataformas SaaS e aplicativos para Android e iOS que organizam, automatizam e acompanham o crescimento do seu negócio.',
    includes: ['Sistemas sob medida', 'Plataformas SaaS', 'Aplicativos Android e iOS', 'Painéis de gestão'],
    messageLabel: 'um sistema personalizado',
  },
];

/** Opções do campo "Tipo de serviço" no formulário (mais detalhadas que as quatro frentes). */
export const serviceOptions = [
  'Site institucional',
  'Landing page',
  'Chatbot inteligente',
  'Automação com IA',
  'Sistema SaaS',
  'Sistema personalizado',
  'Aplicativo Android e iOS',
  'Ainda não sei / Outro',
];
