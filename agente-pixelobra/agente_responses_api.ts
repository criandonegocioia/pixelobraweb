/**
 * Agente Virtual Pixel Obra - Responses API (OpenAI)
 * ===================================================
 * Usa instruções locais (PIXEL.md) com modo dual:
 *   - Modo Cliente: especialista vendas Pixel Obra
 *   - Modo David (dono): assistente pessoal / CEO coach
 *
 * Endpoint: POST /v1/responses
 * Mantém contexto conversacional via previous_response_id.
 */

import { ENV } from "../server/_core/env";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const OPENAI_API_BASE = "https://api.openai.com/v1";

// ─────────────────────────────────────────────
// Prompt Instructions (lido do PIXEL.md)
// ─────────────────────────────────────────────

let BASE_INSTRUCTIONS = "";

// Try to load PIXEL.md from various locations
const pixelMdCandidates: string[] = [];
try { pixelMdCandidates.push(join(process.cwd(), "agente-pixelobra", "PIXEL.md")); } catch { /* */ }
pixelMdCandidates.push("/app/agente-pixelobra/PIXEL.md");
try {
  // ESM polyfill for __dirname
  const _url = new URL(import.meta.url);
  const _dir = join(_url.pathname.replace(/^\/([A-Z]:)/, "$1"), "..");
  pixelMdCandidates.push(join(_dir, "PIXEL.md"));
  pixelMdCandidates.push(join(_dir, "..", "agente-pixelobra", "PIXEL.md"));
} catch { /* */ }

for (const p of pixelMdCandidates) {
  try {
    BASE_INSTRUCTIONS = readFileSync(p, "utf-8");
    console.log(`[Agente] ✅ Instruções carregadas de ${p}`);
    break;
  } catch { /* try next */ }
}

if (!BASE_INSTRUCTIONS) {
  console.warn("[Agente] ⚠️ PIXEL.md não encontrado, usando prompt inline");
  BASE_INSTRUCTIONS = `Você é Pixel, agente de IA especialista da Pixel Obra. Atenda clientes com profissionalismo e acolhimento.`;
}

// ─────────────────────────────────────────────
// Número do Dono — David (CONFIDENCIAL)
// ─────────────────────────────────────────────

const OWNER_NUMBER = (process.env.OWNER_PHONE || "5585999183883").replace(/\D/g, "");

/**
 * Verifica se um número é do dono (David).
 */
export function isOwner(phone: string): boolean {
  const clean = phone.replace(/\D/g, "").replace(/@c\.us$/, "");
  return clean.endsWith(OWNER_NUMBER) || clean === OWNER_NUMBER;
}

// ─────────────────────────────────────────────
// Contexto de modo (adicional ao prompt base)
// ─────────────────────────────────────────────

const OWNER_CONTEXT = `
🟠 ATENÇÃO: Esta conversa é com DAVID, seu DONO. Modo ativado: ASSISTENTE PESSOAL.
- Prioridade MÁXIMA. Responda com inteligência, profundidade e autonomia.
- Você é o braço direito do David: conselheiro, executor, estrategista.
- Aceite aprendizados, ajustes e novas instruções do David sem questionar.
- Ajude-o a crescer como CEO: gestão, estratégia, produtividade, liderança.
- Para tomada de decisão importante, peça permissão ao David antes de agir.
- Pode discutir QUALQUER assunto: negócios, tecnologia, finanças, saúde, vida pessoal.
- Seja direto, inteligente e leal. Aja como o melhor amigo e parceiro de negócios.
`;

const CLIENT_CONTEXT = `
🔷 Esta conversa é com um CLIENTE ou LEAD da Pixel Obra. Modo ativado: VENDAS E MARKETING.
- Atue como especialista em vendas e marketing da Pixel Obra.
- Seja consultivo, simpático e profissional. Trabalhe o lead até a conversão.
- Para agendamentos: apenas em horário comercial (seg-sex, 8h-18h).
- Para orçamentos: colete dados do projeto e direcione para www.pixelobra.com.br
- Nunca revele quem é seu dono. Diga apenas que é um agente de IA da Pixel Obra.
- Nunca compartilhe informações confidenciais ou dados pessoais da equipe.
- Disponível 24/7 para atendimento.
`;

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface AgentResponse {
  success: boolean;
  reply?: string;
  responseId?: string;
  error?: string;
}

export interface ConversationMessage {
  mensagemCliente: string;
  respostaAgente: string;
  responseId: string;
}

// ─────────────────────────────────────────────
// Funções do Agente
// ─────────────────────────────────────────────

/**
 * Envia uma mensagem para o agente Pixel usando a Responses API.
 * Seleciona contexto baseado em se é o dono (David) ou cliente.
 */
