# ORBYN TECH — site institucional

Site oficial da ORBYN TECH: sites, landing pages, sistemas SaaS, sistemas personalizados, aplicativos e automação com IA.

**Stack:** React 18 · TypeScript · Vite 5 · Tailwind CSS 4 · Lucide React · publicação na Vercel.

---

## Arquitetura

Página única (one-page) com navegação por âncoras (`/#servicos`, `/#portfolio`, `/#sobre`, `/#contato`). Como não há páginas separadas, o React Router não foi necessário — menos dependências e carregamento mais rápido.

As animações (entrada ao rolar, menu, acordeões, linha do tempo, órbita do hero) usam CSS + `IntersectionObserver`, sem biblioteca de animação. Isso mantém o JavaScript pequeno e respeita automaticamente a preferência por movimento reduzido do sistema. Se no futuro quiser animações mais complexas, o pacote `motion` pode ser adicionado sem mudar a estrutura.

```
orbyn-tech/
├── index.html                  SEO: título, descrição, Open Graph, dados estruturados
├── vite.config.ts              Gera sitemap.xml e robots.txt no build
├── vercel.json                 Cabeçalhos de cache e segurança
├── public/
│   ├── brand/                  Símbolo oficial (SVG branco, SVG preto, PNG transparente)
│   ├── images/                 Imagens do site (coloque aqui as dos projetos)
│   ├── favicon.svg / .png      Favicon a partir do símbolo oficial
│   ├── apple-touch-icon.png
│   └── og-image.jpg            Imagem de compartilhamento (1200 × 630)
└── src/
    ├── config/site.ts          ⭐ Nome, WhatsApp, Instagram, mensagens automáticas, menu
    ├── data/projects.ts        ⭐ Projetos do portfólio
    ├── data/services.ts        Os seis serviços
    ├── data/content.ts         Diferenciais, etapas do processo e FAQ
    ├── lib/                    Links do WhatsApp e rolagem suave
    ├── hooks/                  Detecção de seção ativa, entrada na tela, mídia
    └── components/
        ├── brand/              Logo e símbolo
        ├── layout/             Cabeçalho, rodapé, botões flutuantes
        ├── sections/           Hero, Serviços, Portfólio, Diferenciais, Processo, Sobre, FAQ, Contato
        └── ui/                 Botões, títulos, container, animação de entrada, ícones
```

---

## Rodar no computador

Requisito: Node.js 18.18 ou superior.

```bash
npm install
npm run dev        # abre em http://localhost:5173
npm run build      # checa os tipos (TypeScript) e gera a pasta dist/
npm run preview    # testa a versão de produção em http://localhost:4173
```

---

## Publicar na Vercel

1. Envie esta pasta para um repositório no GitHub.
2. Na Vercel, clique em **Add New → Project** e importe o repositório. O framework **Vite** é detectado automaticamente (o `vercel.json` já define build `npm run build` e saída `dist`).
3. Clique em **Deploy**.

**Domínio próprio:** em *Settings → Domains*, adicione o domínio. Depois, em *Settings → Environment Variables*, crie `SITE_URL` com o endereço completo (ex.: `https://www.seudominio.com.br`) e faça um novo deploy. Sem essa variável, o site usa automaticamente a URL de produção da Vercel no canonical, Open Graph, `sitemap.xml` e `robots.txt`.

---

## Atualizar informações

Tudo que é texto institucional fica em arquivos de dados — não é preciso mexer nos componentes.

| O quê | Onde |
| --- | --- |
| WhatsApp, Instagram, slogans, mensagens automáticas | `src/config/site.ts` |
| Serviços | `src/data/services.ts` |
| Diferenciais, processo e perguntas frequentes | `src/data/content.ts` |
| Título e descrição para o Google | `index.html` |

---

## Portfólio — "Projetos realizados"

A seção já exibe os projetos **ZanFel** e **MABS Contabilidade**, cada um em um card com moldura de navegador desktop, segmento, descrição, categoria e o botão **Explorar projeto** (abre o site em nova aba). No desktop e no tablet os cards ficam lado a lado; no celular, empilhados.

### Adicionar as capturas de tela

1. Abra o site do cliente no computador, em tela cheia (ideal: 1440 px de largura).
2. Faça a captura. Pode ser só a primeira tela ou a **página inteira**: capturas longas rolam devagar dentro da moldura quando o mouse passa por cima.
3. Salve em `public/images/projetos/` (ex.: `zanfel.webp`, `mabs-contabilidade.webp`; `.jpg` ou `.png` também funcionam, de preferência até ~500 KB).
4. Em `src/data/projects.ts`, preencha o campo `image` do projeto: `image: '/images/projetos/zanfel.webp'`.

Enquanto `image` estiver vazio, o card mostra uma capa com o nome do projeto dentro da moldura, sem nenhuma imagem genérica.

### Adicionar um novo cliente

Em `src/data/projects.ts`, copie um dos projetos da lista `projects` e altere os campos:

