/**
 * Skill: Calendar — Agendamento de Reuniões (v2)
 * ================================================
 * Cria eventos no Google Calendar via convite ICS enviado por e-mail.
 * Sem necessidade de Google Cloud — usa apenas Gmail SMTP.
 *
 * v2 Enhancements:
 * - UTF-8 encoding correto para caracteres especiais
 * - Compartilha reunião com cliente via WhatsApp
 * - Envia e-mail de preparação com resumo ao CEO
 * - Notifica CEO via WhatsApp com link do e-mail
 * - Gera áudio briefing via OpenAI TTS
 *
 * Credenciais: EMAIL_USER, EMAIL_PASS, OPENAI_API_KEY do .env
 */

import nodemailer from "nodemailer";
import { ENV } from "../_core/env";
import { randomUUID } from "crypto";
import { enviarMensagemAgente } from "../../agente-pixelobra/agente_responses_api";
import { sendWhatsAppSystemAlert } from "../whatsapp-alert";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface MeetingRequest {
  /** Título da reunião */
  title: string;
  /** Descrição / pauta */
  description?: string;
  /** Data e hora de início (ISO 8601 ou Date) */
  startTime: string | Date;
  /** Duração em minutos (padrão: 60) */
  durationMinutes?: number;
  /** E-mails dos participantes */
  attendees?: string[];
  /** Localização ou link do Google Meet */
  location?: string;
  /** Número WhatsApp do cliente (para compartilhar convite) */
  clientPhone?: string;
}

export interface MeetingResult {
  success: boolean;
  eventId?: string;
  emailsSent?: number;
  whatsappSent?: boolean;
  audioBriefingGenerated?: boolean;
  error?: string;
}

// ─────────────────────────────────────────────
// SMTP Transporter
// ─────────────────────────────────────────────

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: ENV.emailUser,
      pass: ENV.emailPass,
    },
    family: 4,
    tls: { rejectUnauthorized: false },
  } as nodemailer.TransportOptions);
}

// ─────────────────────────────────────────────
// Gerar ICS com UTF-8
// ─────────────────────────────────────────────

function toICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function generateICS(meeting: MeetingRequest, eventId: string): string {
  const start = new Date(meeting.startTime);
  const duration = meeting.durationMinutes || 60;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const attendeeLines = (meeting.attendees || [])
    .map(email => `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${email}`)
    .join("\r\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pixel Obra//Agente Pixel//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${eventId}@pixelobra.com.br`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY;CHARSET=UTF-8:${escapeICS(meeting.title)}`,
    `DESCRIPTION;CHARSET=UTF-8:${escapeICS(meeting.description || "Reunião agendada pela Pixel Obra.")}`,
    `LOCATION;CHARSET=UTF-8:${escapeICS(meeting.location || "Google Meet (link a definir)")}`,
    `ORGANIZER;CN=Pixel Obra:mailto:${ENV.emailUser}`,
    attendeeLines,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:Lembrete: ${escapeICS(meeting.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

// ─────────────────────────────────────────────
// Formatar data legível
// ─────────────────────────────────────────────

function formatMeetingDate(start: Date) {
  const dateFormatted = start.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFormatted = start.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Fortaleza",
  });
  return { dateFormatted, timeFormatted };
}

// ─────────────────────────────────────────────
// Gerar áudio briefing via OpenAI TTS
// ─────────────────────────────────────────────

async function generateAudioBriefing(meeting: MeetingRequest, dateStr: string, timeStr: string): Promise<Buffer | null> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;

    // Gerar texto de briefing com o agente
    const briefPrompt =
      `Gere um briefing de 30 segundos sobre esta reunião, como se estivesse preparando o CEO.\n` +
      `Título: ${meeting.title}\n` +
      `Data: ${dateStr} às ${timeStr}\n` +
      `Duração: ${meeting.durationMinutes || 60} minutos\n` +
      `Pauta: ${meeting.description || "Não especificada"}\n` +
      `Participantes: ${(meeting.attendees || []).join(", ") || "A definir"}\n\n` +
      `Fale de forma direta e profissional. Máximo 4 frases.`;

    const briefResult = await enviarMensagemAgente(briefPrompt);
    const briefText = briefResult.reply || `Reunião ${meeting.title} agendada para ${dateStr} às ${timeStr}.`;

    console.log(`[Calendar:Audio] 🎙️ Gerando áudio: "${briefText.substring(0, 60)}..."`);

    // Chamar OpenAI TTS
    const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "onyx",
        input: briefText,
        response_format: "mp3",
      }),
    });

    if (!ttsRes.ok) {
      console.error(`[Calendar:Audio] ❌ TTS falhou: ${ttsRes.status}`);
      return null;
    }

    const arrayBuffer = await ttsRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[Calendar:Audio] ✅ Áudio gerado: ${(buffer.length / 1024).toFixed(1)} KB`);
    return buffer;
  } catch (err) {
    console.error("[Calendar:Audio] ❌ Erro:", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// Enviar WhatsApp ao cliente com detalhes
// ─────────────────────────────────────────────

async function shareViaWhatsApp(
  clientPhone: string,
  meeting: MeetingRequest,
  dateStr: string,
  timeStr: string
): Promise<boolean> {
  try {
    const WPP_URL = process.env.WPP_SERVICE_URL ?? "http://localhost:3010";
    const duration = meeting.durationMinutes || 60;

    const msg =
      `📅 *Reunião Agendada — Pixel Obra*\n\n` +
      `📋 *Assunto:* ${meeting.title}\n` +
      `📅 *Data:* ${dateStr}\n` +
      `⏰ *Horário:* ${timeStr} (${duration} min)\n` +
      `📍 *Local:* ${meeting.location || "A definir"}\n` +
      (meeting.description ? `\n📝 *Pauta:* ${meeting.description}\n` : "") +
      `\n✅ Confirme sua presença respondendo esta mensagem.\n` +
      `\n_Pixel Obra — Visualização Arquitetônica com IA_`;

    const res = await fetch(`${WPP_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: clientPhone, text: msg }),
    });

    if (res.ok) {
      console.log(`[Calendar:WPP] ✅ Convite WhatsApp enviado para ${clientPhone}`);
      return true;
    }
    console.error(`[Calendar:WPP] ❌ Erro: ${res.status}`);
    return false;
  } catch (err) {
    console.error("[Calendar:WPP] ❌ Erro:", err);
    return false;
  }
}

// ─────────────────────────────────────────────
// Enviar áudio via WhatsApp ao CEO
// ─────────────────────────────────────────────

