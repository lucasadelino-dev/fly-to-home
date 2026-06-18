import { useEffect, useState } from "react";
import api from "../api";
import type { DashboardData } from "../types";
import { toast } from "../toast";
import { useTheme } from "../useTheme";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";

const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const DOT_CLASS: Record<string, string> = {
  Acasalamento: "dot-pink",
  Vacina: "dot-blue",
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);
  const theme = useTheme();

  const isLight = theme === "light";
  const gridColor  = isLight ? "rgba(0,0,0,0.07)"  : "rgba(255,255,255,0.06)";
  const tickColor  = isLight ? "#9095a8"            : "#7a7a92";
  const cursorFill = isLight ? "rgba(0,0,0,0.04)"  : "rgba(255,255,255,0.04)";
  const tooltipStyle = {
    background:   isLight ? "#ffffff"              : "#1a1a2c",
    border:       `1px solid ${isLight ? "rgba(0,0,0,0.10)" : "#2a2a4a"}`,
    borderRadius: 8,
    color:        isLight ? "#1a1b2e"              : "#e0e0e0",
    fontSize:     12,
    boxShadow:    isLight ? "0 4px 16px rgba(0,0,0,0.10)" : "0 4px 16px rgba(0,0,0,0.4)",
  };

  useEffect(() => {
    api.get<DashboardData>("/dashboard")
      .then(r => setData(r.data))
      .catch(() => {
        setError(true);
        toast.error("Erro ao carregar o dashboard.");
      });
  }, []);

  if (error) return <div className="loading">Não foi possível carregar o dashboard.</div>;
  if (!data)  return <div className="loading">Carregando...</div>;

  const barData  = data.competicoesPorMes.map(c => ({ mes: MONTH_NAMES[c.month - 1], total: c.total }));
  const lineData = data.saudePorMes.map(s => ({
    mes: MONTH_NAMES[s.month - 1],
    concluidos: s.concluidos,
    agendados:  s.agendados,
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral do seu pombal</p>
        </div>
      </div>

      {/* ── KPIs ─────────────────────────────────── */}
      <div className="kpi-grid kpi-3">
        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Pombos Ativos</span>
            <span className="kpi-value">{data.totalPombos}</span>
          </div>
          <div className="kpi-icon kpi-icon-blue">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
              <line x1="16" y1="8" x2="2" y2="22"/>
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Competições</span>
            <span className="kpi-value">{data.totalCompeticoes}</span>
          </div>
          <div className="kpi-icon kpi-icon-yellow">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"/>
              <path d="M4 22h16"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Taxa de Vitória</span>
            <span className="kpi-value">{data.taxaVitoria}%</span>
          </div>
          <div className="kpi-icon kpi-icon-green">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Em Tratamento</span>
            <span className="kpi-value">{data.emTratamento}</span>
          </div>
          <div className="kpi-icon kpi-icon-red">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 2H9a2 2 0 0 0-2 2v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Acasalamentos Ativos</span>
            <span className="kpi-value">{data.acasalamentosAtivos ?? "—"}</span>
          </div>
          <div className="kpi-icon" style={{ background: "var(--pink-bg)", color: "var(--pink)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Filhotes Nascidos</span>
            <span className="kpi-value">{data.totalFilhotes ?? "—"}</span>
          </div>
          <div className="kpi-icon" style={{ background: "var(--purple-bg)", color: "var(--purple)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Charts ───────────────────────────────── */}
      <div className="charts-row">
        <div className="chart-card">
          <h2>Competições por Mês</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={barData} barCategoryGap="32%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorFill }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4,4,0,0]} name="Competições" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">Nenhuma competição nos últimos 6 meses.</div>
          )}
        </div>

        <div className="chart-card">
          <h2>Registros de Saúde por Mês</h2>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: tickColor }} />
                <Line type="monotone" dataKey="concluidos" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} name="Concluídos" />
                <Line type="monotone" dataKey="agendados"  stroke="#fbbf24" strokeWidth={2} dot={{ fill: "#fbbf24", r: 4 }} name="Agendados" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">Nenhum registro de saúde nos últimos 6 meses.</div>
          )}
        </div>
      </div>

      {/* ── Próximas Competições + Top Performers ─── */}
      <div className="charts-row">
        <div className="chart-card">
          <h2>Próximas Competições</h2>
          {(data.proximasCompeticoes ?? []).length > 0 ? (
            <div className="dash-list">
              {(data.proximasCompeticoes ?? []).map((c, i) => (
                <div key={i} className="dash-row">
                  <div className="dash-row-main">
                    <span className="dash-row-title">{c.nome}</span>
                    {c.local && <span className="dash-row-sub">📍 {c.local}</span>}
                  </div>
                  <span className="dash-row-badge">
                    {new Date(c.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-empty">Nenhuma competição futura agendada.</div>
          )}
        </div>

        <div className="chart-card">
          <h2>Top Performers</h2>
          {(data.topPerformers ?? []).length > 0 ? (
            <div className="dash-list">
              {(data.topPerformers ?? []).map((p, i) => (
                <div key={p.anilha} className="dash-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>
                      {MEDAL[i + 1] ?? `#${i + 1}`}
                    </span>
                    <div className="dash-row-main">
                      <span className="dash-row-title">{p.nome}</span>
                      <span className="dash-row-sub anilha-badge">{p.anilha}</span>
                    </div>
                  </div>
                  <span className="dash-row-badge dash-row-badge-yellow">
                    {p.vitorias} {p.vitorias === 1 ? "vitória" : "vitórias"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-empty">Nenhum resultado de competição registrado.</div>
          )}
        </div>
      </div>

      {/* ── Atividades Recentes ───────────────────── */}
      <div className="activity-section">
        <h2>Atividades Recentes</h2>
        {data.atividadesRecentes.length > 0 ? (
          <ul className="activity-list">
            {data.atividadesRecentes.map((a, i) => (
              <li key={i} className="activity-item">
                <span className={`activity-dot ${DOT_CLASS[a.tipo] ?? "dot-blue"}`} />
                <div className="activity-text">
                  <span className="activity-desc">{a.descricao}</span>
                  <span className="activity-date">{new Date(a.data).toLocaleDateString("pt-BR")}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">Nenhuma atividade recente.</div>
        )}
      </div>
    </div>
  );
}
