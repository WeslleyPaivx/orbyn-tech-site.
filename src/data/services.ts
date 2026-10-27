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
    description:
      'Sites institucionais e landing pages construídos para carregar rápido, funcionar bem no celular e transformar visita em contato.',
    includes: ['Sites institucionais', 'Landing pages', 'Performance e SEO técnico', 'Acessibilidade'],
    icon: 'sites',
    messageLabel: 'um site ou landing page',
  },
  {
    id: 'google',
    number: '02',
    title: 'Google Meu Negócio e presença local',
    description:
      'Organização e manutenção do Perfil da Empresa no Google: informações corretas, fotos, avaliações acompanhadas e indicadores sob o olho.',
    includes: ['Perfil estruturado', 'Rotina de publicações', 'Acompanhamento de avaliações', 'Leitura de indicadores'],
    icon: 'local',
    messageLabel: 'a gestão do Perfil da Empresa no Google',
  },
  {
    id: 'ia',
    number: '03',
    title: 'Inteligência artificial e automações',
    description:
      'Fluxos que tiram da sua equipe o trabalho repetitivo — triagem, resposta, relatório, cadastro — e devolvem o tempo para o que exige gente.',
    includes: ['Automação de processos', 'Integração entre sistemas', 'IA aplicada ao fluxo', 'Relatórios automáticos'],
    icon: 'ai',
    messageLabel: 'automações com inteligência artificial',
  },
  {
    id: 'chatbots',
    number: '04',
    title: 'Chatbots e atendimento inteligente',
    description:
      'Atendimento que responde fora do horário comercial, separa o que é urgente e entrega a conversa pronta para a sua equipe assumir.',
    includes: ['WhatsApp e site', 'Atendimento fora de horário', 'Triagem de contatos', 'Passagem para humano'],
    icon: 'chatbot',
    messageLabel: 'um chatbot ou atendimento automatizado',
  },
  {
    id: 'sistemas',
    number: '05',
    title: 'Sistemas e aplicações',
    description:
      'Painéis, cadastros e sistemas sob medida para quando a planilha já não dá conta e o software pronto não serve.',
    includes: ['Sistemas sob medida', 'Painéis de gestão', 'Áreas restritas', 'Integrações'],
    icon: 'systems',
    messageLabel: 'um sistema ou aplicação web',
  },
  {
    id: 'suporte',
    number: '06',
    title: 'Suporte e evolução digital',
    description:
      'Manutenção, ajustes e consultoria depois da entrega. O projeto continua recebendo atenção em vez de envelhecer sozinho.',
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
