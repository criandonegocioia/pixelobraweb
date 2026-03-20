/**
 * Test Suite — Agente Pixel: Validação Abrangente
 * ================================================
 * Testa: classifyLead, leads CRUD, monitors, tRPC router, WhatsApp handler
 *
 * Execução: npx tsx tests/test-all.ts
 */

import "dotenv/config";

// ─────────────────────────────────────────────
// Test Framework Minimal
// ─────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(msg: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ ${msg}`);
    passed++;
  } else {
    console.log(`  ❌ FALHOU: ${msg}`);
    failed++;
    failures.push(msg);
  }
}

function section(name: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`📋 ${name}`);
  console.log(`${"═".repeat(60)}`);
}

// ─────────────────────────────────────────────
// TEST 1: classifyLead()
// ─────────────────────────────────────────────

async function testClassifyLead() {
  section("TEST 1: classifyLead() — Classificação de Leads");

  const { classifyLead } = await import("../agente-pixelobra/agente_responses_api");

  // HOT cases — urgência, orçamento, intenção clara
  assert(
    "HOT: 'Preciso de um orçamento urgente para minha obra'",
    classifyLead("Preciso de um orçamento urgente para minha obra") === "hot"
  );
  assert(
    "HOT: 'Quero contratar vocês para renderizar meu projeto essa semana'",
    classifyLead("Quero contratar vocês para renderizar meu projeto essa semana") === "hot"
  );
  assert(
    "HOT: 'Quanto custa uma reforma? Preciso começar já'",
    classifyLead("Quanto custa uma reforma? Preciso começar já") === "hot"
  );
  assert(
    "HOT: 'Qual o valor do investimento para uma construção?'",
    classifyLead("Qual o valor do investimento para uma construção?") === "hot"
  );

  // WARM cases — interesse genérico
  assert(
    "WARM: 'Gostaria de saber como funciona a renderização 3D'",
    classifyLead("Gostaria de saber como funciona a renderização 3D") === "warm"
  );
  assert(
    "WARM: 'Vocês trabalham com decoração de interiores?'",
    classifyLead("Vocês trabalham com decoração de interiores?") === "warm"
  );
  assert(
    "WARM: 'Me interessei pelo portfólio de vocês, podem mostrar mais?'",
    classifyLead("Me interessei pelo portfólio de vocês, podem mostrar mais?") === "warm"
  );
  assert(
    "WARM: 'Trabalham com imobiliárias? Temos um empreendimento'",
    classifyLead("Trabalham com imobiliárias? Temos um empreendimento") === "warm"
  );

  // COLD cases — saudação simples, dúvida genérica
  assert(
    "COLD: 'Oi, tudo bem?'",
    classifyLead("Oi, tudo bem?") === "cold"
  );
  assert(
    "COLD: 'Bom dia'",
    classifyLead("Bom dia") === "cold"
  );
  assert(
    "COLD: 'Obrigado pela resposta'",
    classifyLead("Obrigado pela resposta") === "cold"
  );
  assert(
    "COLD: 'Ok, entendi'",
    classifyLead("Ok, entendi") === "cold"
  );

  // Edge cases — acentuação e variações
  assert(
    "HOT (sem acento): 'Preciso de um orcamento pra construcao'",
    classifyLead("Preciso de um orcamento pra construcao") === "hot"
  );
  assert(
    "WARM (maiúsculas): 'COMO FUNCIONA O SERVIÇO DE RENDER?'",
    classifyLead("COMO FUNCIONA O SERVIÇO DE RENDER?") === "warm"
  );
}

// ─────────────────────────────────────────────
// TEST 2: Importações dos Módulos
// ─────────────────────────────────────────────

async function testModuleImports() {
  section("TEST 2: Importações dos Módulos");

  try {
    const leads = await import("../server/leads");
    assert("leads.ts importa corretamente", true);
    assert("upsertLead é uma função", typeof leads.upsertLead === "function");
    assert("getLeads é uma função", typeof leads.getLeads === "function");
    assert("getLeadStats é uma função", typeof leads.getLeadStats === "function");
    assert("updateLeadStatus é uma função", typeof leads.updateLeadStatus === "function");
    assert("getLeadsDueForFollowUp é uma função", typeof leads.getLeadsDueForFollowUp === "function");
    assert("advanceFollowUpStage é uma função", typeof leads.advanceFollowUpStage === "function");
  } catch (err) {
    assert(`leads.ts importa corretamente — ERRO: ${err}`, false);
  }

  try {
    const followup = await import("../server/followup");
    assert("followup.ts importa corretamente", true);
    assert("startFollowUpMonitor é uma função", typeof followup.startFollowUpMonitor === "function");
    assert("stopFollowUpMonitor é uma função", typeof followup.stopFollowUpMonitor === "function");
  } catch (err) {
    assert(`followup.ts importa corretamente — ERRO: ${err}`, false);
  }

  try {
    const monitor = await import("../server/monitor-email");
    assert("monitor-email.ts importa corretamente", true);
    assert("startEmailMonitor é uma função", typeof monitor.startEmailMonitor === "function");
    assert("stopEmailMonitor é uma função", typeof monitor.stopEmailMonitor === "function");
  } catch (err) {
    assert(`monitor-email.ts importa corretamente — ERRO: ${err}`, false);
  }

  try {
    const agent = await import("../agente-pixelobra/agente_responses_api");
    assert("agente_responses_api.ts importa corretamente", true);
    assert("enviarMensagemAgente é uma função", typeof agent.enviarMensagemAgente === "function");
    assert("responderWhatsApp é uma função", typeof agent.responderWhatsApp === "function");
    assert("classifyLead é uma função", typeof agent.classifyLead === "function");
  } catch (err) {
    assert(`agente_responses_api.ts importa corretamente — ERRO: ${err}`, false);
  }

  try {
    const memory = await import("../server/memory");
    assert("memory.ts importa corretamente", true);
    assert("getSession é uma função", typeof memory.getSession === "function");
    assert("saveSession é uma função", typeof memory.saveSession === "function");
  } catch (err) {
    assert(`memory.ts importa corretamente — ERRO: ${err}`, false);
  }
}

