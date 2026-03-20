import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

// ─────────────────────────────────────────────
// Conversation Sessions (Agent Memory)
// ─────────────────────────────────────────────

/**
 * Stores the conversation context (previous_response_id) per user per channel.
 * Used by the Pixel agent to maintain multi-turn memory across sessions.
 */
export const conversationSessions = mysqlTable("conversation_sessions", {
  id: int("id").autoincrement().primaryKey(),
  /** Contact identifier: phone number for WhatsApp, user ID for Instagram */
  contact: varchar("contact", { length: 128 }).notNull(),
  /** Messaging channel */
  channel: mysqlEnum("channel", ["whatsapp", "instagram", "email"]).notNull(),
  /** OpenAI Responses API previous_response_id for context continuity */
  previousResponseId: varchar("previousResponseId", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConversationSession = typeof conversationSessions.$inferSelect;
export type InsertConversationSession = typeof conversationSessions.$inferInsert;

// ─────────────────────────────────────────────
// Leads (Sales Intelligence)
// ─────────────────────────────────────────────

/**
 * Tracks leads from WhatsApp, Instagram, and Email.
 * Used for classification (hot/warm/cold) and automatic follow-up scheduling.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  /** Contact identifier: phone number for WhatsApp, user ID for Instagram, email address */
  contact: varchar("contact", { length: 128 }).notNull(),
  /** Display name (from WhatsApp profile, IG username, or email sender) */
  name: varchar("name", { length: 255 }),
  /** Messaging channel */
  channel: mysqlEnum("channel", ["whatsapp", "instagram", "email"]).notNull(),
  /** Lead temperature classification */
  classification: mysqlEnum("classification", ["hot", "warm", "cold"]).default("cold").notNull(),
  /** Last message from the lead */
  lastMessage: text("lastMessage"),
  /** Timestamp of last interaction */
  lastInteraction: timestamp("lastInteraction").defaultNow().notNull(),
  /** When the next follow-up should be sent (null = no follow-up scheduled) */
  nextFollowUp: timestamp("nextFollowUp"),
  /** Current follow-up stage: 0 = none, 1 = 1 day, 2 = 3 days, 3 = 7 days */
  followUpStage: int("followUpStage").default(0).notNull(),
  /** Lead status */
  status: mysqlEnum("status", ["open", "responded", "closed", "converted"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

