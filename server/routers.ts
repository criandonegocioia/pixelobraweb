import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendContactEmail, verifyEmailConfig } from "./email";
import {
  chatCompletion,
  analyzeImage,
  generateInstagramCaption,
  generateAutoReply,
} from "./openai";
import {
  getAccountInfo,
  publishInstagramPost,
  getRecentPosts,
  verifyToken,
} from "./instagram";
import { getLeads, getLeadStats, updateLeadStatus } from "./leads";

// ─────────────────────────────────────────────
// Schemas de validação
// ─────────────────────────────────────────────

const contactFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF/CNPJ é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  systemPrompt: z.string().optional(),
});

const imageAnalysisSchema = z.object({
  imageUrl: z.string().url("URL da imagem inválida"),
  question: z.string().optional(),
});

const instagramCaptionSchema = z.object({
  projectDescription: z.string().min(1, "Descrição do projeto é obrigatória"),
  serviceType: z.string().optional(),
});

const autoReplySchema = z.object({
  customerMessage: z.string().min(1, "Mensagem do cliente é obrigatória"),
  channel: z.enum(["whatsapp", "email"]),
});

const publishPostSchema = z.object({
  imageUrl: z.string().url("URL da imagem inválida"),
  caption: z.string().min(1, "Legenda é obrigatória"),
  accountId: z.string().optional(),
});

// ─────────────────────────────────────────────
// Router principal
// ─────────────────────────────────────────────

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Formulário de Contato ───────────────────
  contact: router({
    submit: publicProcedure
      .input(contactFormSchema)
      .mutation(async ({ input }) => {
        const result = await sendContactEmail(input);
        return result;
      }),
    verifyConfig: publicProcedure.query(async () => {
      const result = await verifyEmailConfig();
      return result;
    }),
  }),

  // ─── OpenAI / IA ────────────────────────────
  ai: router({
    /**
     * Chat com GPT-4o — atendimento humanizado e criação de conteúdo
     */
    chat: publicProcedure
      .input(chatSchema)
      .mutation(async ({ input }) => {
        const result = await chatCompletion(
          input.messages as Parameters<typeof chatCompletion>[0],
          input.systemPrompt
        );
        return result;
      }),

    /**
     * Análise de imagem com GPT-4o Vision — interpreta fotos de projetos
     */
    analyzeImage: publicProcedure
      .input(imageAnalysisSchema)
      .mutation(async ({ input }) => {
        const result = await analyzeImage(input.imageUrl, input.question);
        return result;
      }),

    /**
     * Geração de legenda para Instagram com CTA para www.pixelobra.com
     */
    generateCaption: publicProcedure
      .input(instagramCaptionSchema)
      .mutation(async ({ input }) => {
        const result = await generateInstagramCaption(
          input.projectDescription,
          input.serviceType
        );
        return result;
      }),

    /**
     * Resposta automática humanizada para WhatsApp e Email
     */
    autoReply: publicProcedure
      .input(autoReplySchema)
      .mutation(async ({ input }) => {
        const result = await generateAutoReply(
          input.customerMessage,
          input.channel
        );
        return result;
      }),
  }),

  // ─── Instagram / Facebook ───────────────────
  instagram: router({
    /**
     * Verifica se o token do Facebook está válido
     */
    verifyToken: publicProcedure.query(async () => {
      const result = await verifyToken();
      return result;
    }),

    /**
     * Busca informações da conta do Instagram Business
     */
    accountInfo: publicProcedure.query(async () => {
      const result = await getAccountInfo();
      return result;
    }),

    /**
     * Lista os posts mais recentes do Instagram
     */
    recentPosts: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional() }))
      .query(async ({ input }) => {
        const result = await getRecentPosts(undefined, input.limit ?? 10);
        return result;
      }),

    /**
     * Publica uma imagem no Instagram com legenda gerada pela IA
     */
    publishPost: publicProcedure
      .input(publishPostSchema)
      .mutation(async ({ input }) => {
        const result = await publishInstagramPost(
          input.imageUrl,
          input.caption,
          input.accountId
        );
        return result;
      }),
  }),

  // ─── Leads (Sales Intelligence) ─────────────
  leads: router({
    /**
     * Lista leads com filtros opcionais
     */
    list: publicProcedure
      .input(
        z.object({
          classification: z.enum(["hot", "warm", "cold"]).optional(),
          channel: z.enum(["whatsapp", "instagram", "email"]).optional(),
          status: z.enum(["open", "responded", "closed", "converted"]).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return await getLeads(input ?? undefined);
      }),

    /**
     * Estatísticas agregadas de leads
     */
    stats: publicProcedure.query(async () => {
      return await getLeadStats();
    }),

    /**
     * Atualiza o status de um lead
     */
    updateStatus: publicProcedure
      .input(
        z.object({
          leadId: z.number(),
          status: z.enum(["open", "responded", "closed", "converted"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateLeadStatus(input.leadId, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
