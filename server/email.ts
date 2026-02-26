import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: ENV.emailUser,
      pass: ENV.emailPass,
    },
    // Force IPv4 and bypass SSL for stability
    family: 4,
    tls: {
      rejectUnauthorized: false,
    },
  } as nodemailer.TransportOptions);
};

export interface ContactFormData {
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  descricao: string;
}

export async function sendContactEmail(
  data: ContactFormData
): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: ENV.emailUser,
      to: ENV.emailUser,
      subject: `URGENTE: Solicitação de Orçamento - ${data.nome}`,
      text: `
Nome: ${data.nome}
CPF/CNPJ: ${data.cpfCnpj}
E-mail: ${data.email}
Telefone: ${data.telefone}

Descrição:
${data.descricao}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #00D4FF; border-bottom: 2px solid #00D4FF; padding-bottom: 10px;">
    Nova Solicitação de Orçamento - Pixel Obra
  </h2>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nome:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.nome}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">CPF/CNPJ:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.cpfCnpj}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">E-mail:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <a href="mailto:${data.email}">${data.email}</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">WhatsApp:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <a href="https://wa.me/${data.telefone.replace(/\D/g, "")}">${data.telefone}</a>
      </td>
    </tr>
  </table>
  
  <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
    <h3 style="margin-top: 0; color: #333;">Descrição do Projeto:</h3>
    <p style="white-space: pre-wrap; color: #555;">${data.descricao}</p>
  </div>
  
  <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
    Este e-mail foi enviado automaticamente pelo formulário de contato do site Pixel Obra.
  </p>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email enviado com sucesso!" };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Erro ao enviar email: ${errorMessage}` };
  }
}

// Function to verify email configuration
export async function verifyEmailConfig(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (!ENV.emailUser || !ENV.emailPass) {
      return {
        success: false,
        message: "Credenciais de e-mail não configuradas",
      };
    }

    const transporter = createTransporter();
    await transporter.verify();
    return {
      success: true,
      message: "Configuração de e-mail verificada com sucesso",
    };
  } catch (error) {
    console.error("Erro ao verificar configuração de email:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Erro na verificação: ${errorMessage}` };
  }
}
