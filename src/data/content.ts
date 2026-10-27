export type ProcessStep = { title: string; summary: string; detail: string };

/** As cinco etapas do processo da Zaniva, conforme a seção 06 do site. */
export const processSteps: ProcessStep[] = [
  {
    title: 'Diagnóstico',
    summary: 'Entender o negócio antes de propor qualquer coisa.',
    detail:
      'Conversamos sobre o que a empresa faz, quem ela atende e onde a presença digital está travando hoje. Sem diagnóstico, qualquer proposta é chute.',
  },
  {
    title: 'Estratégia',
    summary: 'Definir o escopo, as prioridades e o que fica de fora.',
    detail:
      'Transformamos o diagnóstico em um plano com páginas, funcionalidades e ordem de execução. Combinamos prazo e o que entra em cada etapa antes de começar.',
  },
  {
    title: 'Desenvolvimento',
    summary: 'Construir, mostrar e ajustar ao longo do caminho.',
    detail:
      'O projeto é desenvolvido em etapas visíveis. Você acompanha versões de visualização e aponta ajustes antes de tudo estar pronto, não depois.',
  },
  {
    title: 'Lançamento',
    summary: 'Publicar com tudo testado e explicado.',
    detail:
      'Testamos em celulares, tablets e computadores, publicamos e mostramos como usar o que foi entregue no dia a dia.',
  },
  {
    title: 'Evolução',
    summary: 'Continuar acompanhando depois do no ar.',
    detail:
      'Correções, novas funcionalidades e ajustes conforme o negócio muda. O projeto segue recebendo atenção em vez de envelhecer parado.',
  },
];

export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: 'Quanto custa um projeto com a Zaniva?',
    answer:
      'Depende do escopo: quantidade de páginas, funcionalidades, integrações e conteúdo. Depois de entender o seu projeto, enviamos um orçamento detalhado e sem compromisso.',
  },
  {
    question: 'Quanto tempo leva para ficar pronto?',
    answer:
      'O prazo varia com a complexidade. Uma landing page costuma ser bem mais rápida que um sistema. O cronograma sai na etapa de estratégia e é combinado antes do início.',
  },
  {
    question: 'O site vai funcionar bem no celular?',
    answer:
      'Sim. Cada formato de tela recebe uma composição própria, e não apenas o layout do computador encolhido. Testamos em celulares, tablets e computadores.',
  },
  {
    question: 'Vocês garantem a primeira posição no Google?',
    answer:
      'Não, e desconfie de quem garante. O Google não vende posição no resultado de busca. O que fazemos é organizar o Perfil da Empresa, manter as informações corretas e cuidar da base técnica do site — o que melhora as chances, sem prometer um lugar específico.',
  },
  {
    question: 'O Perfil da Empresa no Google é pago?',
    answer:
      'O perfil em si é gratuito e pertence à sua empresa. O que cobramos é o trabalho de estruturar, manter atualizado e acompanhar avaliações e indicadores.',
  },
  {
    question: 'Dá para atualizar o projeto depois da entrega?',
    answer:
      'Sim. Os projetos são estruturados para evoluir. Atualizações, novas páginas e funcionalidades podem ser combinadas conforme a necessidade.',
  },
  {
    question: 'Como solicitar um orçamento?',
    answer:
      'Fale com a gente pelo WhatsApp ou preencha o formulário de contato. Conte um pouco sobre o que o seu negócio precisa e retornamos com os próximos passos.',
  },
];

/** Seção 02 — Manifesto. */
export const manifesto = {
  title: ['Não criamos apenas presença.', 'Criamos possibilidades.'],
  lead:
    'Um site bonito que ninguém encontra não resolve nada. Um perfil no Google abandonado também não. A presença digital só vale quando as peças conversam entre si.',
  body:
    'A Zaniva nasce da união de duas frentes que normalmente moram em agências diferentes: criação e tecnologia. Quem desenha a experiência é quem entende o que dá para automatizar atrás dela. Isso encurta o caminho entre a ideia e o que realmente vai ao ar.',
  pillars: [
    {
      title: 'Criação',
      text: 'Identidade, interface e experiência pensadas para o seu público, não para um concurso de efeitos.',
    },
    {
      title: 'Tecnologia',
      text: 'Código próprio, performance medida e estrutura que aguenta crescer junto com o negócio.',
    },
    {
      title: 'Automação',
      text: 'Inteligência artificial aplicada onde ela tira trabalho repetitivo de cima de alguém.',
    },
  ],
} as const;

/** Seção 05 — Presença no Google. */
export const googlePresence = {
  title: ['Seu negócio encontrado', 'por quem procura perto.'],
  lead:
    'O Perfil da Empresa no Google costuma ser o primeiro contato de alguém com o seu negócio — antes do site, antes do Instagram. Quando ele está desatualizado, a primeira impressão já sai torta.',
  items: [
    {
      title: 'Informações organizadas',
      text: 'Endereço, horário, telefone, serviços e fotos conferidos e mantidos atualizados.',
    },
    {
      title: 'Avaliações acompanhadas',
      text: 'As avaliações são lidas e respondidas, inclusive as negativas — que é quando mais gente está olhando.',
    },
    {
      title: 'Publicações de rotina',
      text: 'Novidades, serviços e sazonalidades publicados no perfil com regularidade.',
    },
    {
      title: 'Indicadores em mãos',
      text: 'Quantas pessoas viram, ligaram, pediram rota ou abriram o site — acompanhado mês a mês.',
    },
  ],
  /** O que a Zaniva explicitamente NÃO promete. Fica no site, não escondido. */
  honesty:
    'O perfil é gratuito e pertence à sua empresa — não existe posição comprada no resultado de busca. O trabalho é de organização e constância, e é isso que melhora as chances de aparecer para quem procura perto de você.',
} as const;
