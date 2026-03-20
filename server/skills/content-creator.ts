/**
 * Skill: Content Creator — Gerador de Conteúdo para Redes Sociais
 * ================================================================
 * Usa o agente Pixel para criar copys, legendas e conteúdo para
 * Instagram, baseado na base de conhecimento da Pixel Obra.
 *
 * Funcionalidades:
 * - Gerar legendas para posts
 * - Criar copys de marketing
 * - Sugerir hashtags relevantes
 * - Adaptar tom para diferentes plataformas
 */

import { enviarMensagemAgente } from "../../agente-pixelobra/agente_responses_api";
import { publishInstagramPost, type PublishResult } from "../instagram";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface ContentRequest {
  /** Tipo de conteúdo */
  type: "post_caption" | "story_copy" | "ad_copy" | "comment_reply";
  /** Tema ou assunto */
  topic: string;
  /** Tom desejado */
  tone?: "profissional" | "casual" | "urgente" | "inspirador";
  /** Plataforma alvo */
  platform?: "instagram" | "facebook" | "whatsapp";
  /** Contexto adicional (ex: descrição de imagem) */
  context?: string;
}

export interface ContentResult {
  success: boolean;
  content?: string;
  hashtags?: string[];
  error?: string;
}

// ─────────────────────────────────────────────
// Prompts por Tipo
// ─────────────────────────────────────────────

const PROMPTS: Record<string, string> = {
  post_caption: `Você é o social media da Pixel Obra, empresa especialista em visualização arquitetônica com IA.
Crie uma legenda profissional e envolvente para um post no Instagram.

Regras:
- Use emojis de forma moderada
- Inclua call-to-action ao final
- Máximo 2200 caracteres
- Não use hashtags no corpo (gere separadamente)
- Tom: {TONE}

Tema: {TOPIC}
{CONTEXT}

Responda APENAS a legenda, sem explicações extras.`,

  story_copy: `Crie um texto curto e impactante para um Story do Instagram da Pixel Obra.
Máximo 100 caracteres. Use CTA direto.
Tom: {TONE}
Tema: {TOPIC}
{CONTEXT}

Responda APENAS o texto.`,

  ad_copy: `Crie um copy de anúncio para a Pixel Obra (visualização arquitetônica com IA).
Formato: Headline (máx 40 chars) + Body (máx 125 chars) + CTA
Tom: {TONE}
Tema: {TOPIC}
{CONTEXT}

Formato da resposta:
HEADLINE: ...
BODY: ...
CTA: ...`,

  comment_reply: `Responda a um comentário no Instagram da @pixelobra de forma {TONE} e natural.
A resposta deve ser relevante ao contexto do post e representar a marca.
Máximo 200 caracteres.

Comentário: {TOPIC}
{CONTEXT}

Responda APENAS a resposta ao comentário.`,
};

// ─────────────────────────────────────────────
// Gerador de Hashtags
// ─────────────────────────────────────────────

const BASE_HASHTAGS = [
  "#pixelobra",
  "#renderizacao3d",
  "#visualizacaoarquitetonica",
  "#arquitetura",
  "#arquiteturadigital",
  "#render3d",
  "#projetoarquitetonico",
  "#decoracaovirtual",
  "#IAarquitetura",
];

function generateHashtags(topic: string): string[] {
  const topicLower = topic.toLowerCase();
  const hashtags = [...BASE_HASHTAGS];

  if (topicLower.includes("residencial") || topicLower.includes("casa"))
    hashtags.push("#casadossonhos", "#projetoresidencial");
  if (topicLower.includes("comercial") || topicLower.includes("loja"))
    hashtags.push("#projetocomercial", "#designcomercial");
  if (topicLower.includes("loteamento"))
    hashtags.push("#loteamento", "#urbanismo");
  if (topicLower.includes("interior") || topicLower.includes("decoração"))
    hashtags.push("#designdeinteriores", "#decoracao");

  return hashtags.slice(0, 15); // Instagram permite até 30, mas 15 é ideal
}

// ─────────────────────────────────────────────
// Gerar Conteúdo
// ─────────────────────────────────────────────

export async function generateContent(req: ContentRequest): Promise<ContentResult> {
  try {
    const template = PROMPTS[req.type];
    if (!template) {
      return { success: false, error: `Tipo de conteúdo desconhecido: ${req.type}` };
    }

    const tone = req.tone || "profissional";
    const context = req.context ? `Contexto adicional: ${req.context}` : "";

    const prompt = template
      .replace(/{TONE}/g, tone)
      .replace(/{TOPIC}/g, req.topic)
      .replace(/{CONTEXT}/g, context);

    console.log(`[Content] 🎨 Gerando ${req.type} sobre "${req.topic.substring(0, 50)}..."`);

    const result = await enviarMensagemAgente(prompt);

    if (!result.success || !result.reply) {
      return { success: false, error: result.error || "Sem resposta do agente" };
    }

    const hashtags = req.type === "post_caption" ? generateHashtags(req.topic) : undefined;

    console.log(`[Content] ✅ Conteúdo gerado: "${result.reply.substring(0, 60)}..."`);

    return {
      success: true,
      content: result.reply,
      hashtags,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Content] ❌ Erro:", msg);
    return { success: false, error: msg };
  }
}

// ─────────────────────────────────────────────
// Publicar Post com Legenda Gerada
// ─────────────────────────────────────────────

export async function createAndPublishPost(
  imageUrl: string,
  topic: string,
  tone?: ContentRequest["tone"]
): Promise<{ content: ContentResult; publish: PublishResult | null }> {
  // Gerar legenda
  const content = await generateContent({
    type: "post_caption",
    topic,
    tone,
  });

  if (!content.success || !content.content) {
    return { content, publish: null };
  }

  // Montar caption com hashtags
  const fullCaption = content.hashtags
    ? `${content.content}\n\n${content.hashtags.join(" ")}`
    : content.content;

  // Publicar no Instagram
  const publish = await publishInstagramPost(imageUrl, fullCaption);

  return { content, publish };
}
