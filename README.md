# ORBYN TECH — site institucional

Site oficial da ORBYN TECH: sites, sistemas e aplicações web, chatbots com IA, automações inteligentes e soluções SaaS.

**Stack:** React 18 · TypeScript · Vite 5 · Tailwind CSS 4 · Three.js (WebGL 2 + shaders GLSL) · GSAP ScrollTrigger · publicação na Vercel.

---

## Arquitetura

Página única (one-page) com navegação por âncoras (`/#servicos`, `/#portfolio`, `/#sobre`, `/#contato`). Como não há páginas separadas, o React Router não foi necessário — menos dependências e carregamento mais rápido.

A peça central é uma **escultura 3D** desenhada em WebGL, fixa atrás da página, que se transforma conforme a rolagem (detalhes na seção *Escultura 3D* abaixo). As demais animações (entrada dos textos, menu, acordeões) usam CSS + `IntersectionObserver`.

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
    ├── data/services.ts        As quatro frentes de serviço e as opções do formulário
    ├── data/content.ts         Etapas do processo e FAQ
    ├── three/                  Escultura 3D: OrbynSculpture.ts (motor), shaders.ts (formas), logoCurves.ts
    ├── motion/startScene.ts    Liga a escultura à rolagem (GSAP ScrollTrigger)
    ├── lab.ts + /lab.html      Laboratório isolado da escultura (só em desenvolvimento)
    ├── lib/                    Links do WhatsApp e rolagem suave
    ├── hooks/                  Detecção de seção ativa, entrada na tela, mídia
    └── components/
        ├── brand/              Logo e símbolo
        ├── layout/             Cabeçalho, rodapé, botões flutuantes
        ├── scene/              Canvas da escultura e carregamento progressivo
        ├── sections/           Hero, Serviços, Portfólio, Sobre, Processo, FAQ, Final, Contato
        └── ui/                 Botões, títulos, container, animação de entrada, ícones
```

---

## Identidade visual 2.0

**Logo:** arquivos originais fornecidos, com transparência real, sem redesenho nem efeitos, em `public/brand/`:

- `orbyn-tech-logo.png` (alta resolução) e `orbyn-tech-logo.webp` (versão leve usada no cabeçalho e rodapé)
- `orbyn-symbol.png` (alta resolução) e `orbyn-symbol.webp` (versão leve)

O favicon (`favicon.svg`, `favicon.ico`, `favicon-32.png`) e os ícones do celular (`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`) usam só o símbolo, em branco sobre o preto da marca. A imagem de compartilhamento (`og-image.jpg`) é a versão oficial empilhada sobre fundo escuro.

**Paleta** (tokens em `src/index.css`): preto profundo `#080B10`, grafite `#121820`, branco gelo `#F5F7FA` (substitui o branco puro em todo o site), cinza `#9CA6B5` e ciano `#36DDE8`, usado só em detalhes: ponto final dos títulos, rótulos das seções, foco do teclado, bordas dos cartões no hover e algumas partículas da escultura.

**Animações:** títulos surgindo palavra por palavra, entrada dos blocos ao rolar, camadas geométricas do hero com parallax (desktop), botões magnéticos com brilho, cartões com luz que acompanha o ponteiro, moldura do portfólio com inclinação 3D e a escultura WebGL ligada à rolagem. No celular as animações são mais curtas e o parallax fica desligado; com movimento reduzido, tudo fica estático.

---

## Escultura 3D

Uma única cena WebGL desenha centenas de **filamentos** e milhares de **partículas** que correm por eles. Todas as formas são calculadas na GPU (`src/three/shaders.ts`), então a transformação não recria geometria e funciona igualmente para frente e para trás.

| Seção (`data-stage`) | Composição |
| --- | --- |
| Início | Os fios desenham o símbolo da ORBYN TECH |
| Serviços (`1`) | O símbolo se desfaz e os fios se desenrolam em um feixe que atravessa a tela |
| Portfólio (`2`) | Os fios se reorganizam em uma torre de treliça |
| Sobre nós (`3`) | Os fios se deitam em um horizonte ondulante |
| Final (`4`) | Os fios voltam a desenhar o símbolo (`logoCurves.ts`, contornos extraídos de `public/brand/orbyn-symbol.png`) |

**Desempenho:** o código 3D é baixado depois da primeira pintura (arquivo separado). A densidade é escolhida pelo tipo de aparelho (`src/three/support.ts`) e, se o aparelho não sustentar 50 quadros por segundo, a cena reduz sozinha a quantidade de fios e depois a resolução, sem nunca cortar a taxa de quadros. A animação pausa com a aba em segundo plano.

**Sem WebGL 2** (ou se a cena falhar), o hero mostra o símbolo em órbita em SVG e o restante do site funciona normalmente. **Com movimento reduzido** ativado no sistema, a escultura aparece parada e só troca de composição entre as seções, sem animação.

**Ajustes rápidos:** enquadramento, câmera e brilho de cada composição ficam nas listas `DESKTOP` e `MOBILE` em `OrbynSculpture.ts`; a quantidade de fios e partículas em `QUALITY`. Para experimentar, rode `npm run dev` e abra `http://localhost:5173/lab.html` (controle deslizante entre as composições).

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
| Serviços (quatro frentes) e opções do formulário | `src/data/services.ts` |
| Processo e perguntas frequentes | `src/data/content.ts` |
| Pilares da seção Sobre | `src/components/sections/About.tsx` |
| Título e descrição para o Google | `index.html` |

