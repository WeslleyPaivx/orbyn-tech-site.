import {
  Fingerprint,
  Gauge,
  Layers,
  MessagesSquare,
  MonitorSmartphone,
  MousePointerClick,
  type LucideIcon,
} from 'lucide-react';

export type Differential = { title: string; description: string; icon: LucideIcon };

export const differentials: Differential[] = [
  {
    title: 'Desenvolvimento personalizado',
    description: 'Cada projeto parte do seu negócio, não de um modelo pronto.',
    icon: Fingerprint,
  },
  {
    title: 'Design moderno e responsivo',
    description: 'Interfaces atuais que se adaptam a celulares, tablets e computadores.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Foco na experiência do usuário',
    description: 'Navegação clara para que seu cliente encontre o que procura sem esforço.',
    icon: MousePointerClick,
  },
  {
    title: 'Performance e otimização',
    description: 'Código enxuto, carregamento rápido e boas práticas de SEO desde o início.',
    icon: Gauge,
  },
  {
    title: 'Comunicação transparente',
    description: 'Você acompanha cada etapa e sabe exatamente o que está sendo feito.',
    icon: MessagesSquare,
  },
  {
    title: 'Soluções pensadas para evoluir',
    description: 'Estrutura preparada para receber novas funcionalidades quando você precisar.',
    icon: Layers,
  },
];

export type ProcessStep = { title: string; summary: string; detail: string };

export const processSteps: ProcessStep[] = [
  {
    title: 'Descoberta',
    summary: 'Entendimento das necessidades do cliente.',
    detail:
      'Conversamos sobre o seu negócio, seu público e seus objetivos para entender o que o projeto precisa resolver.',
  },
  {
    title: 'Planejamento',
    summary: 'Definição da estrutura e funcionalidades.',
    detail:
      'Organizamos páginas, funcionalidades e prioridades em um escopo claro, com prazos e etapas combinados com você.',
  },
  {
    title: 'Design',
    summary: 'Criação da experiência visual.',
    detail:
      'Desenhamos as telas com base na sua identidade visual e validamos com você antes de seguir para o código.',
  },
  {
    title: 'Desenvolvimento',
    summary: 'Implementação e testes.',
    detail:
      'Transformamos o design em uma solução funcional e testamos em diferentes telas, navegadores e cenários de uso.',
  },
  {
    title: 'Entrega',
    summary: 'Publicação e orientações de utilização.',
    detail:
      'Publicamos o projeto e mostramos como utilizá-lo no dia a dia, deixando você seguro para dar os próximos passos.',
  },
];

export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: 'Quanto custa desenvolver um site?',
    answer:
      'O valor depende do escopo: quantidade de páginas, funcionalidades, integrações e conteúdo. Depois de entender o seu projeto, enviamos um orçamento detalhado e sem compromisso.',
  },
  {
    question: 'Quanto tempo leva para criar um projeto?',
    answer:
      'O prazo varia conforme a complexidade. Uma landing page costuma ser mais rápida que um sistema ou aplicativo. O cronograma é definido no planejamento e combinado com você antes do início.',
  },
  {
    question: 'Meu site funcionará no celular?',
    answer:
      'Sim. Todos os projetos são responsivos e testados em celulares, tablets e computadores, com atenção especial à experiência mobile.',
  },
  {
    question: 'Vocês desenvolvem sistemas personalizados?',
    answer:
      'Sim. Desenvolvemos sistemas sob medida, plataformas SaaS e automações para organizar e otimizar processos específicos da sua empresa.',
  },
  {
    question: 'É possível atualizar meu site depois da entrega?',
    answer:
      'Sim. Os projetos são estruturados para evoluir. Atualizações, novas páginas e funcionalidades podem ser combinadas conforme a sua necessidade.',
  },
  {
    question: 'Como solicitar um orçamento?',
    answer:
      'Preencha o formulário de contato ou fale com a gente pelo WhatsApp. Conte um pouco sobre o seu projeto e retornamos com os próximos passos.',
  },
];
