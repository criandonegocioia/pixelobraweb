# Agente Virtual Pixel Obra

Agente conversacional da Pixel Obra utilizando a **Responses API** da OpenAI com prompt publicado na plataforma.

## Configuração do Prompt

| Campo | Valor |
|-------|-------|
| **Prompt ID** | `pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0` |
| **Versão** | `2` |
| **Endpoint** | `POST /v1/responses` |
| **Modelo** | Configurado no prompt (gpt-4o / gpt-4.1) |

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `agente_responses_api.py` | Agente standalone em Python com conversa interativa no terminal |
| `agente_responses_api.ts` | Módulo TypeScript para integração com o servidor web (tRPC) |
| `demo_teste.py` | Script de demonstração e teste do agente |

## Como Usar

### Python (Standalone)

```bash
export OPENAI_API_KEY="sua-chave-aqui"
python agente_responses_api.py
```

O agente inicia uma conversa interativa no terminal. Digite suas mensagens e receba respostas humanizadas da Pixel Obra.

### TypeScript (Integração com Servidor)

```typescript
import { enviarMensagemAgente, responderConversacao } from "./agente-pixelobra/agente_responses_api";

// Mensagem única
const resposta = await enviarMensagemAgente("Olá, quero saber sobre renderização");

// Conversa com contexto
const respostas = await responderConversacao([
  "Olá",
  "Quem é vocês?",
  "Quanto custa uma renderização?"
]);
```

### Integração com WhatsApp

```typescript
import { responderWhatsApp } from "./agente-pixelobra/agente_responses_api";

let previousId: string | undefined;

// Cada mensagem recebida do cliente
const resultado = await responderWhatsApp(mensagemCliente, previousId);
previousId = resultado.responseId; // Manter contexto
```

### Integração com Instagram

```typescript
import { responderComentarioInstagram } from "./agente-pixelobra/agente_responses_api";

const resposta = await responderComentarioInstagram("Que lindo esse projeto!");
// resposta.reply -> "Muito obrigado! 😊 Ficamos felizes..."
```

## Contexto Conversacional

O agente mantém o contexto da conversa através do campo `previous_response_id` da Responses API. Isso significa que cada resposta leva em consideração todas as mensagens anteriores da conversa, proporcionando uma experiência natural e humanizada.

## Prompt Publicado

O prompt está publicado na OpenAI Platform e contém:

- **Persona**: Assistente virtual oficial da Pixel Obra
- **Serviços**: Renderização com IA, Edição, Animações, Audiovisual, Soluções por Nicho
- **Canais**: Site, Instagram, Email, WhatsApp
- **Diretrizes**: Atendimento humanizado, fluxo de orçamentos, regras de segurança
- **Tom de voz**: Profissional, acolhedor, direto

Para atualizar o prompt, acesse:
```
https://platform.openai.com/chat/edit?prompt=pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0
```
