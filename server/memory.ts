/**
 * Persistent Conversation Memory
 * ================================
 * Stores conversation sessions per contact+channel.
 * Uses the `conversation_sessions` DB table (Drizzle ORM).
 *
 * This enables "Pixel" to remember the conversation context
 * across multiple messages from the same user on the same channel.
 */

import { getDb } from "./db";
import { conversationSessions } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ConversationSession {
  id: number;
  contact: string;
  channel: "whatsapp" | "instagram" | "email";
  previousResponseId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Get Session (retrieve existing context)
// ─────────────────────────────────────────────

/**
 * Get existing conversation session for a contact.
 * Returns null if no session found (first interaction).
 */
export async function getSession(
  contact: string,
  channel: "whatsapp" | "instagram" | "email"
): Promise<ConversationSession | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const results = await db
      .select()
      .from(conversationSessions)
      .where(
        and(
          eq(conversationSessions.contact, contact),
          eq(conversationSessions.channel, channel)
        )
      )
      .limit(1);

    if (!results || results.length === 0) return null;
    return results[0] as ConversationSession;
  } catch (error) {
    console.error("[Memory] Erro ao buscar sessão:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Save Session (create or update)
// ─────────────────────────────────────────────

/**
 * Create or update a conversation session.
 * Called after each agent reply to persist the responseId for next turn.
 */
export async function saveSession(
  contact: string,
  channel: "whatsapp" | "instagram" | "email",
  previousResponseId: string
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    const existing = await getSession(contact, channel);

    if (existing) {
      await db
        .update(conversationSessions)
        .set({ previousResponseId, updatedAt: new Date() })
        .where(eq(conversationSessions.id, existing.id));
    } else {
      await db.insert(conversationSessions).values({
        contact,
        channel,
        previousResponseId,
      });
    }
  } catch (error) {
    console.error("[Memory] Erro ao salvar sessão:", error);
  }
}

// ─────────────────────────────────────────────
// Clear Session (reset context)
// ─────────────────────────────────────────────

/**
 * Clear session for a contact. Use when user says "esqueça" or after deal is closed.
 */
export async function clearSession(
  contact: string,
  channel: "whatsapp" | "instagram" | "email"
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    await db
      .delete(conversationSessions)
      .where(
        and(
          eq(conversationSessions.contact, contact),
          eq(conversationSessions.channel, channel)
        )
      );
  } catch (error) {
    console.error("[Memory] Erro ao limpar sessão:", error);
  }
}
