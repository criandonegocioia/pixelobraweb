/**
 * WhatsApp System Alert
 * ======================
 * Módulo centralizado para enviar alertas do sistema via WhatsApp.
 *
 * Integração: usa o wpp-service (whatsapp-web.js) rodando em WPP_SERVICE_URL.
 * Acesse http://localhost:3010/qr para escanear o QR code e conectar o WhatsApp.
 *
 * Número de alerta: configurado em WHATSAPP_ALERT_NUMBER (.env)
 */

const ALERT_NUMBER  = (process.env.WHATSAPP_ALERT_NUMBER ?? "").replace(/\D/g, "");
const WPP_URL       = process.env.WPP_SERVICE_URL ?? "http://localhost:3010";

// ─────────────────────────────────────────────
// Send Alert
// ─────────────────────────────────────────────

export async function sendWhatsAppSystemAlert(mensagem: string): Promise<void> {
  const timestamp = new Date().toLocaleString("pt-BR", { timeZone: "America/Fortaleza" });
  const fullMsg   = `${mensagem}\n\n_🤖 Mensagem automática do sistema Pixel Obra — ${timestamp}_`;

  // Log sempre (independente da integração)
  console.log(`\n${"─".repeat(60)}`);
  console.log(`[ALERTA WhatsApp → ${ALERT_NUMBER}]`);
  console.log(fullMsg);
  console.log(`${"─".repeat(60)}\n`);

  if (!ALERT_NUMBER) {
    console.warn("[WhatsApp Alert] ⚠️  WHATSAPP_ALERT_NUMBER não configurado no .env");
    return;
  }

  // ── Verificar se o serviço está conectado ────
  try {
    const statusRes = await fetch(`${WPP_URL}/status`);
    const status = await statusRes.json() as { ready: boolean; status: string };
    if (!status.ready) {
      console.warn(`[WhatsApp Alert] ⚠️  wpp-service não está pronto. Status: ${status.status}`);
      console.warn(`[WhatsApp Alert] 👉 Para conectar, acesse: http://localhost:3010/qr`);
      return;
    }
  } catch (err) {
    console.error("[WhatsApp Alert] ❌ Não foi possível conectar ao wpp-service:", err);
    return;
  }

  // ── Enviar mensagem ──────────────────────────
  try {
    const res = await fetch(`${WPP_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: ALERT_NUMBER,
        text: fullMsg,
      }),
    });

    if (res.ok) {
      console.log(`[WhatsApp Alert] ✅ Mensagem enviada para ${ALERT_NUMBER}`);
    } else {
      const err = await res.text();
      console.error(`[WhatsApp Alert] ❌ Erro wpp-service: ${res.status} — ${err}`);
    }
  } catch (err) {
    console.error("[WhatsApp Alert] ❌ Falha ao enviar via wpp-service:", err);
  }
}