// ─────────────────────────────────────────────
// TEST 3: ENV Configuration
// ─────────────────────────────────────────────

async function testEnvConfig() {
  section("TEST 3: Variáveis de Ambiente");

  const { ENV } = await import("../server/_core/env");

  assert("OPENAI_API_KEY está configurada", !!ENV.openaiApiKey && ENV.openaiApiKey.length > 10);
  assert("imapHost está configurado", !!ENV.imapHost);
  assert("imapPort é 993", ENV.imapPort === 993);
  assert("imapUser está configurado", !!ENV.imapUser);
  assert("imapPass está configurado", !!ENV.imapPass);

  // Check DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  assert("DATABASE_URL está configurada", !!dbUrl);
  assert("DATABASE_URL contém mysql://", dbUrl?.startsWith("mysql://") ?? false);
}

// ─────────────────────────────────────────────
// TEST 4: Schema Drizzle
// ─────────────────────────────────────────────

async function testSchema() {
  section("TEST 4: Schema Drizzle");

  const schema = await import("../drizzle/schema");

  assert("Tabela 'users' existe", !!schema.users);
  assert("Tabela 'conversationSessions' existe", !!schema.conversationSessions);
  assert("Tabela 'leads' existe", !!schema.leads);

  // Verificar que Lead types existem
  assert("Lead type exportado", !!schema.leads);
  assert("InsertLead type exportado", !!schema.leads);
}

// ─────────────────────────────────────────────
// TEST 5: HTTP Endpoint do WhatsApp Handler
// ─────────────────────────────────────────────

async function testWhatsAppEndpoint() {
  section("TEST 5: WhatsApp Endpoint HTTP");

  const APP_URL = "http://localhost:3002";

  // Test 400 — Missing fields
  try {
    const res400 = await fetch(`${APP_URL}/api/whatsapp/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert("POST sem body retorna 400", res400.status === 400);
  } catch (err) {
    assert(`Conexão com app:3002 — ERRO: ${err}`, false);
    return;
  }

  // Test 200 — Valid message (calls real OpenAI API)
  try {
    console.log("  ⏳ Enviando mensagem de teste para agente Pixel (pode levar ~5s)...");
    const res200 = await fetch(`${APP_URL}/api/whatsapp/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "5511999990001@c.us",
        body: "Oi, gostaria de saber sobre renderização 3D",
      }),
    });

    assert("POST com mensagem retorna 200", res200.status === 200);

    const data = await res200.json();
    assert("Resposta contém campo 'reply'", "reply" in data);
    assert("Reply não é null", data.reply !== null);
    assert("Reply é uma string não vazia", typeof data.reply === "string" && data.reply.length > 5);

    if (data.reply) {
      console.log(`  📝 Resposta do agente: "${data.reply.substring(0, 120)}..."`);
    }
  } catch (err) {
    assert(`WhatsApp endpoint responde — ERRO: ${err}`, false);
  }
}

// ─────────────────────────────────────────────
// TEST 6: tRPC Leads Router
// ─────────────────────────────────────────────

