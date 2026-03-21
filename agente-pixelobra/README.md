# Agente Virtual Pixel Obra

Agente conversacional da Pixel Obra para atendimento humanizado via **WhatsApp** e **Instagram**.

## Arquitetura

O agente Pixel opera em dois modos:

### 1. OpenClaw Gateway (Primário — WhatsApp)

As mensagens do WhatsApp são roteadas pelo **OpenClaw Gateway** usando a API `/v1/chat/completions` (formato OpenAI-compatible), que traduz para **Claude Sonnet 4** (Anthropic).

| Campo | Valor |
|-------|-------|
| **Gateway** | `http://host.docker.internal:3000` |
| **Token** | Configurável via `OPENCLAW_TOKEN` |
| **Modelo** | `claude-sonnet-4-20250514` (via alias `gpt-4o-mini`) |
| **System Prompt** | `PIXEL.md` (persona + regras + fluxo de atendimento) |

**Fluxo:**
```
WhatsApp → wpp-service → POST /api/whatsapp/message → OpenClaw Gateway → Claude Sonnet 4 → resposta
```

### 2. OpenAI Responses API (Fallback — Instagram)

| Campo | Valor |
|-------|-------|
| **Prompt ID** | `pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0` |
| **Versão** | `6` |
| **Endpoint** | `POST /v1/responses` |
| **Modelo** | Configurado no prompt (gpt-4o / gpt-4.1) |

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `PIXEL.md` | System prompt do agente: persona, serviços, fluxo, regras |
| `agente_responses_api.ts` | Módulo TypeScript — OpenAI Responses API (fallback) |
| `agente_responses_api.py` | Agente standalone Python (terminal interativo) |
| `demo_teste.py` | Script de demonstração e teste |

## System Prompt (PIXEL.md)

O arquivo `PIXEL.md` define a persona completa do agente:

- **Nome:** Pixel
- **Tom:** Profissional, acolhedor, direto, simpático, humanizado
- **Idioma:** Português brasileiro (natural)
- **Serviços:** Renderização com IA, Visualização 3D, Decoração Virtual, Ampliação, Edição, Animações, Soluções por Nicho
- **Fluxo:** Saudação → Entender projeto → Apresentar serviços → Qualificar lead → Direcionar orçamento

## Uso

### WhatsApp (via OpenClaw)

O roteamento é feito automaticamente pelo handler em `server/_core/index.ts`:

```typescript
// POST /api/whatsapp/message
// → OpenClaw Gateway /v1/chat/completions
// → System prompt PIXEL.md + histórico de conversa
```

### Instagram (via OpenAI Responses API)

```typescript
import { responderComentarioInstagram } from "./agente-pixelobra/agente_responses_api";

const resposta = await responderComentarioInstagram("Que lindo esse projeto!");
// resposta.reply -> "Muito obrigado! 😊 Ficamos felizes..."
```

### Python (Standalone)

```bash
export OPENAI_API_KEY="sua-chave-aqui"
python agente_responses_api.py
```

## Contexto Conversacional

- **WhatsApp:** Memória in-memory (últimas 20 mensagens por usuário) via `conversationHistory` Map
- **Instagram:** Contexto via `previous_response_id` da Responses API
- **DB:** Tabela `conversation_sessions` para persistência entre reinícios

## Links

- **Prompt na OpenAI Platform:** https://platform.openai.com/chat/edit?prompt=pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0
- **OpenClaw Gateway:** http://localhost:3000
