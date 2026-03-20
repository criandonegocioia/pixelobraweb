/**
 * Media Processor — Percepção Multimodal do Agente Pixel
 * ======================================================
 * Processa áudio (Whisper), imagens (GPT-4o Vision) e documentos
 * recebidos via WhatsApp antes de encaminhar ao agente.
 */

import { ENV } from "./_core/env";

const OPENAI_API = "https://api.openai.com/v1";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface MediaInput {
  type: "audio" | "image" | "video" | "document";
  /** Base64-encoded data */
  data: string;
  /** MIME type (e.g. audio/ogg, image/jpeg) */
  mimetype: string;
  /** Original filename */
  filename?: string;
}

export interface TranscriptionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export interface VisionResult {
  success: boolean;
  description?: string;
  error?: string;
}

// ─────────────────────────────────────────────
// WHISPER — Speech-to-Text
// ─────────────────────────────────────────────

/**
 * Transcreve áudio usando OpenAI Whisper API.
 * Suporta: ogg, mp3, mp4, mpeg, m4a, wav, webm
 */
export async function transcribeAudio(media: MediaInput): Promise<TranscriptionResult> {
  try {
    const buffer = Buffer.from(media.data, "base64");

    // Determinar extensão
    const extMap: Record<string, string> = {
      "audio/ogg": "ogg",
      "audio/ogg; codecs=opus": "ogg",
      "audio/mpeg": "mp3",
      "audio/mp4": "m4a",
      "audio/wav": "wav",
      "audio/webm": "webm",
      "audio/x-wav": "wav",
    };
    const ext = extMap[media.mimetype] || "ogg";
    const filename = media.filename || `audio.${ext}`;

    // Criar FormData com o arquivo de áudio
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: media.mimetype }), filename);
    formData.append("model", "whisper-1");
    formData.append("language", "pt");
    formData.append("response_format", "text");

    const res = await fetch(`${OPENAI_API}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.openaiApiKey}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Whisper API error: ${res.status} – ${errorText}` };
    }

    const text = await res.text();
    console.log(`[Whisper] ✅ Transcrição: "${text.substring(0, 80)}..."`);

    return { success: true, text: text.trim() };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Whisper] ❌ Erro:", msg);
    return { success: false, error: msg };
  }
}

// ─────────────────────────────────────────────
// GPT-4o VISION — Análise de Imagens
// ─────────────────────────────────────────────

/**
 * Analisa uma imagem com GPT-4o Vision via Responses API.
 * Retorna descrição contextualizada para o agente processar.
 */
export async function analyzeImage(
  media: MediaInput,
  userContext?: string,
  ownerMode = false
): Promise<VisionResult> {
  try {
    const contextPrompt = ownerMode
      ? "Analise esta imagem com profundidade técnica. Descreva todos os detalhes relevantes."
      : "Analise esta imagem relacionada a um projeto de arquitetura, construção ou decoração. " +
        "Descreva o que vê e como os serviços da Pixel Obra podem ajudar.";

    const input = [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: userContext
              ? `${contextPrompt}\n\nContexto do usuário: "${userContext}"`
              : contextPrompt,
          },
          {
            type: "input_image",
            image_url: `data:${media.mimetype};base64,${media.data}`,
          },
        ],
      },
    ];

    const res = await fetch(`${OPENAI_API}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Vision API error: ${res.status} – ${errorText}` };
    }

    const data = (await res.json()) as {
      id: string;
      output: Array<{
        type: string;
        content?: Array<{ type: string; text?: string }>;
      }>;
    };

    // Extrair texto da resposta
    let description = "";
    for (const item of data.output) {
      if (item.type === "message" && item.content) {
        for (const c of item.content) {
          if (c.type === "output_text" && c.text) {
            description += c.text;
          }
        }
      }
    }

    console.log(`[Vision] ✅ Análise: "${description.substring(0, 80)}..."`);
    return { success: true, description };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Vision] ❌ Erro:", msg);
    return { success: false, error: msg };
  }
}

// ─────────────────────────────────────────────
// Processador Central de Mídia
// ─────────────────────────────────────────────

export interface ProcessedMedia {
  /** Texto para injetar no contexto do agente */
  textForAgent: string;
  /** Tipo de mídia processada */
  mediaType: string;
}

/**
 * Processa qualquer mídia e retorna texto para o agente.
 * - Áudio → transcrição Whisper
 * - Imagem → descrição Vision
 * - Documento → descrição básica (futura expansão)
 */
export async function processMedia(
  media: MediaInput,
  userMessage?: string,
  ownerMode = false
): Promise<ProcessedMedia> {
  switch (media.type) {
    case "audio": {
      const result = await transcribeAudio(media);
      if (result.success && result.text) {
        return {
          textForAgent: `[Áudio recebido — Transcrição]: "${result.text}"${
            userMessage ? `\n[Legenda do usuário]: "${userMessage}"` : ""
          }`,
          mediaType: "audio",
        };
      }
      return {
        textForAgent: `[Áudio recebido, mas não foi possível transcrever]${
          userMessage ? `\n[Legenda do usuário]: "${userMessage}"` : ""
        }`,
        mediaType: "audio",
      };
    }

    case "image": {
      const result = await analyzeImage(media, userMessage, ownerMode);
      if (result.success && result.description) {
        return {
          textForAgent: `[Imagem recebida — Análise Visual]: ${result.description}${
            userMessage ? `\n[Legenda do usuário]: "${userMessage}"` : ""
          }`,
          mediaType: "image",
        };
      }
      return {
        textForAgent: `[Imagem recebida, mas não foi possível analisar]${
          userMessage ? `\n[Legenda do usuário]: "${userMessage}"` : ""
        }`,
        mediaType: "image",
      };
    }

    case "video":
      return {
        textForAgent: `[Vídeo recebido — no momento, não consigo analisar vídeos diretamente]${
          userMessage ? `\n[Legenda do usuário]: "${userMessage}"` : ""
        }`,
        mediaType: "video",
      };

    case "document":
      return {
        textForAgent: `[Documento recebido: "${media.filename || "arquivo"}"]${
          userMessage ? `\n[Legenda do usuário]: "${userMessage}"` : ""
        }`,
        mediaType: "document",
      };

    default:
      return {
        textForAgent: userMessage || "[Mídia não reconhecida recebida]",
        mediaType: "unknown",
      };
  }
}