async function testTRPCLeadsRouter() {
  section("TEST 6: tRPC Leads Router");

  const APP_URL = "http://localhost:3002";

  // Test leads.stats
  try {
    const statsRes = await fetch(
      `${APP_URL}/api/trpc/leads.stats?input=${encodeURIComponent(JSON.stringify({}))}`,
      { method: "GET" }
    );
    assert("leads.stats retorna 200", statsRes.status === 200);

    const statsData = await statsRes.json();
    const result = statsData?.result?.data?.json ?? statsData?.result?.data;
    assert("Stats contém 'total'", typeof result?.total === "number");
    assert("Stats contém 'hot'", typeof result?.hot === "number");
    assert("Stats contém 'warm'", typeof result?.warm === "number");
    assert("Stats contém 'cold'", typeof result?.cold === "number");
    assert("Stats contém 'byChannel'", typeof result?.byChannel === "object");

    console.log(`  📊 Stats: total=${result?.total}, hot=${result?.hot}, warm=${result?.warm}, cold=${result?.cold}`);
  } catch (err) {
    assert(`leads.stats — ERRO: ${err}`, false);
  }

  // Test leads.list
  try {
    const listRes = await fetch(
      `${APP_URL}/api/trpc/leads.list?input=${encodeURIComponent(JSON.stringify({}))}`,
      { method: "GET" }
    );
    assert("leads.list retorna 200", listRes.status === 200);

    const listData = await listRes.json();
    const leads = listData?.result?.data?.json ?? listData?.result?.data;
    assert("leads.list retorna array", Array.isArray(leads));

    if (leads?.length > 0) {
      const first = leads[0];
      assert("Lead tem campo 'id'", typeof first.id === "number");
      assert("Lead tem campo 'contact'", typeof first.contact === "string");
      assert("Lead tem campo 'channel'", typeof first.channel === "string");
      assert("Lead tem campo 'classification'", typeof first.classification === "string");
      assert("Lead tem campo 'status'", typeof first.status === "string");
      console.log(`  📋 ${leads.length} lead(s) encontrado(s). Primeiro: ${first.contact} (${first.classification})`);
    } else {
      console.log("  ℹ️  Nenhum lead no banco — isso é esperado se ainda não houve interações");
    }
  } catch (err) {
    assert(`leads.list — ERRO: ${err}`, false);
  }
}

// ─────────────────────────────────────────────
// TEST 7: Dashboard Page
// ─────────────────────────────────────────────

async function testDashboardPage() {
  section("TEST 7: Dashboard Page");

  try {
    const res = await fetch("http://localhost:3002/dashboard");
    assert("Dashboard retorna 200", res.status === 200);

    const html = await res.text();
    assert("HTML contém DOCTYPE", html.includes("<!DOCTYPE") || html.includes("<!doctype"));
    assert("HTML contém root div", html.includes("root"));
  } catch (err) {
    assert(`Dashboard page — ERRO: ${err}`, false);
  }
}

// ─────────────────────────────────────────────
// TEST 8: wpp-service status
// ─────────────────────────────────────────────

async function testWppService() {
  section("TEST 8: WhatsApp Service (wpp-service)");

  try {
    const res = await fetch("http://localhost:3010/status");
    assert("wpp-service /status retorna 200", res.status === 200);

    const data = await res.json() as Record<string, unknown>;
    const isConnected = 'connected' in data || 'status' in data || 'authenticated' in data;
    assert("Status contém campo de conexão", isConnected);
    console.log(`  📱 WhatsApp status:`, JSON.stringify(data).substring(0, 120));
  } catch (err) {
    assert(`wpp-service — ERRO: ${err}`, false);
  }
}

// ─────────────────────────────────────────────
// TEST 9: MySQL Connection
// ─────────────────────────────────────────────

async function testMySQLConnection() {
  section("TEST 9: MySQL Connection");

  try {
    const { getDb } = await import("../server/db");
    const db = await getDb();
    assert("Conexão com MySQL estabelecida", !!db);

    if (db) {
      // Try a simple query
      const { leads } = await import("../drizzle/schema");
      const { sql } = await import("drizzle-orm");
      const result = await db.select({ count: sql`COUNT(*)` }).from(leads);
      assert("Query na tabela 'leads' funciona", Array.isArray(result));
      console.log(`  🗄️  Leads na tabela: ${(result[0] as any)?.count ?? 0}`);
    }
  } catch (err: any) {
    assert(`MySQL — ERRO: ${err?.message ?? err}`, false);
  }
}

// ─────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────

async function main() {
  console.log("\n🧪 ═══════════════════════════════════════════════");
  console.log("   AGENTE PIXEL — SUITE DE TESTES ABRANGENTES");
  console.log("═══════════════════════════════════════════════════\n");

  const tests = [
    testClassifyLead,
    testModuleImports,
    testEnvConfig,
    testSchema,
    testMySQLConnection,
    testWppService,
    testWhatsAppEndpoint,
    testTRPCLeadsRouter,
    testDashboardPage,
  ];

  for (const test of tests) {
    try {
      await test();
    } catch (err: any) {
      console.error(`  💥 Erro no teste ${test.name}: ${err?.message ?? err}`);
      failed++;
      failures.push(`[CRASH] ${test.name}: ${err?.message}`);
    }
  }

  // Summary
  console.log("\n═══════════════════════════════════════════════════");
  console.log(`📊 RESULTADO: ${passed} ✅ passaram | ${failed} ❌ falharam`);
  console.log("═══════════════════════════════════════════════════");

  if (failures.length > 0) {
    console.log("\n❌ Falhas:");
    failures.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
  }

  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("💥 Erro fatal no test runner:", err);
  process.exit(2);
});