---

## Portfólio — "Projetos realizados"

A seção já exibe os projetos **ZanFel** e **MABS Contabilidade**, cada um em um card com moldura de navegador desktop, segmento, descrição, categoria e o botão **Explorar projeto** (abre o site em nova aba). No desktop e no tablet os cards ficam lado a lado; no celular, empilhados.

### Adicionar as capturas de tela

1. Abra o site do cliente no computador, em tela cheia (ideal: 1440 px de largura).
2. Faça a captura. Pode ser só a primeira tela ou a **página inteira**: capturas longas rolam devagar dentro da moldura quando o mouse passa por cima.
3. Salve em `public/images/projetos/` (ex.: `zanfel.webp`, `mabs-contabilidade.webp`; `.jpg` ou `.png` também funcionam, de preferência até ~500 KB).
4. Em `src/data/projects.ts`, preencha o campo `image` do projeto: `image: '/images/projetos/zanfel.webp'`.

### Usar a logo do cliente (enquanto não houver captura)

Salve a logo em `public/images/projetos/` (SVG ou PNG com fundo transparente) e preencha `logo: '/images/projetos/zanfel-logo.png'`. A logo aparece centralizada na moldura sobre o fundo definido em `coverBackground`, de preferência um gradiente nas cores da marca, como nos projetos já cadastrados: `coverBackground: 'linear-gradient(135deg, #B6B985 0%, #838B58 48%, #1E3B2A 100%)'`.

Ordem de exibição na moldura: captura de tela → logo → nome do projeto em tipografia.

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
  logo: '/images/projetos/nome-do-cliente-logo.png', // ou ''
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

Veja *Identidade visual 2.0* acima. O componente `src/components/brand/Logo.tsx` exibe os arquivos originais. **Se você tiver a versão vetorial original (SVG, AI, PDF ou EPS)**, basta trocar os arquivos de `public/brand/` mantendo os nomes.

---

## SEO e acessibilidade incluídos

- Título, descrição, canonical, Open Graph e Twitter Card
- Dados estruturados `Organization` (schema.org) com Instagram e WhatsApp
- `sitemap.xml` e `robots.txt` gerados no build
- HTML semântico, um único `h1`, títulos `h2`/`h3` em ordem
- Textos alternativos, `loading="lazy"` nas imagens abaixo da dobra
- Navegação por teclado (menu, abas do processo com setas, acordeões), foco visível, link "Pular para o conteúdo"
- Respeito a `prefers-reduced-motion`

---

## Segurança

O site é estático: não tem servidor, banco de dados, login nem senhas, e o formulário não guarda nada — ele só monta a mensagem e abre o WhatsApp. Mesmo assim, ele foi protegido em camadas:

**Cabeçalhos HTTP (`vercel.json`)**
- `Content-Security-Policy` rígida: o navegador só executa scripts, estilos, fontes e imagens do próprio site. Nada de scripts de terceiros ou inline, sem iframes, sem plugins, e o site não pode ser embutido em outras páginas (`frame-ancestors 'none'`).
- `Strict-Transport-Security`: obriga HTTPS.
- `X-Frame-Options: DENY` e `Cross-Origin-Opener-Policy: same-origin`: protegem contra clickjacking e contra páginas abertas manipularem o site.
- `X-Content-Type-Options`, `Referrer-Policy`, `Cross-Origin-Resource-Policy`, `X-Permitted-Cross-Domain-Policies`.
- `Permissions-Policy`: câmera, microfone, localização, pagamento, USB e sensores ficam desligados.

**Código**
- Fonte Inter servida pelo próprio site (sem Google Fonts): nenhum dado do visitante vai para terceiros ao abrir a página.
- Links externos abrem com `noopener noreferrer`.
- Formulário com limite de tamanho em todos os campos; a mensagem enviada ao WhatsApp remove caracteres invisíveis e de controle.
- Portfólio: só aceita links `https://` e imagens do próprio site — um erro de digitação ou um link `javascript:` no arquivo de projetos é ignorado.
- Sem `dangerouslySetInnerHTML`, sem `eval`, sem mapas de código-fonte publicados.

**Se adicionar algo externo no futuro** (Google Analytics, Meta Pixel, chat, vídeo do YouTube etc.), é preciso liberar o domínio correspondente no `Content-Security-Policy` do `vercel.json`, senão o navegador bloqueia.

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

- Checagem de tipos no modo `strict` e build de produção na Vercel.
- Escultura testada isoladamente no laboratório (5 composições, transições nos dois sentidos, sem erros de WebGL no console) e no site completo em 1920, 1440, 1280 e 390 px de largura.
- Versão sem WebGL e versão com movimento reduzido.
- Links: WhatsApp (todos com o número oficial), Instagram, projetos do portfólio, âncoras do menu, menu mobile (abrir, Esc, rolar até a seção), validação do formulário e ausência de rolagem horizontal.
- Os testes visuais rodaram com WebGL por software (sem placa de vídeo); a fluidez real depende do aparelho, e a qualidade adaptativa cobre aparelhos mais fracos.
