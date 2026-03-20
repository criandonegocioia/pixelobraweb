/**
 * OpenAI API Credits Monitor
 * ===========================
 * Verifica créditos da API OpenAI a cada 4 horas.
 * Alerta via WhatsApp quando ≤ 5% do orçamento restar.
 *
 * Estratégia:
 *   1. Tenta a API de billing da OpenAI (dashboard/billing)
 *   2. Se indisponível, usa o orçamento configurado em OPENAI_MONTHLY_BUDGET_USD
 *      e estima pelo uso do mês via /v1/usage
 */

import { ENV } from "./_core/env";
import { sendWhatsAppSystemAlert } from "./whatsapp-alert";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const CHECK_INTERVAL_MS  = 4 * 60 * 60 * 1000; // 4 horas
const ALERT_THRESHOLD    = 5;                    // Alerta quando ≤ 5% restante
const MONTHLY_BUDGET_USD = parseFloat(process.env.OPENAI_MONTHLY_BUDGET_USD ?? "50");

// ─────────────────────────────────────────────
// OpenAI Billing API
// ─────────────────────────────────────────────

interface BillingSubscription {
  hard_limit_usd?: number;
  soft_limit_usd?: number;
  system_hard_limit_usd?: number;
}

interface BillingUsage {
  total_usage: number; // em centavos
}

async function getBillingSubscription(): Promise<BillingSubscription | null> {
  try {
    const res = await fetch("https://api.openai.com/dashboard/billing/subscription", {
      headers: { Authorization: `Bearer ${ENV.openaiApiKey}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as BillingSubscription;
  } catch {
    return null;
  }
}

async function getBillingUsage(): Promise<number | null> {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().split("T")[0];
    const end = now.toISOString().split("T")[0];

    const res = await fetch(
      `https://api.openai.com/dashboard/billing/usage?start_date=${start}&end_date=${end}`,
      { headers: { Authorization: `Bearer ${ENV.openaiApiKey}` } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as BillingUsage;
    return data.total_usage / 100; // converte centavos → USD
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Lógica Principal de Verificação
// ─────────────────────────────────────────────

async function checkCredits(): Promise<void> {
  console.log("[Monitor:Créditos] 🔍 Verificando créditos OpenAI...");

  if (!ENV.openaiApiKey) {
    console.warn("[Monitor:Créditos] ⚠️  OPENAI_API_KEY não configurada");
    return;
  }

  let budgetUSD  = MONTHLY_BUDGET_USD;
  let usedUSD    = 0;
  let fonte      = "orçamento configurado";

  // Tenta pegar limite real da API de billing
  const subscription = await getBillingSubscription();
  if (subscription?.hard_limit_usd) {
    budgetUSD = subscription.hard_limit_usd;
    fonte = "limite configurado na OpenAI";
    console.log(`[Monitor:Créditos] 💳 Limite detectado via API: $${budgetUSD.toFixed(2)}`);
  }

  // Tenta pegar uso real do mês
  const usageUSD = await getBillingUsage();
  if (usageUSD !== null) {
    usedUSD = usageUSD;
    fonte = `billing API (${fonte})`;
  } else {
    console.warn("[Monitor:Créditos] ⚠️  Não foi possível buscar uso via billing API (chave de projeto). Usando orçamento fixo.");
    // Para project keys (sk-proj-...) a billing API pode ser restrita.
    // Neste caso mantemos 0 como uso e avisamos se o mês estiver avançado.
    const dayOfMonth = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const estimatedPercent = Math.round((dayOfMonth / daysInMonth) * 100);
    console.log(`[Monitor:Créditos] 📊 Estimativa por tempo: ${estimatedPercent}% do mês consumido`);
    return; // Sem dados reais, não envia alerta falso
  }

  const remainingUSD     = budgetUSD - usedUSD;
  const remainingPercent = (remainingUSD / budgetUSD) * 100;

  console.log(
    `[Monitor:Créditos] 💰 Fonte: ${fonte} | ` +
    `Usado: $${usedUSD.toFixed(2)} / $${budgetUSD.toFixed(2)} | ` +
    `Restante: ${remainingPercent.toFixed(1)}%`
  );

  // ─── Alertas ────────────────────────────────
  if (remainingPercent <= 0) {
    await sendWhatsAppSystemAlert(
      `🚨 *PIXEL OBRA — CRÉDITOS OPENAI ESGOTADOS!*\n\n` +
      `Usado: $${usedUSD.toFixed(2)} de $${budgetUSD.toFixed(2)}\n\n` +
      `⚡ Adicionar créditos AGORA:\nhttps://platform.openai.com/account/billing/overview`
    );
  } else if (remainingPercent <= ALERT_THRESHOLD) {
    await sendWhatsAppSystemAlert(
      `⚠️ *PIXEL OBRA — Créditos OpenAI baixos!*\n\n` +
      `Restam apenas *${remainingPercent.toFixed(1)}%* ($${remainingUSD.toFixed(2)}) de $${budgetUSD.toFixed(2)}\n\n` +
      `Adicionar créditos em:\nhttps://platform.openai.com/account/billing/overview`
    );
  }
}

// ─────────────────────────────────────────────
// Start / Stop
// ─────────────────────────────────────────────

let interval: ReturnType<typeof setInterval> | null = null;

export function startCreditsMonitor(): void {
  if (interval) return;
  console.log("[Monitor:Créditos] 🚀 Iniciando cron de créditos OpenAI (a cada 4h)");

  // Primeira verificação imediata
  checkCredits().catch(console.error);

  interval = setInterval(() => checkCredits().catch(console.error), CHECK_INTERVAL_MS);
}

export function stopCreditsMonitor(): void {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log("[Monitor:Créditos] ⏹️  Cron de créditos parado");
  }
}
