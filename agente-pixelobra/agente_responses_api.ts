/**
 * Agente Virtual Pixel Obra - Responses API (OpenAI)
 * ===================================================
 * Utiliza o prompt publicado na OpenAI Platform:
 *   Prompt ID: pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0
 *   Versão: 2
 *
 * Endpoint: POST /v1/responses
 * Mantém contexto conversacional via previous_response_id.
 */

import { ENV } from "../server/_core/env";

const OPENAI_API_BASE = "https://api.openai.com/v1";
const PROMPT_ID = "pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0";
const PROMPT_VERSION = "2";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface AgentResponse {
  success: boolean;
  reply?: string;
  responseId?: string;
  error?: string;
}

export interface ConversationMessage {
  mensagemCliente: string;
  respostaAgente: string;
  responseId: string;
}

// ─────────────────────────────────────────────
// Funções do Agente
// ─────────────────────────────────────────────

/**
 * Envia uma mensagem para o agente Pixel Obra usando a Responses API.
 * Mantém contexto da conversa via previousResponseId.
 *
 * @param mensagemCliente - Texto da mensagem do cliente
 * @param previousResponseId - ID da resposta anterior (para manter contexto)
 * @returns AgentResponse com a resposta do agente
 */
export async function enviarMensagemAgente(
  mensagemCliente: string,
  previousResponseId?: string
): Promise<AgentResponse> {
  try {
    const payload: Record<string, unknown> = {
      prompt: {
        id: PROMPT_ID,
        version: PROMPT_VERSION,
      },
      input: mensagemCliente,
    };

    if (previousResponseId) {
      payload.previous_response_id = previousResponseId;
    }

    const response = await fetch(`${OPENAI_API_BASE}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `OpenAI Responses API error: ${response.status} – ${errorText}`,
      };
    }

    const data = (await response.json()) as {
      id: string;
      output: Array<{
        type: string;
        content?: Array<{ type: string; text?: string }>;
      }>;
    };

    // Extrair texto da resposta
    let outputText = "";
    for (const item of data.output) {
      if (item.type === "message" && item.content) {
        for (const content of item.content) {
          if (content.type === "output_text" && content.text) {
            outputText += content.text;
          }
        }
      }
    }

    return {
      success: true,
      reply: outputText,
      responseId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Responde a múltiplas mensagens mantendo o contexto conversacional.
 * Ideal para processar histórico de mensagens do WhatsApp/Instagram.
 *
 * @param mensagens - Lista de mensagens do cliente
 * @returns Lista de respostas com contexto mantido
 */
export async function responderConversacao(
  mensagens: string[]
): Promise<ConversationMessage[]> {
  let previousId: string | undefined;
  const respostas: ConversationMessage[] = [];

  for (const msg of mensagens) {
    const result = await enviarMensagemAgente(msg, previousId);

    respostas.push({
      mensagemCliente: msg,
      respostaAgente: result.reply ?? "[Erro ao gerar resposta]",
      responseId: result.responseId ?? "",
    });

    if (result.responseId) {
      previousId = result.responseId;
    }
  }

  return respostas;
}

/**
 * Gera uma resposta para comentário do Instagram usando o agente.
 *
 * @param comentario - Texto do comentário no Instagram
 * @returns Resposta humanizada do agente
 */
export async function responderComentarioInstagram(
  comentario: string
): Promise<AgentResponse> {
  const contexto = `[Comentário no Instagram @pixelobra]: ${comentario}. Responda de forma curta, simpática e engajadora, como uma reply no Instagram.`;
  return enviarMensagemAgente(contexto);
}

/**
 * Gera uma resposta para mensagem do WhatsApp usando o agente.
 *
 * @param mensagem - Texto da mensagem no WhatsApp
 * @param previousResponseId - ID da resposta anterior para contexto
 * @returns Resposta humanizada do agente
 */
export async function responderWhatsApp(
  mensagem: string,
  previousResponseId?: string
): Promise<AgentResponse> {
  return enviarMensagemAgente(mensagem, previousResponseId);
}
