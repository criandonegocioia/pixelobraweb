# Pixel Obra — Plataforma Web + Agente WhatsApp

> Plataforma web institucional + agente comercial da **Pixel Obra**, empresa especializada em visualização arquitetônica com IA. Inclui site institucional, agente virtual "Pixel" para WhatsApp e Instagram, e integração com **OpenClaw** para respostas humanizadas via Claude Sonnet 4.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Páginas e Rotas](#páginas-e-rotas)
- [Backend (API)](#backend-api)
- [WhatsApp — Agente Pixel](#whatsapp--agente-pixel)
- [Banco de Dados](#banco-de-dados)
- [Autenticação](#autenticação)
- [Inteligência Artificial](#inteligência-artificial)
- [Armazenamento](#armazenamento)
- [E-mail](#e-mail)
- [Docker](#docker)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar](#como-rodar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Design System](#design-system)

---

## Visão Geral

O **Pixel Obra Web** é uma plataforma full-stack construída em TypeScript com React no frontend e Express no backend, com deploy via **Docker Compose**. O sistema oferece:

- Página institucional com apresentação dos serviços de IA para arquitetura
- **Agente virtual "Pixel" no WhatsApp** — atendimento humanizado via OpenClaw (Claude Sonnet 4)
- Formulário de contato com envio de e-mail automático
- Webhook de Instagram para resposta automática a comentários e DMs
- Autenticação OAuth com gestão de sessão via JWT
- Banco de dados MySQL gerenciado via Drizzle ORM
- Design Glassmorphism Arquitetônico (tema escuro com acentos em cyan `#00D4FF`)

---

## Arquitetura

```
Usuário WhatsApp
    ↓ mensagem
wpp-service (porta 3010) — whatsapp-web.js + Puppeteer
    ↓ POST /api/whatsapp/message
pixelobra-app (porta 3002) — Express + tRPC
    ↓ POST /v1/chat/completions
OpenClaw Gateway (porta 3000) → Claude Sonnet 4
    ↓ resposta humanizada
pixelobra-app → wpp-service → Usuário WhatsApp
```

### Containers Docker

| Container | Porta | Descrição |
|-----------|-------|-----------|
| `pixelobra-app` | 3002 | App principal (Node 22, Vite, Express) |
| `pixelobra-wpp` | 3010 | WhatsApp gateway (whatsapp-web.js) |
| `pixelobra-mysql` | 3306 | MySQL 8 — banco de dados |
| `pixelobra-tunnel` | — | Cloudflare Tunnel (HTTPS para webhooks) |

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
│   ├── memory.ts             # Memória de conversa persistente (DB)
│   ├── webhooks.ts           # Webhook handler Instagram
│   ├── whatsapp-alert.ts     # Alertas via WhatsApp (token, créditos)
│   ├── storage.ts            # Upload/download de arquivos
│   └── _core/
│       ├── index.ts          # Bootstrap Express + rota WhatsApp → OpenClaw
│       ├── env.ts            # Variáveis de ambiente centralizadas
│       ├── llm.ts            # Abstração para chamadas ao LLM
│       └── ...               # context, cookies, oauth, trpc, vite, etc.
│
├── agente-pixelobra/         # Agente Virtual Pixel
│   ├── PIXEL.md              # System prompt do agente (persona + regras)
│   ├── agente_responses_api.ts # OpenAI Responses API (fallback)
│   └── README.md             # Documentação do agente
│
├── wpp-service/              # Micro-serviço WhatsApp
│   ├── server.js             # whatsapp-web.js + handler de mensagens
│   ├── Dockerfile            # Build com Chromium + Puppeteer
│   └── package.json
│
├── drizzle/                  # Banco de dados
│   ├── schema.ts             # Tabelas: users, conversation_sessions
│   └── migrations/           # Migrações SQL geradas
│
├── shared/                   # Código compartilhado (client + server)
├── docker-compose.yml        # Stack completa (app + wpp + mysql + tunnel)
├── Dockerfile                # Build do app (multi-stage Node 22)
├── .env                      # Variáveis de ambiente (não commitado)
├── .env.example              # Template de variáveis
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

## WhatsApp — Agente Pixel

O agente **Pixel** atende clientes via WhatsApp com respostas humanizadas geradas pelo **OpenClaw** (Claude Sonnet 4).

### Componentes

| Componente | Arquivo | Descrição |
|---|---|---|
| wpp-service | `wpp-service/server.js` | Micro-serviço WhatsApp (whatsapp-web.js + Puppeteer) |
| Handler | `server/_core/index.ts` | Rota `POST /api/whatsapp/message` → OpenClaw |
| System Prompt | `agente-pixelobra/PIXEL.md` | Persona, serviços, fluxo de atendimento |
| Memória | `server/memory.ts` | Persistência de conversa (DB) |
| Alertas | `server/whatsapp-alert.ts` | Notificações do sistema para o dono |

### Fluxo de Mensagen

1. Mensagem chega no WhatsApp → `wpp-service` captura via `client.on('message')`
2. `wpp-service` faz `POST /api/whatsapp/message` no app com `{ from, body }`
3. App envia para OpenClaw Gateway (`POST /v1/chat/completions`) com system prompt Pixel Obra
4. OpenClaw processa via Claude Sonnet 4 e retorna resposta humanizada
5. App retorna `{ reply }` → `wpp-service` envia de volta via WhatsApp

### Endpoints wpp-service

| Endpoint | Método | Descrição |
|---|---|---|
| `/qr` | GET | Página HTML com QR code para conectar |
| `/status` | GET | Status da conexão (`{ status, ready }`) |
| `/send` | POST | Enviar mensagem (`{ number, text }`) |

### OpenClaw Gateway

- **URL:** `http://host.docker.internal:3000` (dentro Docker)
- **Token:** configurável via `OPENCLAW_TOKEN`
- **Modelo:** Claude Sonnet 4 (via `gpt-4o-mini` — gateway traduz)

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

### Tabela: `conversation_sessions`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INT (PK, auto) | Chave primária |
| `contact` | VARCHAR(128) | Identificador do contato (telefone/user ID) |
| `channel` | ENUM('whatsapp','instagram','email') | Canal de comunicação |
| `previousResponseId` | VARCHAR(128) | ID da última resposta OpenAI (contexto) |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização (auto-update) |

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

### Agente Pixel (WhatsApp/Instagram)

- **Provider**: OpenClaw Gateway → Anthropic Claude Sonnet 4
- **Endpoint**: `POST /v1/chat/completions` (OpenAI-compatible)
- **System prompt**: `agente-pixelobra/PIXEL.md`
- **Memória**: In-memory (20 mensagens por usuário) + DB (`conversation_sessions`)

### LLM Genérico (Site/Frontend)

O servidor possui uma camada de abstração para chamadas LLM em `server/_core/llm.ts`.

- **Modelo padrão**: `gemini-2.5-flash`
- **Provider**: Forge API (proxy compatível com OpenAI)
- **Max tokens**: 32.768

### OpenAI Responses API (Fallback)

- **Prompt ID**: `pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0`
- **Versão**: `6`
- **Arquivo**: `agente-pixelobra/agente_responses_api.ts`

### Capacidades
- Mensagens com texto, imagens e arquivos (audio, PDF, vídeo)
- Function calling / tool use
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

Copie `.env.example` para `.env` e preencha:

```env
# ── App ───────────────────────────────────────
PORT=3000
NODE_ENV=production
JWT_SECRET=troque_por_uma_chave_segura

# ── OpenAI ────────────────────────────────────
OPENAI_API_KEY=
OPENAI_MONTHLY_BUDGET_USD=50

# ── OpenClaw Gateway ──────────────────────────
OPENCLAW_URL=http://host.docker.internal:3000
OPENCLAW_TOKEN=123456

# ── Facebook / Instagram ──────────────────────
FACEBOOK_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
WEBHOOK_VERIFY_TOKEN=pixel_obra_webhook_2024

# ── WhatsApp ──────────────────────────────────
WHATSAPP_ALERT_NUMBER=+55XXXXXXXXXXX
OWNER_PHONE=5585999183883

# ── Email / IMAP ─────────────────────────────
EMAIL_USER=
EMAIL_PASS=
IMAP_HOST=imap.gmail.com
IMAP_PORT=993

# ── MySQL (auto pelo docker-compose) ─────────
MYSQL_ROOT_PASSWORD=root123
MYSQL_PASSWORD=pixelobra123
```

---

## Como Rodar

### Pré-requisitos

- Docker Desktop
- OpenClaw rodando na porta 3000 (para agente WhatsApp)

### Via Docker (Recomendado)

```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env
# Preencher os valores no .env

# 2. Subir toda a stack
docker compose up -d

# 3. Acessar
# App: http://localhost:3002
# QR WhatsApp: http://localhost:3010/qr
```

### Desenvolvimento Local

```bash
pnpm install
pnpm dev
# Acesse http://localhost:3000
```

### Comandos Docker Úteis

```bash
# Ver logs
docker logs pixelobra-app --follow --tail 20
docker logs pixelobra-wpp --follow --tail 20

# Rebuild app (após mudanças no código)
docker compose build app && docker rm -f pixelobra-app && docker compose up app -d

# Rebuild wpp (após mudanças no server.js)
docker compose build wpp --no-cache && docker rm -f pixelobra-wpp && docker compose up wpp -d

# Reset sessão WhatsApp (novo QR code)
docker rm -f pixelobra-wpp && docker volume rm pixelobraweb_wpp-auth && docker compose up wpp -d

# Status WhatsApp
curl http://localhost:3010/status
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
