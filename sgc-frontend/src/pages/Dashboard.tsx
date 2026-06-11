import { useEffect, useState } from "react";
import api from "../api";
import type { DashboardData } from "../types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const TOOLTIP_STYLE = {
  background: "#1a1a2e",
  border: "1px solid #2a2a4a",
  borderRadius: 6,
  color: "#e0e0e0",
  fontSize: 12,
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get<DashboardData>("/dashboard").then(r => setData(r.data));
  }, []);

  if (!data) return <div className="loading">Carregando...</div>;

  const barData = data.competicoesPorMes.map(c => ({
    mes: MONTH_NAMES[c.month - 1],
    total: c.total,
    prev: Math.max(0, c.total - Math.floor(Math.random() * 3)),
  }));

  const lineData = barData.map((c, i) => ({
    mes: c.mes,
    saudaveis: 40 + i,
    tratamento: data.emTratamento,
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral do seu pombal</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Total de Pombos</span>
            <span className="kpi-value">{data.totalPombos}</span>
          </div>
          <div className="kpi-icon kpi-icon-blue">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"/>
              <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Em Tratamento</span>
            <span className="kpi-value">{data.emTratamento}</span>
          </div>
          <div className="kpi-icon kpi-icon-red">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Taxa de Vitória</span>
            <span className="kpi-value">{data.taxaVitoria}%</span>
          </div>
          <div className="kpi-icon kpi-icon-green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="chart-card">
          <h2>Performance em Competições</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="prev" fill="#1565c0" radius={[3,3,0,0]} name="Anterior" />
              <Bar dataKey="total" fill="#00d8ff" radius={[3,3,0,0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h2>Controle de Saúde</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="saudaveis" stroke="#3399ff" strokeWidth={2} dot={{ fill: "#3399ff", r: 4 }} name="Saudáveis" />
              <Line type="monotone" dataKey="tratamento" stroke="#ff4444" strokeWidth={2} dot={{ fill: "#ff4444", r: 4 }} name="Em Tratamento" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="activity-section">
        <h2>Atividades Recentes</h2>
        <ul className="activity-list">
          {data.atividadesRecentes.map((a, i) => (
            <li key={i} className="activity-item">
              <span className={`activity-dot ${a.tipo === "Vacina" ? "dot-blue" : "dot-blue"}`} />
              <div className="activity-text">
                <span className="activity-desc">{a.descricao}</span>
                <span className="activity-date">{new Date(a.data).toLocaleDateString("pt-BR")}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
