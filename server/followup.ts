/**
 * Automatic Follow-up (Sales Intelligence)
 * ==========================================
 * Cronjob that checks every hour for leads that need follow-up.
 *
 * Follow-up schedule:
 *   Stage 0 → 1 day after last interaction
 *   Stage 1 → 3 days after
 *   Stage 2 → 7 days after
 *   Stage 3+ → No more follow-ups
 *
 * Sends follow-up messages via WhatsApp using the Pixel agent.
 */

import { enviarMensagemAgente } from "../agente-pixelobra/agente_responses_api";
import { sendWhatsAppSystemAlert } from "./whatsapp-alert";
import { getLeadsDueForFollowUp, advanceFollowUpStage } from "./leads";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hora

// WhatsApp Service for sending follow-ups directly to leads
const WPP_URL = process.env.WPP_SERVICE_URL ?? "http://localhost:3010";

// ─────────────────────────────────────────────
// Follow-up Messages by Stage
// ─────────────────────────────────────────────

const FOLLOW_UP_PROMPTS: Record<number, string> = {
  0: "Gere uma mensagem gentil de follow-up de 1 dia para um potencial cliente da Pixel Obra que demonstrou interesse. Seja breve, simpático e relembre os serviços de renderização com IA. Máximo 3 linhas.",
  1: "Gere uma mensagem de follow-up de 3 dias para um lead da Pixel Obra. Ofereça algo de valor como um orçamento gratuito ou um exemplo de projeto anterior. Seja amigável e não insistente. Máximo 3 linhas.",
  2: "Gere uma última mensagem de follow-up (7 dias) para um lead da Pixel Obra. Diga que está à disposição e que pode ajudar quando o cliente estiver pronto. Finalize educadamente. Máximo 3 linhas.",
};

// ─────────────────────────────────────────────
// Process Follow-ups
// ─────────────────────────────────────────────

async function processFollowUps(): Promise<void> {
  console.log("[Follow-up] 🔍 Verificando leads para follow-up...");

  try {
    const dueLeads = await getLeadsDueForFollowUp();

    if (dueLeads.length === 0) {
      console.log("[Follow-up] ✅ Nenhum follow-up pendente");
      return;
    }

    console.log(`[Follow-up] 📋 ${dueLeads.length} lead(s) para follow-up`);

    for (const lead of dueLeads) {
      try {
        const stage = lead.followUpStage;
        const prompt = FOLLOW_UP_PROMPTS[stage] ?? FOLLOW_UP_PROMPTS[2];

        // Generate personalized follow-up message
        const contextPrompt =
          `${prompt}\n\n` +
          `Contexto do lead:\n` +
          `- Nome: ${lead.name ?? "Cliente"}\n` +
          `- Canal: ${lead.channel}\n` +
          `- Classificação: ${lead.classification}\n` +
          `- Última mensagem: "${(lead.lastMessage ?? "").substring(0, 100)}"`;

        const agentReply = await enviarMensagemAgente(contextPrompt);

        if (agentReply.success && agentReply.reply) {
          if (lead.channel === "whatsapp") {
            // Send directly via wpp-service
            try {
              const res = await fetch(`${WPP_URL}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  number: lead.contact.replace(/\D/g, ""),
                  text: agentReply.reply,
                }),
              });

              if (res.ok) {
                console.log(
                  `[Follow-up] ✅ Follow-up enviado para ${lead.contact} (stage ${stage})`
                );
              } else {
                console.error(
                  `[Follow-up] ❌ Erro ao enviar para ${lead.contact}: ${res.status}`
                );
              }
            } catch (err) {
              console.error(
                `[Follow-up] ❌ wpp-service indisponível para ${lead.contact}`
              );
            }
          } else {
            // For Instagram/Email leads, notify owner via WhatsApp
            await sendWhatsAppSystemAlert(
              `📋 *FOLLOW-UP PENDENTE*\n\n` +
                `👤 *Lead:* ${lead.name ?? lead.contact}\n` +
                `📱 *Canal:* ${lead.channel}\n` +
                `🔥 *Classificação:* ${lead.classification}\n` +
                `📅 *Stage:* ${stage + 1}/3\n\n` +
                `💬 *Sugestão do Pixel:*\n${agentReply.reply}\n\n` +
                `_Responda manualmente pelo ${lead.channel}._`
            );
            console.log(
              `[Follow-up] 📩 Alerta de follow-up enviado para owner (${lead.contact})`
            );
          }

          // Advance to next stage
          await advanceFollowUpStage(lead.id);
        }
      } catch (err) {
        console.error(
          `[Follow-up] ❌ Erro ao processar lead ${lead.contact}:`,
          err
        );
      }
    }
  } catch (error) {
    console.error("[Follow-up] ❌ Erro geral:", error);
  }
}

// ─────────────────────────────────────────────
// Start / Stop
// ─────────────────────────────────────────────

let interval: ReturnType<typeof setInterval> | null = null;

export function startFollowUpMonitor(): void {
  if (interval) return;
  console.log("[Follow-up] 🚀 Iniciando monitor de follow-up (a cada 1h)");

  // First check after 2 minutes (allow system to fully boot)
  setTimeout(() => processFollowUps().catch(console.error), 2 * 60 * 1000);

  interval = setInterval(
    () => processFollowUps().catch(console.error),
    CHECK_INTERVAL_MS
  );
}

export function stopFollowUpMonitor(): void {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log("[Follow-up] ⏹️  Monitor de follow-up parado");
  }
}
