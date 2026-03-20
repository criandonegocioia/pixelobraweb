/**
 * Instagram Webhook Handler
 * =========================
 * Receives real-time events from Instagram Graph API:
 * - Comments on posts → auto-reply with agent Pixel
 * - DMs (messages) → auto-reply with agent Pixel + memory
 *
 * Setup:
 *   1. Register endpoint in Meta Developer Console:
 *      - Webhook URL: https://your-domain.com/api/webhooks/instagram
 *      - Verify Token: WEBHOOK_VERIFY_TOKEN (set in .env)
 *   2. Subscribe to: messages, comments, mentions
 */

import type { Request, Response } from "express";
import { responderComentarioInstagram, responderWhatsApp, classifyLead } from "../agente-pixelobra/agente_responses_api";
import { replyToComment, sendDM } from "./instagram";
import { getSession, saveSession } from "./memory";
import { upsertLead } from "./leads";

const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN ?? "pixel_obra_webhook_2024";

// ─────────────────────────────────────────────
// Webhook Verification (GET)
// ─────────────────────────────────────────────

export function handleInstagramWebhookVerification(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("[Webhook] ✅ Instagram webhook verificado com sucesso");
    res.status(200).send(challenge);
  } else {
    console.error("[Webhook] ❌ Falha na verificação do webhook — token inválido");
    res.status(403).json({ error: "Verificação falhou" });
  }
}

// ─────────────────────────────────────────────
// Webhook Event Handler (POST)
// ─────────────────────────────────────────────

interface InstagramWebhookEntry {
  id: string;
  time?: number;
  changes?: Array<{
    field: string;
    value: {
      from?: { id: string; username?: string };
      id?: string;
      text?: string;
      media_id?: string;
      comment_id?: string;
      sender?: { id: string };
      recipient?: { id: string };
      message?: { mid: string; text?: string };
    };
  }>;
  messaging?: Array<{
    sender: { id: string };
    recipient: { id: string };
    message?: { mid: string; text?: string };
  }>;
}

export async function handleInstagramWebhookEvent(req: Request, res: Response) {
  // Acknowledge immediately (Meta requires fast 200 response)
  res.status(200).json({ status: "ok" });

  const body = req.body as {
    object?: string;
    entry?: InstagramWebhookEntry[];
  };

  if (body.object !== "instagram" && body.object !== "page") {
    return;
  }

  for (const entry of body.entry ?? []) {
    // ── Handle Comments ──────────────────────────────
    for (const change of entry.changes ?? []) {
      if (change.field === "comments" || change.field === "mention") {
        const commentText = change.value.text;
        const commentId = change.value.id || change.value.comment_id;
        const fromUser = change.value.from;

        if (!commentText || !commentId) continue;

        console.log(`[Webhook] 💬 Comentário de @${fromUser?.username ?? fromUser?.id}: "${commentText}"`);

        try {
          const agentReply = await responderComentarioInstagram(commentText);
          if (agentReply.success && agentReply.reply) {
            await replyToComment(commentId, agentReply.reply);
            console.log(`[Webhook] ✅ Respondido comentário ${commentId}`);
          }
          // Classify & register lead from comment
          const classification = classifyLead(commentText);
          await upsertLead({
            contact: fromUser?.id ?? commentId,
            name: fromUser?.username,
            channel: "instagram",
            classification,
            lastMessage: `[Comentário] ${commentText.substring(0, 200)}`,
          });
        } catch (err) {
          console.error("[Webhook] Erro ao responder comentário:", err);
        }
      }
    }

    // ── Handle Direct Messages ───────────────────────
    for (const message of entry.messaging ?? []) {
      const senderId = message.sender?.id;
      const messageText = message.message?.text;

      if (!senderId || !messageText) continue;

      console.log(`[Webhook] 📩 DM de ${senderId}: "${messageText}"`);

      try {
        // Retrieve conversation memory
        const session = await getSession(senderId, "instagram");
        const agentReply = await responderWhatsApp(messageText, session?.previousResponseId);

        if (agentReply.success && agentReply.reply) {
          // Save updated conversation memory
          if (agentReply.responseId) {
            await saveSession(senderId, "instagram", agentReply.responseId);
          }
          await sendDM(senderId, agentReply.reply);
          console.log(`[Webhook] ✅ DM respondida para ${senderId}`);
        }

        // Classify & register lead from DM
        const classification = classifyLead(messageText);
        await upsertLead({
          contact: senderId,
          channel: "instagram",
          classification,
          lastMessage: `[DM] ${messageText.substring(0, 200)}`,
        });
      } catch (err) {
        console.error("[Webhook] Erro ao responder DM:", err);
      }
    }
  }
}
