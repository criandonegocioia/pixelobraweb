/**
 * Email Inbox Monitor (IMAP)
 * ===========================
 * Monitors the Pixel Obra inbox for proposal emails every 15 minutes.
 * When a proposal-related email is detected:
 *   1. Summarizes it using the Pixel agent (OpenAI Responses API)
 *   2. Sends a WhatsApp alert with the summary
 *   3. Marks the email as read
 *
 * Uses `imapflow` for modern, promise-based IMAP access.
 *
 * Requires .env:
 *   IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS
 */

import { ENV } from "./_core/env";
import { enviarMensagemAgente } from "../agente-pixelobra/agente_responses_api";
import { sendWhatsAppSystemAlert } from "./whatsapp-alert";
import { upsertLead } from "./leads";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const CHECK_INTERVAL_MS = 15 * 60 * 1000; // 15 minutos

// Palavras-chave que indicam e-mail de proposta/orçamento
const PROPOSAL_KEYWORDS = [
  "orçamento", "orcamento", "proposta", "projeto", "cotação", "cotacao",
  "interessado", "interesse", "render", "renderiz", "reforma", "construção",
  "construcao", "obra", "planta", "arquitet", "decoração", "decoracao",
  "preço", "preco", "quanto custa", "valor", "investimento",
];

// Remetentes de sistema / noreply — NUNCA são propostas
const SYSTEM_SENDERS: string[] = [
  // Meta / Facebook / Instagram / WhatsApp
  "notification@email.meta.com",
  "noreply@facebookmail.com",
  "security@facebookmail.com",
  "notification@facebookmail.com",
  "support@instagram.com",
  "noreply@whatsapp.com",
  // Google
  "noreply@google.com",
  "no-reply@accounts.google.com",
  "noreply@youtube.com",
  "googleplay-noreply@google.com",
  // Microsoft
  "noreply@microsoft.com",
  "account-security-noreply@accountprotection.microsoft.com",
  // Amazon
  "noreply@amazon.com.br",
  "auto-confirm@amazon.com.br",
  // Hosting / DevOps
  "noreply@github.com",
  "notifications@github.com",
  "noreply@vercel.com",
  "noreply@cloudflare.com",
  // Pagamentos
  "noreply@pagseguro.uol.com.br",
  "noreply@mercadopago.com",
];

// Padrões de domínio/prefix que indicam emails automáticos
const SYSTEM_SENDER_PATTERNS: RegExp[] = [
  /^no-?reply@/i,
  /^notification[s]?@/i,
  /^alert[s]?@/i,
  /^security@/i,
  /^mailer-daemon@/i,
  /^postmaster@/i,
  /^auto[-_]?confirm@/i,
  /^bounce[s]?@/i,
];

// ─────────────────────────────────────────────
// IMAP Connection
// ─────────────────────────────────────────────

