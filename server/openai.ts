import { ENV } from "./_core/env";

const OPENAI_API_BASE = "https://api.openai.com/v1";

/**
 * Retorna os headers padrão para chamadas à API da OpenAI
 */
function getHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ENV.openaiApiKey}`,
  };
}

// ─────────────────────────────────────────────
// Chat Completion (GPT-4o)
// ─────────────────────────────────────────────

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export interface ChatCompletionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Envia mensagens para o modelo GPT-4o e retorna a resposta gerada.
 * Utilizado para atendimento humanizado (WhatsApp, Email) e criação de conteúdo.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<ChatCompletionResult> {
  try {
    const allMessages: ChatMessage[] = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : messages;

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        model: "gpt-4o",
        messages: allMessages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `OpenAI API error: ${response.status} – ${errorText}` };
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    return { success: true, message: data.choices[0]?.message?.content ?? "" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─────────────────────────────────────────────
// Análise de Imagem (GPT-4o Vision)
// ─────────────────────────────────────────────

export interface ImageAnalysisResult {
  success: boolean;
  description?: string;
  error?: string;
}

/**
 * Analisa uma imagem enviada pelo cliente (ex: foto de projeto ou referência)
 * e retorna uma descrição contextualizada com base no portfólio da Pixel Obra.
 */
export async function analyzeImage(
  imageUrl: string,
  userQuestion?: string
): Promise<ImageAnalysisResult> {
  try {
    const prompt =
      userQuestion ||
      "Analise esta imagem no contexto de projetos de arquitetura e design de interiores. Descreva o que você vê e como a Pixel Obra poderia ajudar com um projeto similar.";

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Você é o assistente especializado da Pixel Obra, empresa de renderização 3D, visualização arquitetônica e design de interiores. Responda sempre em português brasileiro de forma profissional e acolhedora.",
          },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: imageUrl } },
              { type: "text", text: prompt },
            ],
          },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `OpenAI Vision error: ${response.status} – ${errorText}` };
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    return { success: true, description: data.choices[0]?.message?.content ?? "" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─────────────────────────────────────────────
// Geração de Legenda para Instagram
// ─────────────────────────────────────────────

export interface InstagramCaptionResult {
  success: boolean;
  caption?: string;
  hashtags?: string;
  error?: string;
}

/**
 * Gera uma legenda persuasiva para publicação no Instagram da Pixel Obra,
 * incluindo CTA direcionando para www.pixelobra.com.
 */
export async function generateInstagramCaption(
  projectDescription: string,
  serviceType?: string
): Promise<InstagramCaptionResult> {
  try {
    const systemPrompt = `Você é o especialista em marketing digital da Pixel Obra, empresa líder em renderização 3D e visualização arquitetônica. 
Crie legendas para o Instagram @pixelobra que sejam:
- Persuasivas e engajadoras
- Com tom profissional mas acessível
- Incluindo uma CTA clara direcionando para www.pixelobra.com
- Em português brasileiro
- Com hashtags relevantes separadas ao final`;

    const userPrompt = `Crie uma legenda para o Instagram sobre: ${projectDescription}${serviceType ? ` (Serviço: ${serviceType})` : ""}. 
Retorne em formato JSON com os campos: "caption" (legenda principal) e "hashtags" (hashtags relevantes).`;

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 512,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `OpenAI error: ${response.status} – ${errorText}` };
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const parsed = JSON.parse(data.choices[0]?.message?.content ?? "{}") as {
      caption?: string;
      hashtags?: string;
    };

    return {
      success: true,
      caption: parsed.caption ?? "",
      hashtags: parsed.hashtags ?? "",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─────────────────────────────────────────────
// Resposta Automática de Atendimento
// ─────────────────────────────────────────────

export interface AutoReplyResult {
  success: boolean;
  reply?: string;
  shouldEscalate?: boolean;
  error?: string;
}

/**
 * Gera uma resposta automática humanizada para mensagens de clientes
 * no WhatsApp ou Email, com base no contexto da Pixel Obra.
 */
export async function generateAutoReply(
  customerMessage: string,
  channel: "whatsapp" | "email"
): Promise<AutoReplyResult> {
  try {
    const systemPrompt = `Você é o assistente de atendimento da Pixel Obra, empresa especializada em renderização 3D, visualização arquitetônica, decoração virtual e animações arquitetônicas.

Serviços oferecidos:
- Renderização 3D fotorrealista
- Visualização arquitetônica
- Tour virtual 360°
- Decoração de ambientes
- Animações arquitetônicas
- Plantas humanizadas

Regras:
1. Responda SEMPRE em português brasileiro
2. Tom: profissional, acolhedor e empático (NÃO robótico)
3. Se for pedido de orçamento: solicite detalhes do projeto (metragem, tipo de ambiente, prazo)
4. Se a pergunta for muito complexa ou específica: informe que um especialista entrará em contato
5. Sempre mencione o site www.pixelobra.com quando relevante
6. Para ${channel === "whatsapp" ? "WhatsApp: seja mais informal e use parágrafos curtos" : "Email: seja mais formal e estruturado"}

Retorne JSON com: "reply" (texto da resposta) e "shouldEscalate" (true se precisar encaminhar para humano)`;

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: customerMessage },
        ],
        response_format: { type: "json_object" },
        max_tokens: 512,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `OpenAI error: ${response.status} – ${errorText}` };
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const parsed = JSON.parse(data.choices[0]?.message?.content ?? "{}") as {
      reply?: string;
      shouldEscalate?: boolean;
    };

    return {
      success: true,
      reply: parsed.reply ?? "",
      shouldEscalate: parsed.shouldEscalate ?? false,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
