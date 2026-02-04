import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendContactEmail, verifyEmailConfig } from "./email";

// Contact form validation schema
const contactFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF/CNPJ é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Contact form router
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
});

export type AppRouter = typeof appRouter;