async function checkInbox(): Promise<void> {
  if (!ENV.imapUser || !ENV.imapPass) {
    console.warn("[Monitor:Email] ⚠️  Credenciais IMAP não configuradas");
    return;
  }

  console.log("[Monitor:Email] 🔍 Verificando inbox...");

  let client: any;

  try {
    // Dynamic import to avoid crash if imapflow is not installed
    const { ImapFlow } = await import("imapflow");

    client = new ImapFlow({
      host: ENV.imapHost,
      port: ENV.imapPort,
      secure: true,
      auth: {
        user: ENV.imapUser,
        pass: ENV.imapPass,
      },
      logger: false,
    });

    await client.connect();

    // Open INBOX
    const lock = await client.getMailboxLock("INBOX");

    try {
      // Search for unseen (unread) emails
      const messages = client.fetch(
        { seen: false },
        {
          envelope: true,
          source: false,
          bodyStructure: true,
          headers: ["from", "subject", "date"],
          bodyParts: ["1"], // plain text part
        }
      );

      let processedCount = 0;

      for await (const msg of messages) {
        const subject = msg.envelope?.subject ?? "";
        const from = msg.envelope?.from?.[0];
        const senderName = from?.name ?? "Desconhecido";
        const senderEmail = from?.address ?? "";
        const date = msg.envelope?.date
          ? new Date(msg.envelope.date).toLocaleDateString("pt-BR")
          : "";

        // ── Filtrar remetentes de sistema (noreply, notification, etc.)
        const emailLower = senderEmail.toLowerCase();
        const isSystemSender =
          SYSTEM_SENDERS.includes(emailLower) ||
          SYSTEM_SENDER_PATTERNS.some((p) => p.test(emailLower));

        if (isSystemSender) {
          // Marcar como lido e pular
          try {
            await client.messageFlagsAdd(msg.seq, ["\\Seen"], { uid: false });
          } catch {
            // Ignore flag errors
          }
          continue;
        }

        // Get body text
        let bodyText = "";
        if (msg.bodyParts) {
          for (const [, value] of msg.bodyParts) {
            bodyText += value.toString("utf-8");
          }
        }

        // Combine subject + body for keyword search
        const fullText = `${subject} ${bodyText}`.toLowerCase();

        // Check if email matches proposal keywords
        const isProposal = PROPOSAL_KEYWORDS.some((kw) =>
          fullText.includes(kw)
        );

        if (!isProposal) continue;

        processedCount++;
        console.log(
          `[Monitor:Email] 📧 Proposta detectada de ${senderName} <${senderEmail}>: "${subject}"`
        );

        // Summarize with Pixel Agent
        const resumoPrompt =
          `[E-mail de proposta recebido]\n` +
          `De: ${senderName} <${senderEmail}>\n` +
          `Assunto: ${subject}\n` +
          `Data: ${date}\n\n` +
          `Conteúdo:\n${bodyText.substring(0, 2000)}\n\n` +
          `Resuma este e-mail de proposta em 3-4 linhas. ` +
          `Identifique: tipo de projeto, urgência, orçamento estimado (se mencionado), ` +
          `e sugira uma resposta rápida.`;

        const agentReply = await enviarMensagemAgente(resumoPrompt);

        // Send WhatsApp alert
        const alertMsg =
          `📧 *NOVA PROPOSTA POR E-MAIL*\n\n` +
          `👤 *De:* ${senderName}\n` +
          `📩 *Email:* ${senderEmail}\n` +
          `📋 *Assunto:* ${subject}\n` +
          `📅 *Data:* ${date}\n\n` +
          `📝 *Resumo do Agente Pixel:*\n` +
          `${agentReply.reply ?? "Não foi possível resumir"}\n\n` +
          `💡 Responda pelo e-mail ou entre em contato pelo WhatsApp.`;

        await sendWhatsAppSystemAlert(alertMsg);

        // Register as lead
        await upsertLead({
          contact: senderEmail,
          name: senderName,
          channel: "email",
          classification: "warm", // Proposals are at least warm
          lastMessage: `[${subject}] ${bodyText.substring(0, 200)}`,
        });

        // Mark email as seen
        try {
          await client.messageFlagsAdd(msg.seq, ["\\Seen"], { uid: false });
        } catch {
          // Ignore flag errors — not critical
        }

        // Process max 5 emails per check to avoid timeouts
        if (processedCount >= 5) break;
      }

      if (processedCount === 0) {
        console.log("[Monitor:Email] ✅ Nenhum e-mail de proposta pendente");
      } else {
        console.log(
          `[Monitor:Email] ✅ ${processedCount} proposta(s) processada(s)`
        );
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);

    // Check if imapflow is not installed
    if (errMsg.includes("Cannot find module") || errMsg.includes("imapflow")) {
      console.warn(
        "[Monitor:Email] ⚠️  Módulo 'imapflow' não instalado. Execute: pnpm add imapflow"
      );
      return;
    }

    console.error("[Monitor:Email] ❌ Erro ao verificar inbox:", errMsg);
  } finally {
    try {
      if (client?.close) await client.close();
    } catch {
      // Ignore close errors
    }
  }
}

// ─────────────────────────────────────────────
// Start / Stop
// ─────────────────────────────────────────────

let interval: ReturnType<typeof setInterval> | null = null;

export function startEmailMonitor(): void {
  if (interval) return;

  if (!ENV.imapUser || !ENV.imapPass) {
    console.warn(
      "[Monitor:Email] ⚠️  IMAP não configurado — monitor de e-mail desativado"
    );
    return;
  }

  console.log(
    `[Monitor:Email] 🚀 Iniciando monitor de inbox IMAP (a cada 15 min) | ${ENV.imapUser}@${ENV.imapHost}`
  );

  // First check after 30 seconds (allow server to fully start)
  setTimeout(() => checkInbox().catch(console.error), 30_000);

  interval = setInterval(
    () => checkInbox().catch(console.error),
    CHECK_INTERVAL_MS
  );
}

export function stopEmailMonitor(): void {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log("[Monitor:Email] ⏹️  Monitor de inbox parado");
  }
}