```ts
{
  id: 'nome-do-cliente',            // sem espaços
  name: 'Nome do cliente',
  segment: 'Ramo de atuação',
  category: 'Site institucional',   // ou Landing page, Sistema SaaS, Aplicativo...
  description: 'Uma ou duas frases sobre o que foi desenvolvido.',
  image: '/images/projetos/nome-do-cliente.webp', // ou '' até ter a captura
  imageAlt: 'Página inicial do site do cliente',
  technologies: [],                 // opcional, ex.: ['React', 'Tailwind CSS']
  url: 'https://site-do-cliente.com.br',
  featured: true,                   // destaques aparecem primeiro
  status: 'publicado',              // 'rascunho' oculta o projeto
},
```

Salve (ou faça commit no GitHub) e a Vercel publica a nova versão sozinha. A partir de 4 projetos com categorias diferentes, aparecem filtros por categoria automaticamente.

---

## Logo

O símbolo oficial foi vetorizado a partir da arte enviada e está em:

- `public/brand/orbyn-symbol.svg` (branco, fundo transparente)
- `public/brand/orbyn-symbol-black.svg` (preto, fundo transparente)
- `public/brand/orbyn-symbol.png` (1024 px, fundo transparente)
- `src/components/brand/symbolPath.ts` (versão usada no cabeçalho, rodapé e hero)

O nome "ORBYN / TECH" ao lado do símbolo é texto real, no mesmo arranjo das peças da marca.

**Se você tiver o arquivo vetorial original (SVG, AI, PDF ou EPS)**, substitua o `viewBox` e o `path` em `symbolPath.ts` e os arquivos de `public/brand/` e `public/favicon.svg` — o restante do site se ajusta sozinho. Os PNGs de favicon (`favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`) podem ser gerados em realfavicongenerator.net a partir do novo SVG.

---

## SEO e acessibilidade incluídos

- Título, descrição, canonical, Open Graph e Twitter Card
- Dados estruturados `Organization` (schema.org) com Instagram e WhatsApp
- `sitemap.xml` e `robots.txt` gerados no build
- HTML semântico, um único `h1`, títulos `h2`/`h3` em ordem
- Textos alternativos, `loading="lazy"` nas imagens abaixo da dobra
- Navegação por teclado (menu, abas do processo com setas, acordeões), foco visível, link "Pular para o conteúdo"
- Respeito a `prefers-reduced-motion`
- Cabeçalhos de cache longos para `/assets` e cabeçalhos básicos de segurança

---

## Painel administrativo (futuro)

Nesta versão os projetos são editados no arquivo `projects.ts` — sem custo e sem risco de segurança. Quando quiser editar pelo navegador, há dois caminhos:

### Opção 1 — CMS baseado em Git (gratuito, mais simples)

Ferramentas como **Decap CMS** ou **TinaCMS** criam uma página `/admin` que edita um arquivo `projects.json` no próprio repositório do GitHub. Cada alteração vira um commit e a Vercel republica o site.

- **Autenticação:** login com GitHub (só quem tem acesso ao repositório edita).
- **Banco de dados:** não precisa; os dados ficam no repositório.
- **Imagens:** enviadas para `public/images/projetos/` pelo próprio painel.
- **Mudança no código:** trocar `projects.ts` por `projects.json` com a mesma estrutura.

### Opção 2 — Painel próprio com backend (mais flexível)

Indicado se várias pessoas forem editar ou se o portfólio crescer bastante. Exemplo com **Supabase** (plano gratuito):

- **Autenticação:** Supabase Auth com e-mail/senha ou link mágico, de preferência com 2FA; apenas usuários com papel `admin` acessam `/admin`.
- **Banco de dados:** tabela `projects` com os mesmos campos de `Project` (id, name, description, category, image, technologies, url, featured, status, created_at).
- **Armazenamento de imagens:** bucket `projetos` no Supabase Storage, leitura pública e upload só para administradores; validar tipo (`image/webp`, `image/jpeg`, `image/png`) e tamanho (ex.: até 2 MB).
- **Segurança:**
  - Row Level Security: leitura pública apenas de `status = 'publicado'`; inserir/editar/excluir apenas para `admin`.
  - No navegador, somente a chave pública (`anon`); a chave `service_role` nunca vai para o front-end.
  - Validação dos campos também no banco (constraints) e URLs apenas `https://`.
  - Proteção contra excesso de requisições e registro de alterações.
- **No site:** o componente de portfólio passa a buscar os projetos do Supabase, mantendo `projects.ts` como reserva caso a consulta falhe. Os componentes visuais continuam os mesmos.
- **Rotas:** com `/admin`, adicionar React Router e um `rewrite` no `vercel.json` para `index.html`.

---

## Verificação feita nesta entrega

- Compilação de todo o código-fonte e checagem de tipos no modo `strict`.
- Testes automatizados no navegador (celular 390 px e desktop 1440 px): menu mobile (abrir, fechar, Esc, travar rolagem, rolar até a seção), destaque da seção ativa, validação e máscara do formulário, mensagem enviada ao WhatsApp, os 20 links de WhatsApp e 4 do Instagram, âncoras internas, linha do tempo (clique e setas do teclado), FAQ, estado vazio e filtros do portfólio, movimento reduzido e ausência de rolagem horizontal.

Antes de publicar, rode `npm install && npm run build` uma vez no seu computador (ou deixe a Vercel rodar) para confirmar a instalação das dependências oficiais.
