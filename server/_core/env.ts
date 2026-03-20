export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "https://api.openai.com",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
  emailUser: process.env.EMAIL_USER ?? "",
  emailPass: process.env.EMAIL_PASS ?? "",
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  // Facebook / Instagram
  facebookAccessToken: process.env.FACEBOOK_ACCESS_TOKEN ?? "",
  instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID ?? "",
  // Webhooks
  webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN ?? "pixel_obra_webhook_2024",
  // WhatsApp Alerts (número para receber alertas do sistema)
  whatsappAlertNumber: process.env.WHATSAPP_ALERT_NUMBER ?? "",
  // IMAP (Monitor de E-mails de Proposta)
  imapHost: process.env.IMAP_HOST ?? "imap.gmail.com",
  imapPort: parseInt(process.env.IMAP_PORT ?? "993", 10),
  imapUser: process.env.IMAP_USER ?? process.env.EMAIL_USER ?? "",
  imapPass: process.env.IMAP_PASS ?? process.env.EMAIL_PASS ?? "",
};
