# Pixel Obra — Site Institucional

> Plataforma web institucional da **Pixel Obra**, empresa especializada em visualização arquitetônica com IA. O site apresenta os serviços de renderização, animação, decoração e modelagem 3D com foco em imóveis e projetos de arquitetura.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Páginas e Rotas](#páginas-e-rotas)
- [Backend (API)](#backend-api)
- [Banco de Dados](#banco-de-dados)
- [Autenticação](#autenticação)
- [Inteligência Artificial](#inteligência-artificial)
- [Armazenamento](#armazenamento)
- [E-mail](#e-mail)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar](#como-rodar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Design System](#design-system)

---

## Visão Geral

O **Pixel Obra Web** é um site institucional full-stack construído em TypeScript com React no frontend e Express no backend. O sistema oferece:

- Página institucional com apresentação dos serviços de IA para arquitetura
- Formulário de contato com envio de e-mail automático
- Autenticação OAuth com gestão de sessão via JWT
- Integração com LLM (Gemini 2.5 Flash) para funcionalidades de IA
- Banco de dados MySQL gerenciado via Drizzle ORM
- Design Glassmorphism Arquitetônico (tema escuro com acentos em cyan `#00D4FF`)

---

## Tecnologias

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | 19 | Framework UI |
| TypeScript | 5.9 | Tipagem estática |
| Vite | 7 | Bundler e servidor de desenvolvimento |
| Tailwind CSS | 4 | Estilização |
| Wouter | 3.3 | Roteamento SPA |
| Radix UI | variado | Componentes acessíveis |
| Framer Motion | 12 | Animações |
| TanStack Query | 5 | Cache e gerenciamento de estado servidor |
| tRPC Client | 11 | Tipagem end-to-end para API calls |
| React Hook Form + Zod | 7 / 4 | Formulários com validação |
| Recharts | 2 | Gráficos |
| next-themes | 0.4 | Modo escuro/claro |

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Node.js + TypeScript | — | Runtime servidor |
| Express | 4 | Servidor HTTP |
| tRPC | 11 | API type-safe |
| Drizzle ORM | 0.44 | ORM para MySQL |
| MySQL2 | 3 | Driver banco de dados |
| Nodemailer | 8 | Envio de e-mails (Gmail SMTP) |
| jose | 6 | JWT (assinar e verificar sessões) |
| Axios | 1 | HTTP client para serviços externos |
| AWS SDK S3 | 3 | Integração com armazenamento S3 |

---

## Estrutura do Projeto

```
pixelobraweb/
├── client/                   # Frontend React
│   ├── index.html
│   ├── public/               # Arquivos estáticos (imagens, favicon)
│   └── src/
│       ├── App.tsx           # Roteador principal
│       ├── main.tsx          # Ponto de entrada React
│       ├── index.css         # Estilos globais + Design Tokens
│       ├── const.ts          # Constantes do cliente
│       ├── pages/            # Páginas (uma por rota)
│       ├── components/       # Componentes reutilizáveis
│       │   └── ui/           # Primitivos de UI (Radix/shadcn)
│       ├── contexts/         # Contexts: Tema e Idioma
│       ├── hooks/            # Hooks customizados
│       └── lib/              # Utilitários (cn, trpc client, etc.)
│
├── server/                   # Backend Express
│   ├── index.ts              # Ponto de entrada (apenas re-exporta _core)
│   ├── routers.ts            # tRPC router raiz (auth + contact)
│   ├── db.ts                 # Conexão MySQL + funções de usuário
│   ├── email.ts              # Envio de e-mail via Gmail SMTP
│   ├── storage.ts            # Upload/download de arquivos
│   └── _core/               # Infraestrutura interna do servidor
│       ├── index.ts          # Bootstrap do servidor Express
│       ├── context.ts        # Contexto tRPC (req, res, user)
│       ├── cookies.ts        # Helpers para cookies de sessão
│       ├── dataApi.ts        # API de dados interna
│       ├── env.ts            # Variáveis de ambiente centralizadas
│       ├── imageGeneration.ts# Geração de imagens via IA
│       ├── llm.ts            # Abstração para chamadas ao LLM
│       ├── map.ts            # Integração com Google Maps
│       ├── notification.ts   # Sistema de notificações
│       ├── oauth.ts          # Fluxo OAuth
│       ├── sdk.ts            # SDK de autenticação (JWT + OAuth)
│       ├── systemRouter.ts   # Rotas do sistema (OAuth callback)
│       ├── trpc.ts           # Configuração tRPC (router, procedure)
│       ├── vite.ts           # Middleware Vite para desenvolvimento
│       └── voiceTranscription.ts # Transcrição de voz
│
├── drizzle/                  # Banco de dados
│   ├── schema.ts             # Definição das tabelas
│   ├── relations.ts          # Relações entre tabelas
│   └── migrations/           # Migrações SQL geradas
│
├── shared/                   # Código compartilhado (client + server)
│   ├── const.ts              # Constantes compartilhadas (cookie name, timeouts)
│   ├── types.ts              # Tipos compartilhados
│   └── _core/               # Utilitários core compartilhados (errors, etc.)
│
├── api/                      # Handler Vercel (deploy serverless)
├── patches/                  # Patches de dependências (wouter)
├── vite.config.ts            # Configuração Vite
├── drizzle.config.ts         # Configuração Drizzle Kit
├── tsconfig.json             # Configuração TypeScript
├── .env                      # Variáveis de ambiente (não commitado)
└── package.json              # Dependências e scripts
```

---

## Páginas e Rotas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Home.tsx` | Página principal institucional |
| `/portfolio` | `Portfolio.tsx` | Portfólio de projetos realizados |
| `/renderiza` | `Renderiza.tsx` | Serviço: Renderização 3D com IA |
| `/visualiza` | `Visualiza.tsx` | Serviço: Visualização de ambientes |
| `/decora` | `Decora.tsx` | Serviço: Decoração virtual |
| `/amplia` | `Amplia.tsx` | Serviço: Ampliação de espaços |
| `/edita` | `Edita.tsx` | Serviço: Edição de imagens |
| `/adiciona` | `Adiciona.tsx` | Serviço: Adição de elementos |
| `/anima` | `Anima.tsx` | Serviço: Animação arquitetônica |
| `/solucoes` | `Solucoes.tsx` | Página de soluções completas |
| `/humanizada` | `Humanizada.tsx` | Serviço: Humanização de renders |
| `/login` | `Login.tsx` | Autenticação OAuth |
| `/aviso-legal` | `AvisoLegal.tsx` | Aviso legal |
| `/politica-privacidade` | `PoliticaPrivacidade.tsx` | Política de privacidade |
| `/termos-de-servico` | `TermosServico.tsx` | Termos de serviço |
| `/politica-de-cookies` | `PoliticaCookies.tsx` | Política de cookies |
| `/showcase` | `ComponentShowcase.tsx` | Showcase de componentes (dev) |
| `/404` | `NotFound.tsx` | Página não encontrada |

### Componentes Globais

| Componente | Descrição |
|---|---|
| `FloatingWhatsApp` | Botão flutuante de WhatsApp em todas as páginas |
| `AIChatBox` | Chat com IA integrado |
| `ContactFormModal` | Modal com formulário de orçamento |
| `DashboardLayout` | Layout padrão com sidebar |
| `Map` | Integração com Google Maps |
| `PhoneMockup` | Mockup de celular para demonstrações |

### Contextos

- **`ThemeContext`** — Controla o tema claro/escuro (padrão: `dark`)
- **`LanguageContext`** — Controla o idioma da interface

---

## Backend (API)

O backend utiliza **tRPC v11** sobre Express para uma API completamente tipada.

### Endpoint base
```
/api/trpc
```

### Routers disponíveis

#### `auth`
| Procedure | Tipo | Descrição |
|---|---|---|
| `auth.me` | Query | Retorna o usuário autenticado atual (ou `null`) |
| `auth.logout` | Mutation | Apaga o cookie de sessão e efetua logout |

#### `contact`
| Procedure | Tipo | Descrição |
|---|---|---|
| `contact.submit` | Mutation | Envia formulário de contato por e-mail |
| `contact.verifyConfig` | Query | Verifica se a configuração de e-mail está válida |

**Schema do formulário de contato:**
```typescript
{
  nome: string;       // Nome completo
  cpfCnpj: string;   // CPF ou CNPJ
  email: string;      // E-mail válido
  telefone: string;   // Telefone/WhatsApp
  descricao: string;  // Descrição do projeto
}
```

#### `system`
Router interno para callbacks OAuth e funcionalidades do sistema.

---

## Banco de Dados

- **SGBD**: MySQL
- **ORM**: Drizzle ORM
- **Provider**: Configurado via `DATABASE_URL`

### Tabela: `users`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INT (PK, auto) | Chave primária |
| `openId` | VARCHAR(64) UNIQUE | Identificador OAuth único |
| `name` | TEXT | Nome do usuário |
| `email` | VARCHAR(320) | E-mail do usuário |
| `loginMethod` | VARCHAR(64) | Método de login (email, google, apple, github, microsoft) |
| `role` | ENUM('user','admin') | Papel do usuário (padrão: `user`) |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |
| `lastSignedIn` | TIMESTAMP | Último acesso |

> O usuário definido em `OWNER_OPEN_ID` recebe automaticamente o papel `admin`.

---

## Autenticação

O sistema usa **OAuth** com gestão de sessão via **JWT (HS256)**.

### Fluxo de autenticação
1. Usuário acessa `/login` e inicia o fluxo OAuth
2. OAuth server redireciona com `code` e `state`
3. Backend troca o code por `accessToken` via `OAuthService`
4. Busca informações do usuário com o accessToken
5. Cria/atualiza o usuário no banco via `upsertUser()`
6. Assina um JWT com `openId`, `appId` e `name` (validade: 1 ano)
7. Salva o JWT em cookie HTTP-only seguro
8. Nas requisições subsequentes, o middleware lê e verifica o cookie

### Métodos de login suportados
- Email/senha
- Google
- Apple
- Microsoft/Azure
- GitHub

---

## Inteligência Artificial

O servidor possui uma camada de abstração para chamadas LLM em `server/_core/llm.ts`.

- **Modelo padrão**: `gemini-2.5-flash`
- **Provider**: Forge API (proxy compatível com OpenAI)
- **Max tokens**: 32.768
- **Thinking budget**: 128 tokens

### Capacidades
- Mensagens com texto, imagens e arquivos (audio, PDF, vídeo)
- Function calling / tool use
- Structured output (JSON Schema)
- Geração de imagens (`imageGeneration.ts`)
- Transcrição de voz (`voiceTranscription.ts`)

---

## Armazenamento

O módulo `server/storage.ts` fornece helpers para upload e download de arquivos via proxy de armazenamento:

```typescript
// Upload de arquivo
const { key, url } = await storagePut('caminho/arquivo.jpg', buffer, 'image/jpeg');

// Download (URL pré-assinada)
const { url } = await storageGet('caminho/arquivo.jpg');
```

> Também há integração com **AWS S3** via `@aws-sdk/client-s3`.

---

## E-mail

Envio de e-mails via **Nodemailer** com Gmail SMTP (porta 465, SSL).

- **Trigger**: Submissão do formulário de contato
- **Destinatário**: Configurado via `EMAIL_USER` (envia para si mesmo)
- **Conteúdo**: Nome, CPF/CNPJ, e-mail, telefone (com link WhatsApp), descrição do projeto
- **Template**: HTML responsivo com identidade visual da Pixel Obra

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Aplicação
VITE_APP_ID=            # ID da aplicação OAuth
JWT_SECRET=             # Segredo para assinar JWTs de sessão

# Banco de Dados
DATABASE_URL=           # String de conexão MySQL (ex: mysql://user:pass@host:3306/db)

# OAuth
OAUTH_SERVER_URL=       # URL base do servidor OAuth
OWNER_OPEN_ID=          # OpenId do usuário administrador

# IA / LLM
BUILT_IN_FORGE_API_URL= # URL base da Forge API (proxy LLM)
BUILT_IN_FORGE_API_KEY= # Chave de API da Forge (OPENAI_API_KEY)

# E-mail
EMAIL_USER=             # Endereço Gmail para envio
EMAIL_PASS=             # Senha de app do Gmail (não a senha normal)

# Ambiente
NODE_ENV=development    # development | production
PORT=3000               # Porta do servidor (padrão: 3000)
```

---

## Como Rodar

### Pré-requisitos

- Node.js 20+
- pnpm 10+ (`npm install -g pnpm`)
- MySQL 8+ (ou banco configurado via `DATABASE_URL`)

### Instalação

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

O servidor Express e o Vite HMR sobem juntos na porta `3000`. Acesse: [http://localhost:3000](http://localhost:3000)

### Abrir no Chrome automaticamente

```bash
pnpm chrome
```

### Banco de dados

```bash
# Gerar e aplicar migrações
pnpm db:push
```

### Produção

```bash
# Build completo (Vite + esbuild)
pnpm build

# Iniciar servidor de produção
pnpm start:prod
```

---

## Scripts Disponíveis

| Script | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento com hot reload |
| `pnpm chrome` | Inicia o dev server e abre o Chrome automaticamente |
| `pnpm build` | Build de produção (frontend + backend) |
| `pnpm start:prod` | Inicia o servidor compilado (`dist/index.js`) |
| `pnpm check` | Verificação de tipos TypeScript |
| `pnpm format` | Formata o código com Prettier |
| `pnpm test` | Executa os testes com Vitest |
| `pnpm db:push` | Gera e aplica migrações no banco de dados |

---

## Design System

O projeto adota o estilo **Architectural Glass Morphism**:

- **Fundo base**: Azul noturno profundo `#0C1929`
- **Acento primário**: Cyan luminoso `#00D4FF`
- **Destaque/CTA**: Âmbar dourado `#FFB800`
- **Cards**: Branco translúcido com `backdrop-blur`
- **Tema padrão**: Escuro (`dark`)
- **Tipografia**: Outfit (títulos) + Inter (corpo)
- **Animações**: Framer Motion — fade + scale suaves (400ms `cubic-bezier`)

### Alias de imports

O projeto usa path aliases configurados no `vite.config.ts`:

| Alias | Caminho |
|---|---|
| `@/` | `client/src/` |
| `@shared/` | `shared/` |

---

## Licença

MIT — consulte o arquivo `package.json` para detalhes.