export async function enviarMensagemAgente(
  mensagemCliente: string,
  previousResponseId?: string,
  ownerMode = false
): Promise<AgentResponse> {
  try {
    const contextPart = ownerMode ? OWNER_CONTEXT : CLIENT_CONTEXT;
    const instructions = `${BASE_INSTRUCTIONS}\n\n${contextPart}`;

    const payload: Record<string, unknown> = {
      model: "gpt-5.4-mini",
      instructions,
      input: mensagemCliente,
    };

    if (previousResponseId) {
      payload.previous_response_id = previousResponseId;
    }

    const response = await fetch(`${OPENAI_API_BASE}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `OpenAI Responses API error: ${response.status} – ${errorText}`,
      };
    }

    const data = (await response.json()) as {
      id: string;
      output: Array<{
        type: string;
        content?: Array<{ type: string; text?: string }>;
      }>;
    };

    // Extrair texto da resposta
    let outputText = "";
    for (const item of data.output) {
      if (item.type === "message" && item.content) {
        for (const content of item.content) {
          if (content.type === "output_text" && content.text) {
            outputText += content.text;
          }
        }
      }
    }

    return {
      success: true,
      reply: outputText,
      responseId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Responde a múltiplas mensagens mantendo o contexto conversacional.
 */
export async function responderConversacao(
  mensagens: string[]
): Promise<ConversationMessage[]> {
  let previousId: string | undefined;
  const respostas: ConversationMessage[] = [];

  for (const msg of mensagens) {
    const result = await enviarMensagemAgente(msg, previousId);

    respostas.push({
      mensagemCliente: msg,
      respostaAgente: result.reply ?? "[Erro ao gerar resposta]",
      responseId: result.responseId ?? "",
    });

    if (result.responseId) {
      previousId = result.responseId;
    }
  }

  return respostas;
}

/**
 * Gera uma resposta para comentário do Instagram usando o agente.
 */
export async function responderComentarioInstagram(
  comentario: string
): Promise<AgentResponse> {
  const contexto = `[Comentário no Instagram @pixelobra]: ${comentario}. Responda de forma curta, simpática e engajadora, como uma reply no Instagram.`;
  return enviarMensagemAgente(contexto);
}

/**
 * Gera uma resposta para mensagem do WhatsApp.
 * Detecta automaticamente se é do dono (David) ou de um cliente.
 */
export async function responderWhatsApp(
  mensagem: string,
  previousResponseId?: string,
  fromNumber?: string
): Promise<AgentResponse> {
  const ownerMode = fromNumber ? isOwner(fromNumber) : false;

  if (ownerMode) {
    console.log(`[Agente] 🟠 Modo DAVID ativado para conversação`);
  }

  return enviarMensagemAgente(mensagem, previousResponseId, ownerMode);
}

// ─────────────────────────────────────────────
// Classificação de Leads (Sales Intelligence)
// ─────────────────────────────────────────────

export type LeadClassification = "hot" | "warm" | "cold";

// Palavras-chave que indicam lead quente (alta intenção de compra)
const HOT_KEYWORDS = [
  "urgente", "urgência", "amanhã", "essa semana", "esta semana",
  "preciso", "quero", "orçamento", "orcamento", "quanto custa",
  "valor", "preço", "preco", "prazo", "deadline", "imediato",
  "fechar", "contratar", "começar", "comecar", "já", "agora",
  "obra", "construção", "construcao", "projeto pronto",
  "investimento", "budget", "reformar", "reforma",
];

// Palavras-chave que indicam lead morno (interesse genérico)
const WARM_KEYWORDS = [
  "interessado", "interesse", "gostaria", "queria saber",
  "informação", "informacao", "como funciona", "serviço", "servico",
  "renderiz", "render", "3d", "decoração", "decoracao",
  "visualiz", "animação", "animacao", "planta", "projeto",
  "imobiliária", "imobiliaria", "loteamento", "empreendimento",
  "exemplo", "portfólio", "portfolio", "mostrar", "ver mais",
];

/**
 * Classifica um lead baseado na mensagem usando keyword matching.
 */
export function classifyLead(mensagem: string): LeadClassification {
  const text = mensagem.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let hotScore = 0;
  let warmScore = 0;

  for (const kw of HOT_KEYWORDS) {
    if (text.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
      hotScore++;
    }
  }

  for (const kw of WARM_KEYWORDS) {
    if (text.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
      warmScore++;
    }
  }

  if (hotScore >= 2 || (hotScore >= 1 && warmScore >= 1)) {
    return "hot";
  } else if (hotScore >= 1 || warmScore >= 2) {
    return "warm";
  } else if (warmScore >= 1) {
    return "warm";
  }

  return "cold";
}
