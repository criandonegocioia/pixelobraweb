/**
 * Instagram Engagement Service — Auto-Reply com IA
 * ================================================
 * Adaptado do narcissus/instagram_engagement.js para Pixel Obra.
 *
 * Usa POLLING (não webhook) — escaneia posts recentes, filtra spam,
 * gera respostas com o Agente Pixel e responde automaticamente.
 *
 * Features:
 *   - Rate limit: 25 replies/hora (evitar ban)
 *   - Delay humanizado: 3-15s entre respostas
 *   - Filtro de spam e blacklist
 *   - Persistência de IDs respondidos
 *   - Alerta WhatsApp ao CEO quando responde
 *
 * Endpoints Graph API usados:
 *   GET  /{ig-user-id}/media              → listar posts recentes
 *   GET  /{media-id}/comments             → listar comentários
 *   POST /{comment-id}/replies?message=   → responder comentário
 */

import { ENV } from "./_core/env";
import { enviarMensagemAgente } from "../agente-pixelobra/agente_responses_api";
import { sendWhatsAppSystemAlert } from "./whatsapp-alert";
import { upsertLead } from "./leads";
import { classifyLead } from "../agente-pixelobra/agente_responses_api";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";
const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10 minutos
const MAX_REPLIES_PER_HOUR = 25;
const POSTS_TO_SCAN = 5;

// Spam patterns (bots, promoção, etc.)
const SPAM_PATTERNS: RegExp[] = [
  /follow\s*me/i, /check.*(?:bio|link|profile)/i, /dm\s*(?:me|for)/i,
  /free.*followers/i, /make.*money/i, /click.*link/i, /subscribe/i,
  /promo.*(?:code|sm)/i, /[🔥💰💵]{3,}/,  // emojis excessivos
  /compre\s*agora/i, /ganhe\s*dinheiro/i, /link\s*na\s*bio/i,
];

// Tópicos para não responder
const BLACKLIST_WORDS = ["política", "religião", "polêmica", "morte", "violência"];

// ─────────────────────────────────────────────
// State (persistido em memória para o container)
// ─────────────────────────────────────────────

const repliedComments = new Set<string>();
let repliesThisHour = 0;
let lastHourReset = Date.now();
const replyHistory: Array<{
  commentId: string;
  username: string;
  commentText: string;
  replyText: string;
  postId: string;
  timestamp: string;
}> = [];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function resetHourlyLimitIfNeeded(): void {
  if (Date.now() - lastHourReset > 3600000) {
    repliesThisHour = 0;
    lastHourReset = Date.now();
  }
}

function isSpam(text: string): boolean {
  if (!text || text.length < 2) return true;
  return SPAM_PATTERNS.some(p => p.test(text));
}

function containsBlacklist(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BLACKLIST_WORDS.some(w => lower.includes(w));
}

function humanDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 12000) + 3000; // 3-15s
  return new Promise(r => setTimeout(r, delay));
}

// ─────────────────────────────────────────────
// Graph API Calls
// ─────────────────────────────────────────────

interface IGMedia {
  id: string;
  caption?: string;
  timestamp?: string;
  media_type?: string;
  comments_count?: number;
}

interface IGComment {
  id: string;
  text: string;
  username: string;
  timestamp?: string;
  replies?: { data: Array<{ id: string; text: string; username: string }> };
}

