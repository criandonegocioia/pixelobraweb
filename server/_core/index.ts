import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { setupVite, serveStatic } from "./vite";
import { getDb } from "../db";
import {
  handleInstagramWebhookVerification,
  handleInstagramWebhookEvent,
} from "../webhooks";
import { startTokenMonitor } from "../monitor-token";
import { startCreditsMonitor } from "../monitor-credits";
import { startEmailMonitor } from "../monitor-email";
import { startFollowUpMonitor } from "../followup";
import { startInstagramEngagement } from "../instagram-engagement";
import { responderWhatsApp, classifyLead, isOwner } from "../../agente-pixelobra/agente_responses_api";
import { getSession, saveSession } from "../memory";
import { upsertLead } from "../leads";
import { processMedia } from "../media-processor";
import type { MediaInput } from "../media-processor";
import { extractCnpj, lookupCnpj, buildCnpjContext } from "../skills/cnpj-lookup";
import { scanFile, getMaliciousFileResponse } from "../skills/security-scan";
import { sendWhatsAppSystemAlert } from "../whatsapp-alert";
import { createMeeting } from "../skills/calendar-meeting";
import { forwardFileByEmail } from "../skills/gmail-sender";

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// DB Connection check (optional but good for startup)
getDb().then(db => {
  if (db) {
    console.log("[Database] Connected successfully");
  } else {
    console.warn("[Database] Connection failed or not configured");
  }
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// ─────────────────────────────────────────────
// Instagram Webhooks
// ─────────────────────────────────────────────

// Meta webhook verification challenge
app.get("/api/webhooks/instagram", handleInstagramWebhookVerification);

// Receive real-time events (comments, DMs)
app.post("/api/webhooks/instagram", handleInstagramWebhookEvent);

// ──────────────────────────────────────────────
// WhatsApp Webhook — Agente Pixel (OpenAI Responses API)
// ──────────────────────────────────────────────

app.post("/api/whatsapp/message", async (req, res) => {
  const { from, body: msgBody } = req.body as { from: string; body: string };

  if (!from || !msgBody) {
    res.status(400).json({ error: "from e body são obrigatórios" });
    return;
  }

  const cleanNumber = from.replace(/@c\.us$/, "").replace(/\D/g, "");
  console.log(`[WhatsApp] 📩 Mensagem de ${cleanNumber}: "${msgBody.substring(0, 60)}"`);

  try {
    // ── CNPJ Auto-Detection (enriquece contexto comercial) ──
    let enrichedMsg = msgBody;
    if (!isOwner(cleanNumber)) {
      const cnpj = extractCnpj(msgBody);
      if (cnpj) {
        const cnpjResult = await lookupCnpj(cnpj);
        if (cnpjResult.success && cnpjResult.data) {
          enrichedMsg = `${msgBody}\n\n${buildCnpjContext(cnpjResult.data)}`;
        }
      }
    }

    // ── Handoff Detection ──
    const handoffKeywords = ["atendente", "humano", "pessoa real", "falar com alguém", "atendimento humano"];
    const lowerMsg = msgBody.toLowerCase();
    const wantsHandoff = handoffKeywords.some(kw => lowerMsg.includes(kw));

    // Recuperar memória persistente da conversa
    const session = await getSession(cleanNumber, "whatsapp");
    const previousResponseId = session?.previousResponseId;

    // Chamar agente Pixel via OpenAI Responses API (detecta dono automaticamente)
    const agentReply = await responderWhatsApp(enrichedMsg, previousResponseId, cleanNumber);

    if (agentReply.success && agentReply.reply) {
      // Salvar novo ID de resposta para manter contexto
      if (agentReply.responseId) {
        await saveSession(cleanNumber, "whatsapp", agentReply.responseId);
      }

      // Append handoff info if client wants human
      let finalReply = agentReply.reply;
      if (wantsHandoff && !isOwner(cleanNumber)) {
        finalReply += "\n\n🔗 Confira nosso portfólio: www.pixelobra.com.br\n📸 Instagram: @pixelobra";
        console.log(`[Handoff] 🔔 Cliente ${cleanNumber} solicitou atendimento humano`);
        // Notificar CEO via WhatsApp
        sendWhatsAppSystemAlert(
          `🔔 *HANDOFF — ATENDIMENTO HUMANO*\n\n` +
          `📱 *Cliente:* ${cleanNumber}\n` +
          `💬 *Mensagem:* "${msgBody.substring(0, 150)}"\n\n` +
          `O cliente solicitou falar com uma pessoa. Assuma a conversa se necessário.`
        ).catch(err => console.error("[Handoff] ⚠️ Erro ao notificar CEO:", err));
      }

      console.log(`[WhatsApp] ✅ Resposta do agente Pixel para ${cleanNumber}`);
      res.json({ reply: finalReply });
    } else {
      console.error(`[WhatsApp] ❌ Erro do agente: ${agentReply.error}`);
      res.json({ reply: null });
    }

    // ── Sales Intelligence: classify & register lead (skip for owner) ──
    if (!isOwner(cleanNumber)) {
      try {
        const classification = classifyLead(msgBody);
        await upsertLead({
          contact: cleanNumber,
          channel: "whatsapp",
          classification,
          lastMessage: msgBody.substring(0, 200),
        });
      } catch (leadErr) {
        console.error("[WhatsApp] ⚠️ Erro ao classificar lead:", leadErr);
      }
    }
  } catch (err) {
    console.error("[WhatsApp] ❌ Erro ao processar mensagem:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// ──────────────────────────────────────────────
// WhatsApp Media Webhook — Whisper + Vision
// ──────────────────────────────────────────────

app.post("/api/whatsapp/media", async (req, res) => {
  const { from, body: msgBody, media } = req.body as {
    from: string;
    body?: string;
    media?: MediaInput | null;
  };

  if (!from) {
    res.status(400).json({ error: "from é obrigatório" });
    return;
  }

  const cleanNumber = from.replace(/@c\.us$/, "").replace(/\D/g, "");
  const ownerMode = isOwner(cleanNumber);
  const mediaType = media?.type || "unknown";

  console.log(`[WhatsApp] 🖼️  Mídia (${mediaType}) de ${cleanNumber}${ownerMode ? " [JARVIS]" : ""}`);

  try {
    let textForAgent = msgBody || "";

    // Processar mídia se presente
    if (media && media.data) {
      // ── Security Scan para documentos ──
      if (media.type === "document" && !ownerMode) {
        try {
          const fileBuffer = Buffer.from(media.data, "base64");
          const scanResult = await scanFile(fileBuffer, media.filename || "documento");
          if (!scanResult.safe) {
            console.error(`[Security] 🚨 Arquivo malicioso de ${cleanNumber}: ${media.filename}`);
            res.json({ reply: getMaliciousFileResponse() });
            return;
          }
        } catch (scanErr) {
          console.warn("[Security] ⚠️ Erro no scan (continuando):", scanErr);
        }

        // Arquivar documento via e-mail
        try {
          const fileBuffer = Buffer.from(media.data, "base64");
          await forwardFileByEmail(cleanNumber, media.filename || "documento", fileBuffer, media.mimetype || "application/octet-stream");
          console.log(`[Gmail] 📎 Documento arquivado de ${cleanNumber}: ${media.filename}`);
        } catch (fwdErr) {
          console.warn("[Gmail] ⚠️ Erro ao arquivar documento:", fwdErr);
        }
      }

      const processed = await processMedia(media, msgBody, ownerMode);
      textForAgent = processed.textForAgent;
      console.log(`[WhatsApp] 🔄 Mídia processada (${processed.mediaType}): ${textForAgent.substring(0, 80)}...`);
    }

    // Recuperar memória e chamar agente
    const session = await getSession(cleanNumber, "whatsapp");
    const previousResponseId = session?.previousResponseId;

    const agentReply = await responderWhatsApp(textForAgent, previousResponseId, cleanNumber);

    if (agentReply.success && agentReply.reply) {
      if (agentReply.responseId) {
        await saveSession(cleanNumber, "whatsapp", agentReply.responseId);
      }
      console.log(`[WhatsApp] ✅ Resposta (mídia) para ${cleanNumber}`);
      res.json({ reply: agentReply.reply });
    } else {
      console.error(`[WhatsApp] ❌ Erro do agente (mídia): ${agentReply.error}`);
      res.json({ reply: null });
    }

    // Lead classification (skip for owner)
    if (!ownerMode && textForAgent) {
      try {
        const classification = classifyLead(textForAgent);
        await upsertLead({
          contact: cleanNumber,
          channel: "whatsapp",
          classification,
          lastMessage: textForAgent.substring(0, 200),
        });
      } catch (leadErr) {
        console.error("[WhatsApp] ⚠️ Erro ao classificar lead (mídia):", leadErr);
      }
    }
  } catch (err) {
    console.error("[WhatsApp] ❌ Erro ao processar mídia:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// ──────────────────────────────────────────────
// Jarvis-only: Calendar Meeting Endpoint
// ──────────────────────────────────────────────

app.post("/api/jarvis/meeting", async (req, res) => {
  const { from, title, startTime, durationMinutes, attendees, description, location, clientPhone } = req.body as {
    from?: string;
    title: string;
    startTime: string;
    durationMinutes?: number;
    attendees?: string[];
    description?: string;
    location?: string;
    clientPhone?: string;
  };

  // Restringir ao owner
  const cleanNumber = (from || "").replace(/@c\.us$/, "").replace(/\D/g, "");
  if (!isOwner(cleanNumber) && from) {
    res.status(403).json({ error: "Acesso restrito ao modo Jarvis" });
    return;
  }

  if (!title || !startTime) {
    res.status(400).json({ error: "title e startTime são obrigatórios" });
    return;
  }

  try {
    const result = await createMeeting({
      title,
      startTime,
      durationMinutes,
      attendees,
      description,
      location,
      clientPhone,
    });
    res.json(result);
  } catch (err) {
    console.error("[Jarvis:Meeting] ❌ Erro:", err);
    res.status(500).json({ error: "Erro ao criar reunião" });
  }
});

export default app;

if (!process.env.VERCEL) {
  // Setup Vite or Static files depending on env
  (async () => {
    let server: ReturnType<typeof app.listen>;

    if (process.env.NODE_ENV === "development") {
      server = app.listen(port, () => {
        console.log(`[Server] Listening on http://localhost:${port}`);
      });

      await setupVite(app, server);
    } else {
      serveStatic(app);
      server = app.listen(port, () => {
        console.log(`[Server] Listening on http://localhost:${port}`);
      });
    }

    // ─────────────────────────────────────────────
    // Start Background Monitors
    // ─────────────────────────────────────────────
    startTokenMonitor();
    startCreditsMonitor();
    startEmailMonitor();
    startFollowUpMonitor();
    startInstagramEngagement();

    // Graceful shutdown
    const shutdown = () => {
      console.log("[Server] Shutting down...");
      if (server) {
        server.close(() => {
          console.log("[Server] Closed successfully");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    // Global Error Handlers (prevent silent crashes)
    process.on("uncaughtException", (err) => {
      console.error("[Server] Uncaught Exception:", err);
      // Optional: Restart gracefully or just log. keeping it alive might be risky but prevents immediate exit.
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("[Server] Unhandled Rejection at:", promise, "reason:", reason);
    });
  })();
}
