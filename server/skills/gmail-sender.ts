/**
 * Skill: Gmail API — Envio de e-mails pelo agente
 * =================================================
 * Usa nodemailer com SMTP do Gmail (mesma config do site).
 * Permite que o agente envie e-mails em nome da Pixel Obra:
 * - E-mails de orçamento/proposta
 * - Forwarding de arquivos recebidos via WhatsApp
 * - Notificações automáticas
 *
 * Credenciais: EMAIL_USER e EMAIL_PASS do .env (app password).
 */

import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

// ─────────────────────────────────────────────
// Transporter Gmail SMTP (mesmo padrão do site)
// ─────────────────────────────────────────────

function createTransporter() {
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
// Tipos
// ─────────────────────────────────────────────

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─────────────────────────────────────────────
// Enviar E-mail Genérico
// ─────────────────────────────────────────────

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    if (!ENV.emailUser || !ENV.emailPass) {
      return { success: false, error: "Credenciais de e-mail não configuradas" };
    }

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"Pixel Obra" <${ENV.emailUser}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });

    console.log(`[Gmail] ✅ E-mail enviado para ${options.to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Gmail] ❌ Erro:", msg);
    return { success: false, error: msg };
  }
}

// ─────────────────────────────────────────────
// E-mail de Proposta/Orçamento
// ─────────────────────────────────────────────

export interface ProposalEmailData {
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  projectType: string;
  description: string;
  agentSummary?: string;
}

export async function sendProposalEmail(data: ProposalEmailData): Promise<EmailResult> {
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #00D4FF; border-bottom: 2px solid #00D4FF; padding-bottom: 10px;">
    📋 Nova Solicitação via WhatsApp — Pixel Obra
  </h2>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">👤 Cliente:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.clientName}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📱 WhatsApp:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <a href="https://wa.me/${data.clientPhone}">${data.clientPhone}</a>
      </td>
    </tr>
    ${data.clientEmail ? `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📩 E-mail:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.clientEmail}</td>
    </tr>` : ""}
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">🏗️ Tipo:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.projectType}</td>
    </tr>
  </table>

  <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
    <h3 style="margin-top: 0; color: #333;">Descrição:</h3>
    <p style="white-space: pre-wrap; color: #555;">${data.description}</p>
  </div>

  ${data.agentSummary ? `
  <div style="background: #e8f4ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
    <h3 style="margin-top: 0; color: #0066cc;">🤖 Resumo do Agente Pixel:</h3>
    <p style="color: #555;">${data.agentSummary}</p>
  </div>` : ""}

  <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
    Enviado automaticamente pelo agente Pixel Obra via WhatsApp.
  </p>
</div>`;

  return sendEmail({
    to: ENV.emailUser, // Envia para a própria inbox da empresa
    subject: `📋 Orçamento WhatsApp — ${data.clientName} | ${data.projectType}`,
    html,
  });
}

// ─────────────────────────────────────────────
// Forward de Arquivo via E-mail
// ─────────────────────────────────────────────

export async function forwardFileByEmail(
  clientPhone: string,
  filename: string,
  fileData: Buffer,
  mimeType: string
): Promise<EmailResult> {
  return sendEmail({
    to: ENV.emailUser,
    subject: `📎 Arquivo recebido via WhatsApp — ${clientPhone}`,
    html: `
<div style="font-family: Arial, sans-serif;">
  <h3 style="color: #00D4FF;">Arquivo recebido via WhatsApp</h3>
  <p><strong>📱 De:</strong> <a href="https://wa.me/${clientPhone}">${clientPhone}</a></p>
  <p><strong>📄 Arquivo:</strong> ${filename}</p>
  <p>O arquivo está em anexo.</p>
</div>`,
    attachments: [{
      filename,
      content: fileData,
      contentType: mimeType,
    }],
  });
}
