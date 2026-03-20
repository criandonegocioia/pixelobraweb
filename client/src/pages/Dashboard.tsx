/**
 * Dashboard de Leads — Sales Intelligence
 * =========================================
 * Painel premium para gerenciamento e visualização de leads.
 * Exibe métricas, tabela com filtros e gráficos de conversão.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Classification = "hot" | "warm" | "cold";
type Channel = "whatsapp" | "instagram" | "email";
type Status = "open" | "responded" | "closed" | "converted";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const classEmoji: Record<Classification, string> = {
  hot: "🔥",
  warm: "🟡",
  cold: "🔵",
};

const classLabel: Record<Classification, string> = {
  hot: "Quente",
  warm: "Morno",
  cold: "Frio",
};

const classColor: Record<Classification, string> = {
  hot: "#ef4444",
  warm: "#f59e0b",
  cold: "#3b82f6",
};

const channelEmoji: Record<Channel, string> = {
  whatsapp: "💬",
  instagram: "📷",
  email: "📧",
};

const statusLabel: Record<Status, string> = {
  open: "Aberto",
  responded: "Respondido",
  closed: "Fechado",
  converted: "Convertido",
};

const statusColor: Record<Status, string> = {
  open: "#6b7280",
  responded: "#f59e0b",
  closed: "#ef4444",
  converted: "#22c55e",
};

// ─────────────────────────────────────────────
// Stats Card Component
// ─────────────────────────────────────────────

function StatsCard({
  title,
  value,
  icon,
  color,
  delay,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        border: `1px solid ${color}30`,
        borderRadius: 16,
        padding: "24px",
        minWidth: 180,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 800,
          color,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#9ca3af",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Filter Button
// ─────────────────────────────────────────────

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        border: active ? "1px solid #00D4FF" : "1px solid #333",
        background: active ? "#00D4FF15" : "transparent",
        color: active ? "#00D4FF" : "#9ca3af",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────

export default function Dashboard() {
  const [filterClass, setFilterClass] = useState<Classification | undefined>();
  const [filterChannel, setFilterChannel] = useState<Channel | undefined>();
  const [filterStatus, setFilterStatus] = useState<Status | undefined>();

  const statsQuery = trpc.leads.stats.useQuery();
  const leadsQuery = trpc.leads.list.useQuery({
    classification: filterClass,
    channel: filterChannel,
    status: filterStatus,
  });
  const updateStatusMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      leadsQuery.refetch();
      statsQuery.refetch();
    },
  });

  const stats = statsQuery.data;
  const leads = leadsQuery.data ?? [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e5e7eb",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "32px 40px",
          borderBottom: "1px solid #1f2937",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              background: "linear-gradient(135deg, #00D4FF, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📊 Dashboard de Leads
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>
            Sales Intelligence — Pixel Obra
          </p>
        </div>
        <a
          href="/"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "1px solid #333",
            color: "#9ca3af",
            textDecoration: "none",
            fontSize: 13,
            transition: "all 0.2s",
          }}
        >
          ← Voltar ao Site
        </a>
      </header>

      <main style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <StatsCard
            title="Total Leads"
            value={stats?.total ?? 0}
            icon="👥"
            color="#8b5cf6"
            delay={0}
          />
          <StatsCard
            title="Quentes"
            value={stats?.hot ?? 0}
            icon="🔥"
            color="#ef4444"
            delay={0.1}
          />
          <StatsCard
            title="Mornos"
            value={stats?.warm ?? 0}
            icon="🟡"
            color="#f59e0b"
            delay={0.2}
          />
          <StatsCard
            title="Frios"
            value={stats?.cold ?? 0}
            icon="🔵"
            color="#3b82f6"
            delay={0.3}
          />
          <StatsCard
            title="Convertidos"
            value={stats?.converted ?? 0}
            icon="✅"
            color="#22c55e"
            delay={0.4}
          />
        </div>

        {/* Channel Stats */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{
              background: "#111118",
              border: "1px solid #1f2937",
              borderRadius: 16,
              padding: "24px",
              flex: 1,
              minWidth: 250,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#9ca3af",
                margin: "0 0 16px",
              }}
            >
              Leads por Canal
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(["whatsapp", "instagram", "email"] as const).map((ch) => {
                const count =
                  stats?.byChannel?.[ch] ?? 0;
                const total = stats?.total || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={ch}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontSize: 13,
                      }}
                    >
                      <span>
                        {channelEmoji[ch]} {ch.charAt(0).toUpperCase() + ch.slice(1)}
                      </span>
                      <span style={{ color: "#6b7280" }}>
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "#1f2937",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        style={{
                          height: "100%",
                          background:
                            ch === "whatsapp"
                              ? "#25d366"
                              : ch === "instagram"
                              ? "#e1306c"
                              : "#00D4FF",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{
              background: "#111118",
              border: "1px solid #1f2937",
              borderRadius: 16,
              padding: "24px",
              flex: 1,
              minWidth: 250,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#9ca3af",
                margin: "0 0 16px",
              }}
            >
              Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(["open", "responded", "closed", "converted"] as const).map(
                (st) => {
                  const count =
                    stats?.[st] ?? 0;
                  return (
                    <div
                      key={st}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: statusColor[st],
                            display: "inline-block",
                          }}
                        />
                        {statusLabel[st]}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: statusColor[st],
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "#6b7280", marginRight: 8 }}>
            Filtros:
          </span>
          <FilterButton
            active={!filterClass}
            onClick={() => setFilterClass(undefined)}
          >
            Todos
          </FilterButton>
          {(["hot", "warm", "cold"] as const).map((c) => (
            <FilterButton
              key={c}
              active={filterClass === c}
              onClick={() => setFilterClass(c)}
            >
              {classEmoji[c]} {classLabel[c]}
            </FilterButton>
          ))}

          <span style={{ width: 1, height: 24, background: "#333", margin: "0 8px" }} />

          <FilterButton
            active={!filterChannel}
            onClick={() => setFilterChannel(undefined)}
          >
            📱 Todos
          </FilterButton>
          {(["whatsapp", "instagram", "email"] as const).map((ch) => (
            <FilterButton
              key={ch}
              active={filterChannel === ch}
              onClick={() => setFilterChannel(ch)}
            >
              {channelEmoji[ch]} {ch.charAt(0).toUpperCase() + ch.slice(1)}
            </FilterButton>
          ))}

          <span style={{ width: 1, height: 24, background: "#333", margin: "0 8px" }} />

          <FilterButton
            active={!filterStatus}
            onClick={() => setFilterStatus(undefined)}
          >
            📋 Todos
          </FilterButton>
          {(["open", "responded", "converted"] as const).map((st) => (
            <FilterButton
              key={st}
              active={filterStatus === st}
              onClick={() => setFilterStatus(st)}
            >
              {statusLabel[st]}
            </FilterButton>
          ))}
        </motion.div>

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          style={{
            background: "#111118",
            border: "1px solid #1f2937",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #1f2937",
                    textAlign: "left",
                  }}
                >
                  {[
                    "Lead",
                    "Canal",
                    "Classificação",
                    "Status",
                    "Última Mensagem",
                    "Última Interação",
                    "Ações",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 16px",
                        color: "#6b7280",
                        fontWeight: 600,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "40px 16px",
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      {leadsQuery.isLoading
                        ? "Carregando leads..."
                        : "Nenhum lead encontrado. Os leads aparecerão aqui quando clientes entrarem em contato via WhatsApp, Instagram ou e-mail."}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: any, i: number) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      style={{
                        borderBottom: "1px solid #1a1a24",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "#1a1a24")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "transparent")
                      }
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600 }}>
                          {lead.name || "Sem nome"}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {lead.contact}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            background:
                              lead.channel === "whatsapp"
                                ? "#25d36615"
                                : lead.channel === "instagram"
                                ? "#e1306c15"
                                : "#00D4FF15",
                            color:
                              lead.channel === "whatsapp"
                                ? "#25d366"
                                : lead.channel === "instagram"
                                ? "#e1306c"
                                : "#00D4FF",
                          }}
                        >
                          {channelEmoji[lead.channel as Channel]}{" "}
                          {(lead.channel as string).charAt(0).toUpperCase() +
                            (lead.channel as string).slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            background: `${classColor[lead.classification as Classification]}15`,
                            color: classColor[lead.classification as Classification],
                          }}
                        >
                          {classEmoji[lead.classification as Classification]}{" "}
                          {classLabel[lead.classification as Classification]}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: statusColor[lead.status as Status],
                            }}
                          />
                          {statusLabel[lead.status as Status]}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#9ca3af",
                          fontSize: 13,
                        }}
                      >
                        {lead.lastMessage || "—"}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          color: "#6b7280",
                          fontSize: 13,
                        }}
                      >
                        {lead.lastInteraction
                          ? new Date(lead.lastInteraction).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {lead.status !== "converted" && (
                            <button
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  leadId: lead.id,
                                  status: "converted",
                                })
                              }
                              title="Marcar como convertido"
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #22c55e30",
                                background: "#22c55e10",
                                color: "#22c55e",
                                cursor: "pointer",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              ✅ Converter
                            </button>
                          )}
                          {lead.status === "open" && (
                            <button
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  leadId: lead.id,
                                  status: "responded",
                                })
                              }
                              title="Marcar como respondido"
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #f59e0b30",
                                background: "#f59e0b10",
                                color: "#f59e0b",
                                cursor: "pointer",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              📩 Respondido
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "#4b5563",
            fontSize: 12,
          }}
        >
          Pixel Obra — Sales Intelligence Dashboard
        </div>
      </main>
    </div>
  );
}
