/**
 * Leads Management (Sales Intelligence)
 * =======================================
 * CRUD operations for the `leads` table.
 * Handles lead classification, tracking, and follow-up scheduling.
 */

import { getDb } from "./db";
import { leads } from "../drizzle/schema";
import { eq, and, lte, desc, sql } from "drizzle-orm";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type LeadClassification = "hot" | "warm" | "cold";
export type LeadStatus = "open" | "responded" | "closed" | "converted";
export type LeadChannel = "whatsapp" | "instagram" | "email";

export interface UpsertLeadInput {
  contact: string;
  name?: string;
  channel: LeadChannel;
  classification: LeadClassification;
  lastMessage?: string;
}

export interface LeadStats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  open: number;
  responded: number;
  closed: number;
  converted: number;
  byChannel: {
    whatsapp: number;
    instagram: number;
    email: number;
  };
}

// ─────────────────────────────────────────────
// Follow-up schedule (days after last interaction)
// ─────────────────────────────────────────────

const FOLLOW_UP_DAYS = [1, 3, 7]; // Stage 1 → 1 day, Stage 2 → 3 days, Stage 3 → 7 days

function getNextFollowUpDate(stage: number): Date | null {
  if (stage >= FOLLOW_UP_DAYS.length) return null; // No more follow-ups
  const days = FOLLOW_UP_DAYS[stage];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// ─────────────────────────────────────────────
// Upsert Lead (create or update)
// ─────────────────────────────────────────────

/**
 * Create or update a lead. If the lead already exists (same contact + channel),
 * update its classification, message, and interaction time.
 * Schedules follow-up for hot/warm leads.
 */
export async function upsertLead(input: UpsertLeadInput): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    // Check if lead exists
    const existing = await db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.contact, input.contact),
          eq(leads.channel, input.channel)
        )
      )
      .limit(1);

    const nextFollowUp =
      input.classification !== "cold" ? getNextFollowUpDate(0) : null;

    if (existing.length > 0) {
      const lead = existing[0];

      // Only upgrade classification (never downgrade)
      const classRank: Record<string, number> = { hot: 3, warm: 2, cold: 1 };
      const newClass =
        (classRank[input.classification] ?? 0) > (classRank[lead.classification] ?? 0)
          ? input.classification
          : lead.classification;

      await db
        .update(leads)
        .set({
          classification: newClass,
          lastMessage: input.lastMessage ?? lead.lastMessage,
          lastInteraction: new Date(),
          name: input.name ?? lead.name,
          // Reset follow-up schedule if classification upgraded
          ...(newClass !== lead.classification
            ? { nextFollowUp, followUpStage: 0 }
            : {}),
        })
        .where(eq(leads.id, lead.id));

      console.log(
        `[Leads] 📊 Lead atualizado: ${input.contact} (${input.channel}) → ${newClass}`
      );
    } else {
      await db.insert(leads).values({
        contact: input.contact,
        name: input.name,
        channel: input.channel,
        classification: input.classification,
        lastMessage: input.lastMessage,
        lastInteraction: new Date(),
        nextFollowUp,
        followUpStage: 0,
        status: "open",
      });

      const emoji =
        input.classification === "hot"
          ? "🔥"
          : input.classification === "warm"
          ? "🟡"
          : "🔵";
      console.log(
        `[Leads] ${emoji} Novo lead registrado: ${input.contact} (${input.channel}) → ${input.classification}`
      );
    }
  } catch (error) {
    console.error("[Leads] ❌ Erro ao upsert lead:", error);
  }
}

// ─────────────────────────────────────────────
// Get All Leads (with optional filters)
// ─────────────────────────────────────────────

export async function getLeads(filters?: {
  classification?: LeadClassification;
  channel?: LeadChannel;
  status?: LeadStatus;
}) {
  try {
    const db = await getDb();
    if (!db) return [];

    let query = db.select().from(leads).orderBy(desc(leads.lastInteraction));

    // Build conditions
    const conditions = [];
    if (filters?.classification)
      conditions.push(eq(leads.classification, filters.classification));
    if (filters?.channel) conditions.push(eq(leads.channel, filters.channel));
    if (filters?.status) conditions.push(eq(leads.status, filters.status));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    return await query.limit(100);
  } catch (error) {
    console.error("[Leads] ❌ Erro ao buscar leads:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// Get Lead Stats
// ─────────────────────────────────────────────

export async function getLeadStats(): Promise<LeadStats> {
  const defaultStats: LeadStats = {
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    open: 0,
    responded: 0,
    closed: 0,
    converted: 0,
    byChannel: { whatsapp: 0, instagram: 0, email: 0 },
  };

  try {
    const db = await getDb();
    if (!db) return defaultStats;

    const allLeads = await db.select().from(leads);

    const stats: LeadStats = { ...defaultStats };
    stats.total = allLeads.length;

    for (const lead of allLeads) {
      // Classification counts
      if (lead.classification === "hot") stats.hot++;
      else if (lead.classification === "warm") stats.warm++;
      else stats.cold++;

      // Status counts
      if (lead.status === "open") stats.open++;
      else if (lead.status === "responded") stats.responded++;
      else if (lead.status === "closed") stats.closed++;
      else if (lead.status === "converted") stats.converted++;

      // Channel counts
      if (lead.channel === "whatsapp") stats.byChannel.whatsapp++;
      else if (lead.channel === "instagram") stats.byChannel.instagram++;
      else if (lead.channel === "email") stats.byChannel.email++;
    }

    return stats;
  } catch (error) {
    console.error("[Leads] ❌ Erro ao buscar stats:", error);
    return defaultStats;
  }
}

// ─────────────────────────────────────────────
// Update Lead Status
// ─────────────────────────────────────────────

export async function updateLeadStatus(
  leadId: number,
  status: LeadStatus
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    await db
      .update(leads)
      .set({
        status,
        // If closed/converted, cancel follow-ups
        ...(status === "closed" || status === "converted"
          ? { nextFollowUp: null }
          : {}),
      })
      .where(eq(leads.id, leadId));

    console.log(`[Leads] ✅ Lead #${leadId} → status: ${status}`);
  } catch (error) {
    console.error("[Leads] ❌ Erro ao atualizar status:", error);
  }
}

// ─────────────────────────────────────────────
// Get Leads Due for Follow-up
// ─────────────────────────────────────────────

export async function getLeadsDueForFollowUp() {
  try {
    const db = await getDb();
    if (!db) return [];

    return await db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.status, "open"),
          lte(leads.nextFollowUp, new Date())
        )
      );
  } catch (error) {
    console.error("[Leads] ❌ Erro ao buscar leads para follow-up:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// Advance Follow-up Stage
// ─────────────────────────────────────────────

export async function advanceFollowUpStage(leadId: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) return;

    const nextStage = lead.followUpStage + 1;
    const nextDate = getNextFollowUpDate(nextStage);

    await db
      .update(leads)
      .set({
        followUpStage: nextStage,
        nextFollowUp: nextDate,
      })
      .where(eq(leads.id, leadId));
  } catch (error) {
    console.error("[Leads] ❌ Erro ao avançar follow-up:", error);
  }
}