async function fetchRecentMedia(limit = POSTS_TO_SCAN): Promise<IGMedia[]> {
  try {
    const res = await fetch(
      `${GRAPH_API_BASE}/${ENV.instagramAccountId}/media?` +
      `fields=id,caption,timestamp,media_type,comments_count&` +
      `limit=${limit}&access_token=${ENV.facebookAccessToken}`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { data: IGMedia[] };
    return data.data || [];
  } catch (e) {
    console.error("[IG:Engagement] ❌ Erro ao buscar posts:", e);
    return [];
  }
}

async function getComments(mediaId: string, limit = 50): Promise<IGComment[]> {
  try {
    const res = await fetch(
      `${GRAPH_API_BASE}/${mediaId}/comments?` +
      `fields=id,text,username,timestamp,replies{id,text,username}&` +
      `limit=${limit}&access_token=${ENV.facebookAccessToken}`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { data: IGComment[] };
    return data.data || [];
  } catch (e) {
    console.error(`[IG:Engagement] ❌ Erro ao buscar comentários de ${mediaId}:`, e);
    return [];
  }
}

async function replyToComment(commentId: string, message: string): Promise<boolean> {
  try {
    const res = await fetch(`${GRAPH_API_BASE}/${commentId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: ENV.facebookAccessToken,
      }),
    });
    if (res.ok) {
      console.log(`[IG:Engagement]    ✅ Reply enviado (${commentId})`);
      return true;
    }
    const err = await res.text();
    console.error(`[IG:Engagement]    ❌ Reply falhou: ${err}`);
    return false;
  } catch (e) {
    console.error("[IG:Engagement]    ❌ Erro ao responder:", e);
    return false;
  }
}

// ─────────────────────────────────────────────
// AI Reply Generation (via Agente Pixel)
// ─────────────────────────────────────────────

async function generateReply(comment: IGComment, postCaption: string): Promise<string | null> {
  const prompt =
    `Você é o perfil @pixelobra no Instagram, respondendo a um comentário.\n\n` +
    `Post: "${(postCaption || "").substring(0, 150)}"\n` +
    `Comentário de @${comment.username}: "${comment.text}"\n\n` +
    `REGRAS:\n` +
    `- Máximo 1 frase curta (tipo reply real do Instagram)\n` +
    `- Use no máximo 1 emoji\n` +
    `- Seja amigável e objetivo — como pessoa real, não empresa\n` +
    `- Se for elogio: agradeça de forma simples e genuína\n` +
    `- Se for pergunta: responda direto\n` +
    `- Se for hate/spam: retorne "SKIP"\n` +
    `- NUNCA use aspas, NUNCA seja corporativo, NUNCA faça propaganda\n` +
    `- Português brasileiro casual\n\n` +
    `Retorne APENAS a resposta ou "SKIP".`;

  try {
    const result = await enviarMensagemAgente(prompt);
    const text = result.reply?.trim() ?? "";
    if (!text || text.includes("SKIP")) return null;
    // Remove aspas envolvendo a resposta, se houver
    return text.replace(/^[""]|[""]$/g, "").trim();
  } catch (e) {
    console.error("[IG:Engagement] ❌ Erro ao gerar resposta:", e);
    return null;
  }
}

// ─────────────────────────────────────────────
// Main Auto-Reply Loop
// ─────────────────────────────────────────────

async function runAutoReplyLoop(): Promise<void> {
  if (!ENV.facebookAccessToken || !ENV.instagramAccountId) {
    console.warn("[IG:Engagement] ⚠️  Credenciais Instagram não configuradas");
    return;
  }

  resetHourlyLimitIfNeeded();

  if (repliesThisHour >= MAX_REPLIES_PER_HOUR) {
    console.log(`[IG:Engagement] ⏳ Limite horário atingido (${repliesThisHour}/${MAX_REPLIES_PER_HOUR})`);
    return;
  }

  console.log("[IG:Engagement] 🔍 Escaneando posts para auto-reply...");
  let replied = 0;
  let skipped = 0;
  let processed = 0;

  try {
    const media = await fetchRecentMedia();
    if (!media.length) {
      console.log("[IG:Engagement] ✅ Nenhum post recente encontrado");
      return;
    }

    // Detectar username da conta (para evitar responder a nós mesmos)
    const ourUsername = "pixelobra"; // @pixelobra

    for (const post of media) {
      if (repliesThisHour >= MAX_REPLIES_PER_HOUR) break;
      if (!post.comments_count || post.comments_count === 0) continue;

      console.log(`[IG:Engagement] 📝 Post ${post.id} (${post.comments_count} comentários)`);
      const comments = await getComments(post.id);

      for (const comment of comments) {
        if (repliesThisHour >= MAX_REPLIES_PER_HOUR) break;
        processed++;

        // Já respondido?
        if (repliedComments.has(comment.id)) continue;

        // Já temos reply nesse comentário?
        const hasOurReply = comment.replies?.data?.some(
          r => r.username.toLowerCase() === ourUsername
        );
        if (hasOurReply) {
          repliedComments.add(comment.id);
          continue;
        }

        // É nosso próprio comentário?
        if (comment.username.toLowerCase() === ourUsername) {
          repliedComments.add(comment.id);
          continue;
        }

        // Spam?
        if (isSpam(comment.text)) {
          repliedComments.add(comment.id);
          skipped++;
          continue;
        }

        // Blacklist?
        if (containsBlacklist(comment.text)) {
          repliedComments.add(comment.id);
          skipped++;
          continue;
        }

        // Gerar resposta IA
        console.log(`[IG:Engagement]    💭 @${comment.username}: "${comment.text.substring(0, 60)}..."`);
        const replyText = await generateReply(comment, post.caption || "");

        if (!replyText) {
          repliedComments.add(comment.id);
          skipped++;
          continue;
        }

        // Delay humanizado
        await humanDelay();

        // Enviar resposta
        console.log(`[IG:Engagement]    💬 Respondendo: "${replyText}"`);
        const success = await replyToComment(comment.id, replyText);

        if (success) {
          replied++;
          repliesThisHour++;
          repliedComments.add(comment.id);
          replyHistory.unshift({
            commentId: comment.id,
            username: comment.username,
            commentText: comment.text,
            replyText,
            postId: post.id,
            timestamp: new Date().toISOString(),
          });
          // Manter histórico limitado
          if (replyHistory.length > 200) replyHistory.splice(200);

          // Registrar como lead
          try {
            const classification = classifyLead(comment.text);
            await upsertLead({
              contact: comment.username,
              name: comment.username,
              channel: "instagram",
              classification,
              lastMessage: `[Comentário] ${comment.text.substring(0, 200)}`,
            });
          } catch { /* não crítico */ }
        }
      }
    }

    console.log(
      `[IG:Engagement] ✅ Scan completo | ` +
      `Processados: ${processed} | Respondidos: ${replied} | Ignorados: ${skipped} | ` +
      `Rate: ${repliesThisHour}/${MAX_REPLIES_PER_HOUR}/h`
    );

    // Alerta WhatsApp resumo (apenas se respondeu algum)
    if (replied > 0) {
      const topReplies = replyHistory.slice(0, 3).map(
        r => `• @${r.username}: "${r.commentText.substring(0, 40)}..." → "${r.replyText.substring(0, 50)}..."`
      ).join("\n");

      sendWhatsAppSystemAlert(
        `📸 *INSTAGRAM AUTO-REPLY*\n\n` +
        `✅ ${replied} comentário(s) respondido(s)\n` +
        `⏭️ ${skipped} ignorado(s) (spam/blacklist)\n\n` +
        `📝 *Últimas respostas:*\n${topReplies}`
      ).catch(() => { /* não crítico */ });
    }
  } catch (err) {
    console.error("[IG:Engagement] ❌ Erro no loop:", err);
  }
}

// ─────────────────────────────────────────────
// Start / Stop
// ─────────────────────────────────────────────

let interval: ReturnType<typeof setInterval> | null = null;

export function startInstagramEngagement(): void {
  if (interval) return;

  if (!ENV.facebookAccessToken || !ENV.instagramAccountId) {
    console.warn("[IG:Engagement] ⚠️  Instagram não configurado — auto-reply desativado");
    return;
  }

  console.log(
    `[IG:Engagement] 🚀 Iniciando auto-reply Instagram (a cada 10 min) | ` +
    `Account: ${ENV.instagramAccountId} | Max: ${MAX_REPLIES_PER_HOUR}/h`
  );

  // Primeiro scan após 45 segundos (esperar server subir)
  setTimeout(() => runAutoReplyLoop().catch(console.error), 45_000);

  interval = setInterval(
    () => runAutoReplyLoop().catch(console.error),
    CHECK_INTERVAL_MS
  );
}

export function stopInstagramEngagement(): void {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log("[IG:Engagement] ⏹️  Auto-reply parado");
  }
}

// ─── Stats para dashboard ─────────────────
export function getEngagementStats() {
  return {
    repliesThisHour,
    maxRepliesPerHour: MAX_REPLIES_PER_HOUR,
    totalReplied: repliedComments.size,
    isActive: !!(ENV.facebookAccessToken && ENV.instagramAccountId),
    recentReplies: replyHistory.slice(0, 50),
  };
}
