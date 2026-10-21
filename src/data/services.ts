import {
  BrainCircuit,
  Cloud,
  CodeXml,
  LayoutPanelTop,
  Smartphone,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Como o serviço aparece na mensagem de WhatsApp. */
  messageLabel: string;
};

export const services: Service[] = [
  {
    id: 'sites',
    title: 'Sites institucionais',
    description:
      'Sites modernos, responsivos e profissionais para fortalecer a presença digital da sua empresa.',
    icon: CodeXml,
    messageLabel: 'um site institucional',
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    description:
      'Páginas estratégicas desenvolvidas para transformar visitantes em oportunidades de negócio.',
    icon: LayoutPanelTop,
    messageLabel: 'uma landing page',
  },
  {
    id: 'saas',
    title: 'Sistemas SaaS',
    description:
      'Plataformas digitais escaláveis e personalizadas para diferentes necessidades empresariais.',
    icon: Cloud,
    messageLabel: 'um sistema SaaS',
  },
  {
    id: 'sistemas',
    title: 'Sistemas personalizados',
    description: 'Ferramentas sob medida para organizar, automatizar e otimizar processos.',
    icon: Workflow,
    messageLabel: 'um sistema personalizado',
  },
  {
    id: 'aplicativos',
    title: 'Aplicativos',
    description: 'Experiências mobile modernas e intuitivas para Android e iOS.',
    icon: Smartphone,
    messageLabel: 'um aplicativo para Android e iOS',
  },
  {
    id: 'automacao-ia',
    title: 'Automação e IA',
    description:
      'Soluções inteligentes para agilizar processos, melhorar o atendimento e apoiar a operação da sua empresa.',
    icon: BrainCircuit,
    messageLabel: 'automação e inteligência artificial',
  },
];

/** Opções do campo "Tipo de serviço" no formulário. */
export const serviceOptions = [...services.map((s) => s.title), 'Ainda não sei / Outro'];
