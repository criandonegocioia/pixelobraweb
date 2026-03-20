/**
 * Instagram Token Monitor
 * ========================
 * Verifica o token do Facebook/Instagram a cada 6 horas.
 * Alerta via WhatsApp quando o token estiver próximo de expirar.
 *
 * Token atual: expira em 16 de maio de 2026.
 * Alertas: 7 dias antes, 3 dias antes, 24 horas antes.
 */

import { sendWhatsAppSystemAlert } from "./whatsapp-alert";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 horas

// Data de expiração do token atual (16 de maio de 2026)
// Atualizar quando renovar o token
const TOKEN_EXPIRY_DATE = new Date("2026-05-16T23:59:59-03:00");

const RENEW_URL = "https://developers.facebook.com/tools/explorer/";

// ─────────────────────────────────────────────
// Verificação
// ─────────────────────────────────────────────

async function checkTokenExpiration(): Promise<void> {
  const now       = Date.now();
  const expiresAt = TOKEN_EXPIRY_DATE.getTime();
  const timeLeft  = expiresAt - now;

  const daysLeft  = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

  console.log(`[Monitor:Token] 🔍 Token Instagram expira em ${daysLeft} dia(s) | ${TOKEN_EXPIRY_DATE.toLocaleDateString("pt-BR")}`);

  if (timeLeft <= 0) {
    // === EXPIRADO ===
    await sendWhatsAppSystemAlert(
      `🚨 *PIXEL OBRA — Token Instagram EXPIRADO!*\n\n` +
      `O token de acesso da Pixel Obra expirou.\n\n` +
      `⚡ Renovar AGORA:\n${RENEW_URL}\n\n` +
      `Sem isso, o agente Pixel não consegue postar nem responder no Instagram.`
    );

  } else if (hoursLeft <= 24) {
    // === MENOS DE 24 HORAS ===
    await sendWhatsAppSystemAlert(
      `🚨 *PIXEL OBRA — Token Instagram expira em ${hoursLeft}h!*\n\n` +
      `Renove AGORA antes que o agente pare de funcionar:\n${RENEW_URL}`
    );

  } else if (daysLeft <= 3) {
    // === MENOS DE 3 DIAS ===
    await sendWhatsAppSystemAlert(
      `⚠️ *PIXEL OBRA — Token Instagram expira em ${daysLeft} dia(s)!*\n\n` +
      `Data de expiração: ${TOKEN_EXPIRY_DATE.toLocaleDateString("pt-BR")}\n\n` +
      `Renovar em: ${RENEW_URL}`
    );

  } else if (daysLeft <= 7) {
    // === MENOS DE 7 DIAS ===
    await sendWhatsAppSystemAlert(
      `⚠️ *PIXEL OBRA — Token Instagram expira em ${daysLeft} dias!*\n\n` +
      `Programe a renovação até ${TOKEN_EXPIRY_DATE.toLocaleDateString("pt-BR")}.\n\n` +
      `Renovar em: ${RENEW_URL}`
    );

  } else {
    // === TUDO OK ===
    console.log(`[Monitor:Token] ✅ Token válido por mais ${daysLeft} dias`);
  }
}

// ─────────────────────────────────────────────
// Start / Stop
// ─────────────────────────────────────────────

let interval: ReturnType<typeof setInterval> | null = null;

export function startTokenMonitor(): void {
  if (interval) return;
  console.log(`[Monitor:Token] 🚀 Iniciando cron de token Instagram (a cada 6h) | Expira: ${TOKEN_EXPIRY_DATE.toLocaleDateString("pt-BR")}`);

  // Primeira verificação imediata
  checkTokenExpiration().catch(console.error);

  interval = setInterval(() => checkTokenExpiration().catch(console.error), CHECK_INTERVAL_MS);
}

export function stopTokenMonitor(): void {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log("[Monitor:Token] ⏹️  Cron de token parado");
  }
}
