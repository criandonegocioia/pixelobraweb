/**
 * Skill: Security Scan — VirusTotal
 * ==================================
 * Verifica arquivos recebidos via WhatsApp antes de processá-los.
 * Calcula hash SHA-256, consulta VirusTotal API.
 * Se malicioso: exclui, alerta CEO, responde educadamente.
 * Se seguro: prossegue para processamento.
 *
 * Requer: VIRUSTOTAL_API_KEY no .env
 */

import { createHash } from "crypto";

export interface ScanResult {
  safe: boolean;
  hash?: string;
  detections?: number;
  totalEngines?: number;
  error?: string;
}

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY || "";
const VT_BASE = "https://www.virustotal.com/api/v3";

/**
 * Calcula SHA-256 de um buffer.
 */
export function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * Verifica um arquivo contra o VirusTotal.
 * Primeiro tenta lookup por hash (rápido, sem upload).
 * Se não encontrar, faz upload do arquivo.
 */
export async function scanFile(
  data: Buffer,
  filename: string
): Promise<ScanResult> {
  if (!VT_API_KEY) {
    console.warn("[Security] ⚠️ VIRUSTOTAL_API_KEY não configurada. Scan ignorado.");
    return { safe: true, error: "API key não configurada — scan ignorado" };
  }

  const hash = sha256(data);
  console.log(`[Security] 🔍 Verificando arquivo: ${filename} (SHA-256: ${hash.substring(0, 16)}...)`);

  try {
    // Tentar lookup por hash (sem upload)
    const lookupRes = await fetch(`${VT_BASE}/files/${hash}`, {
      headers: { "x-apikey": VT_API_KEY },
    });

    if (lookupRes.ok) {
      const result = (await lookupRes.json()) as {
        data: {
          attributes: {
            last_analysis_stats: {
              malicious: number;
              suspicious: number;
              undetected: number;
              harmless: number;
            };
          };
        };
      };

      const stats = result.data.attributes.last_analysis_stats;
      const detections = stats.malicious + stats.suspicious;
      const total = detections + stats.undetected + stats.harmless;

      if (detections > 0) {
        console.error(`[Security] 🚨 MALICIOSO! ${filename} — ${detections}/${total} engines detectaram ameaça`);
        return { safe: false, hash, detections, totalEngines: total };
      }

      console.log(`[Security] ✅ Arquivo seguro: ${filename} (0/${total} detecções)`);
      return { safe: true, hash, detections: 0, totalEngines: total };
    }

    if (lookupRes.status === 404) {
      // Arquivo não encontrado no VT — upload para análise
      console.log(`[Security] 📤 Arquivo desconhecido, fazendo upload para VT: ${filename}`);

      const formData = new FormData();
      formData.append("file", new Blob([new Uint8Array(data)]), filename);

      const uploadRes = await fetch(`${VT_BASE}/files`, {
        method: "POST",
        headers: { "x-apikey": VT_API_KEY },
        body: formData,
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        return { safe: true, hash, error: `Upload VT falhou: ${uploadRes.status} – ${errText}` };
      }

      // Arquivo enviado para análise — considerar seguro por hora (async scan)
      console.log(`[Security] ⏳ Arquivo enviado ao VT para análise assíncrona: ${filename}`);
      return { safe: true, hash, error: "Análise assíncrona em andamento" };
    }

    return { safe: true, hash, error: `VT retornou status ${lookupRes.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Security] ❌ Erro no scan:", msg);
    return { safe: true, hash, error: msg };
  }
}

/**
 * Gera mensagem educada para enviar ao cliente quando
 * arquivo malicioso é detectado.
 */
export function getMaliciousFileResponse(): string {
  return (
    "Por questões de segurança, não foi possível processar o arquivo enviado. 🔒\n\n" +
    "Para enviar seus arquivos de projeto com segurança, utilize nosso site:\n" +
    "👉 www.pixelobra.com.br\n\n" +
    "Se preferir, pode enviar as imagens diretamente pelo WhatsApp. 📸"
  );
}
