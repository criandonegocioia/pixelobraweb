import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.use(express.json());

  // Email API Route
  app.post("/api/contact", async (req, res) => {
    try {
      const { nome, cpfCnpj, email, telefone, descricao } = req.body;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        // Force IPv4 and bypass SSL for stability
        family: 4,
        tls: {
          rejectUnauthorized: false
        }
      } as nodemailer.TransportOptions);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `URGENTE: Solicitação de Orçamento - ${nome}`,
        text: `
          Nome: ${nome}
          CPF/CNPJ: ${cpfCnpj}
          E-mail: ${email}
          Telefone: ${telefone}
          
          Descrição:
          ${descricao}
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Email enviado com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, message: `Erro ao enviar email: ${errorMessage}` });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