async function sendAudioToOwner(audioBuffer: Buffer): Promise<boolean> {
  try {
    const WPP_URL = process.env.WPP_SERVICE_URL ?? "http://localhost:3010";
    const ownerPhone = process.env.OWNER_PHONE || "";
    if (!ownerPhone) return false;

    const base64Audio = audioBuffer.toString("base64");

    const res = await fetch(`${WPP_URL}/send-media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: ownerPhone,
        media: base64Audio,
        filename: "briefing_reuniao.mp3",
        mimetype: "audio/mpeg",
        caption: "🎙️ Briefing da reunião agendada",
      }),
    });

    if (res.ok) {
      console.log("[Calendar:Audio] ✅ Áudio briefing enviado ao CEO via WhatsApp");
      return true;
    }
    console.error(`[Calendar:Audio] ❌ Erro ao enviar áudio: ${res.status}`);
    return false;
  } catch (err) {
    console.error("[Calendar:Audio] ❌ Erro:", err);
    return false;
  }
}

// ─────────────────────────────────────────────
// Criar Reunião (completo)
// ─────────────────────────────────────────────

export async function createMeeting(meeting: MeetingRequest): Promise<MeetingResult> {
  try {
    if (!ENV.emailUser || !ENV.emailPass) {
      return { success: false, error: "Credenciais de e-mail não configuradas" };
    }

    const eventId = randomUUID();
    const icsContent = generateICS(meeting, eventId);
    const start = new Date(meeting.startTime);
    const duration = meeting.durationMinutes || 60;
    const { dateFormatted, timeFormatted } = formatMeetingDate(start);

    console.log(`[Calendar] 📅 Criando reunião: "${meeting.title}" em ${dateFormatted} às ${timeFormatted}`);

    // ─── 1. Enviar convite ICS por e-mail ──────────────

    const allRecipients = [...new Set([
      ENV.emailUser,
      ...(meeting.attendees || []),
    ])];

    const transporter = getTransporter();

    const inviteHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #00D4FF; border-bottom: 2px solid #00D4FF; padding-bottom: 10px;">
    📅 Convite para Reunião — Pixel Obra
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">📋 Assunto:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${meeting.title}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📅 Data:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${dateFormatted}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">⏰ Horário:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${timeFormatted} (${duration} min)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📍 Local:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${meeting.location || "A definir"}</td>
    </tr>
  </table>
  ${meeting.description ? `
  <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
    <h3 style="margin-top: 0; color: #333;">Pauta:</h3>
    <p style="white-space: pre-wrap; color: #555;">${meeting.description}</p>
  </div>` : ""}
  <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
    Pixel Obra — Visualização Arquitetônica com IA
  </p>
</div>`;

    let emailsSent = 0;

    for (const recipient of allRecipients) {
      try {
        await transporter.sendMail({
          from: `"Pixel Obra" <${ENV.emailUser}>`,
          to: recipient,
          subject: `📅 Reunião: ${meeting.title} — ${dateFormatted} ${timeFormatted}`,
          html: inviteHtml,
          encoding: "utf-8",
          icalEvent: {
            method: "REQUEST",
            content: Buffer.from(icsContent, "utf-8"),
            encoding: "utf-8",
          },
        });
        emailsSent++;
        console.log(`[Calendar] ✅ Convite enviado para ${recipient}`);
      } catch (err) {
        console.error(`[Calendar] ⚠️ Erro ao enviar para ${recipient}:`, err);
      }
    }

    // ─── 2. Enviar e-mail de preparação ao CEO ──────────

    try {
      const prepPrompt =
        `Analise esta reunião e prepare um briefing estratégico para o CEO da Pixel Obra:\n\n` +
        `📋 Reunião: ${meeting.title}\n` +
        `📅 Data: ${dateFormatted} às ${timeFormatted}\n` +
        `⏰ Duração: ${duration} minutos\n` +
        `📝 Pauta: ${meeting.description || "Não especificada"}\n` +
        `👥 Participantes: ${(meeting.attendees || []).join(", ") || "Não especificados"}\n\n` +
        `Elabore os seguintes tópicos:\n` +
        `1. **Perfil do Cliente** — Quem é o solicitante? O que sabemos sobre ele? Qual setor/segmento?\n` +
        `2. **Análise da Proposta** — O que o cliente busca? Qual a demanda principal? Escopo provável do projeto.\n` +
        `3. **Sugestões de Atuação** — Como abordar essa reunião? Que serviços da Pixel Obra destacar? Quais argumentos de valor usar?\n` +
        `4. **Perguntas-Chave** — Perguntas estratégicas para fazer ao cliente durante a reunião.\n` +
        `5. **Oportunidades** — Possíveis upsells ou serviços complementares.\n\n` +
        `Seja direto, profissional e orientado a negócios.`;

      const prepResult = await enviarMensagemAgente(prepPrompt);
      const prepSummary = prepResult.reply || "Análise não disponível.";

      const prepHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #00D4FF; border-bottom: 2px solid #00D4FF; padding-bottom: 10px;">
    📋 Briefing Estratégico — Reunião
  </h2>
  <div style="background: #1a1a2e; color: #e0e0e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #00D4FF; margin-top: 0;">📅 ${meeting.title}</h3>
    <p><strong>Data:</strong> ${dateFormatted} às ${timeFormatted}</p>
    <p><strong>Duração:</strong> ${duration} min</p>
    <p><strong>Participantes:</strong> ${(meeting.attendees || []).join(", ") || "A definir"}</p>
    ${meeting.description ? `<p><strong>Pauta:</strong> ${meeting.description}</p>` : ""}
  </div>
  <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
    <h3 style="margin-top: 0; color: #333;">🎯 Análise do Agente Pixel:</h3>
    <div style="white-space: pre-wrap; color: #555; line-height: 1.6;">${prepSummary}</div>
  </div>
  <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
    Gerado pelo Agente Pixel — Modo Jarvis
  </p>
</div>`;

      await transporter.sendMail({
        from: `"Pixel — Jarvis" <${ENV.emailUser}>`,
        to: ENV.emailUser,
        subject: `📋 Prep: ${meeting.title} — ${dateFormatted} ${timeFormatted}`,
        html: prepHtml,
        encoding: "utf-8",
      });
      console.log("[Calendar] 📧 E-mail de preparação enviado ao CEO");

      // ─── 3. Notificar CEO via WhatsApp ──────────

      const whatsappSummary =
        `📅 *REUNIÃO AGENDADA*\n\n` +
        `📋 *${meeting.title}*\n` +
        `📅 ${dateFormatted} às ${timeFormatted}\n` +
        `⏱️ ${duration} min\n` +
        (meeting.description ? `📝 ${meeting.description}\n` : "") +
        `\n📧 Verifique seu e-mail para o resumo completo de preparação.\n` +
        `📩 pixelobra@gmail.com`;

      await sendWhatsAppSystemAlert(whatsappSummary);
      console.log("[Calendar] 📱 Notificação WhatsApp enviada ao CEO");
    } catch (prepErr) {
      console.error("[Calendar] ⚠️ Erro na preparação/notificação:", prepErr);
    }

    // ─── 4. Compartilhar com cliente via WhatsApp ──────

    let whatsappSent = false;
    if (meeting.clientPhone) {
      whatsappSent = await shareViaWhatsApp(meeting.clientPhone, meeting, dateFormatted, timeFormatted);
    }

    // ─── 5. Gerar e enviar áudio briefing (apenas WhatsApp) ──────────

    let audioBriefingGenerated = false;
    try {
      const audioBuffer = await generateAudioBriefing(meeting, dateFormatted, timeFormatted);
      if (audioBuffer) {
        audioBriefingGenerated = await sendAudioToOwner(audioBuffer);
      }
    } catch (audioErr) {
      console.error("[Calendar:Audio] ⚠️ Erro no briefing:", audioErr);
    }

    console.log(`[Calendar] 📅 Reunião criada: ${emailsSent} convites, WPP: ${whatsappSent}, Áudio: ${audioBriefingGenerated}`);

    return {
      success: true,
      eventId,
      emailsSent,
      whatsappSent,
      audioBriefingGenerated,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Calendar] ❌ Erro:", msg);
    return { success: false, error: msg };
  }
}

// ─────────────────────────────────────────────
// Parsear pedido de reunião natural
// ─────────────────────────────────────────────

export function parseNaturalMeetingRequest(text: string): Partial<MeetingRequest> | null {
  const lower = text.toLowerCase();

  const meetingKeywords = ["reunião", "agendar", "marcar", "meeting", "agenda", "horário"];
  if (!meetingKeywords.some(kw => lower.includes(kw))) return null;

  const result: Partial<MeetingRequest> = {};

  if (lower.includes("hoje")) {
    const d = new Date();
    result.startTime = d.toISOString();
  } else if (lower.includes("amanhã") || lower.includes("amanha")) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    result.startTime = d.toISOString();
  }

  const timeMatch = lower.match(/(\d{1,2})[h:]\s*(\d{0,2})/);
  if (timeMatch && result.startTime) {
    const d = new Date(result.startTime);
    d.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2] || "0"), 0, 0);
    result.startTime = d.toISOString();
  }

  const durationMatch = lower.match(/(\d+)\s*min/);
  if (durationMatch) {
    result.durationMinutes = parseInt(durationMatch[1]);
  }

  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const emails = text.match(emailRegex);
  if (emails) {
    result.attendees = emails;
  }

  return Object.keys(result).length > 0 ? result : null;
}
