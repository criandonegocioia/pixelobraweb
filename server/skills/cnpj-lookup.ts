/**
 * Skill: CNPJ Lookup — ReceitaWS
 * ===============================
 * Consulta dados de empresa via CNPJ para qualificar leads.
 * Extrai: razão social, capital social, atividade econômica, porte.
 * Usado para ajustar argumentos de venda automaticamente.
 */

export interface CnpjData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  atividadePrincipal: string;
  capitalSocial: number;
  porte: string;
  situacao: string;
  municipio: string;
  uf: string;
  raw?: Record<string, unknown>;
}

export interface CnpjResult {
  success: boolean;
  data?: CnpjData;
  error?: string;
}

/**
 * Extrai somente dígitos de um CNPJ.
 */
function cleanCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

/**
 * Detecta se uma mensagem contém um CNPJ (14 dígitos).
 */
export function extractCnpj(text: string): string | null {
  // Formato: XX.XXX.XXX/XXXX-XX ou 14 dígitos seguidos
  const patterns = [
    /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/,
    /\b\d{14}\b/,
  ];

  for (const p of patterns) {
    const match = text.match(p);
    if (match) {
      const cleaned = cleanCnpj(match[0]);
      if (cleaned.length === 14) return cleaned;
    }
  }
  return null;
}

/**
 * Consulta dados de empresa via ReceitaWS (API gratuita).
 * Rate limit: 3 consultas/minuto (free tier).
 */
export async function lookupCnpj(cnpj: string): Promise<CnpjResult> {
  const cleaned = cleanCnpj(cnpj);
  if (cleaned.length !== 14) {
    return { success: false, error: "CNPJ inválido (deve ter 14 dígitos)" };
  }

  try {
    console.log(`[CNPJ] 🔍 Consultando: ${cleaned}`);

    const res = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleaned}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      if (res.status === 429) {
        return { success: false, error: "Rate limit atingido (3/min). Tente novamente em breve." };
      }
      return { success: false, error: `ReceitaWS retornou ${res.status}` };
    }

    const raw = (await res.json()) as Record<string, unknown>;

    if (raw.status === "ERROR") {
      return { success: false, error: String(raw.message || "CNPJ não encontrado") };
    }

    const atividadePrincipal =
      Array.isArray(raw.atividade_principal) && raw.atividade_principal.length > 0
        ? String((raw.atividade_principal[0] as Record<string, string>).text || "")
        : "";

    const data: CnpjData = {
      cnpj: cleaned,
      razaoSocial: String(raw.nome || ""),
      nomeFantasia: String(raw.fantasia || ""),
      atividadePrincipal,
      capitalSocial: parseFloat(String(raw.capital_social || "0").replace(",", ".")),
      porte: String(raw.porte || ""),
      situacao: String(raw.situacao || ""),
      municipio: String(raw.municipio || ""),
      uf: String(raw.uf || ""),
      raw,
    };

    console.log(`[CNPJ] ✅ ${data.razaoSocial} | ${data.porte} | Capital: R$${data.capitalSocial}`);
    return { success: true, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[CNPJ] ❌ Erro:", msg);
    return { success: false, error: msg };
  }
}

/**
 * Gera contexto comercial a partir dos dados do CNPJ
 * para injetar na conversa do agente.
 */
export function buildCnpjContext(data: CnpjData): string {
  const parts = [
    `[Dados da Empresa — CNPJ ${data.cnpj}]`,
    `Razão Social: ${data.razaoSocial}`,
  ];

  if (data.nomeFantasia) parts.push(`Nome Fantasia: ${data.nomeFantasia}`);
  if (data.atividadePrincipal) parts.push(`Atividade: ${data.atividadePrincipal}`);
  if (data.porte) parts.push(`Porte: ${data.porte}`);
  if (data.capitalSocial > 0) parts.push(`Capital Social: R$ ${data.capitalSocial.toLocaleString("pt-BR")}`);
  if (data.municipio && data.uf) parts.push(`Localização: ${data.municipio}/${data.uf}`);
  parts.push(`Situação: ${data.situacao}`);
  parts.push("Use essas informações para personalizar sua abordagem comercial.");

  return parts.join("\n");
}
