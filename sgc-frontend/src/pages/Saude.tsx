import { useEffect, useState } from "react";
import api from "../api";
import type { RegistroSaude, Pombo, TipoRegistroSaude, StatusRegistroSaude } from "../types";

interface FormState {
  pomboId: string;
  tipo: TipoRegistroSaude;
  descricao: string;
  data: string;
  proximaDose: string;
  status: StatusRegistroSaude;
  observacoes: string;
}
const emptyForm: FormState = {
  pomboId: "", tipo: "Vacina", descricao: "", data: "",
  proximaDose: "", status: "Concluido", observacoes: "",
};

const TIPO_ICONS: Record<string, string> = {
  Vacina: "💉", Medicamento: "💊", Exame: "��", Tratamento: "🩺",
};
const TIPO_COLOR: Record<string, string> = {
  Vacina: "#3399ff", Medicamento: "#fbbf24", Exame: "#a78bfa", Tratamento: "#34d399",
};

function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

export default function Saude() {
  const [registros, setRegistros] = useState<RegistroSaude[]>([]);
  const [pombos, setPombos] = useState<Pombo[]>([]);
  const [calendario, setCalendario] = useState<RegistroSaude[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterTipo, setFilterTipo] = useState<string>("Todos");
  const [form, setForm] = useState<FormState>({ ...emptyForm });

  const loadRegistros = () => api.get<RegistroSaude[]>("/saude").then((r) => setRegistros(r.data));
  const loadCalendario = () => api.get<RegistroSaude[]>("/saude/calendario").then((r) => setCalendario(r.data));

  useEffect(() => {
    loadRegistros();
    loadCalendario();
    api.get<Pombo[]>("/pombos").then((r) => setPombos(r.data));
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/saude", { ...form, pomboId: Number(form.pomboId), proximaDose: form.proximaDose || null });
    setShowForm(false);
    setForm({ ...emptyForm });
    loadRegistros();
    loadCalendario();
  };

  const del = async (id: number) => {
    if (!confirm("Remover registro?")) return;
    await api.delete(`/saude/${id}`);
    loadRegistros();
  };

  const vacinados = registros.filter((r) => r.tipo === "Vacina" && r.status === "Concluido").length;
  const emTratamento = registros.filter((r) => r.status === "Agendado").length;
  const proximosEventos = calendario.length;

  const filtered = filterTipo === "Todos" ? registros : registros.filter((r) => r.tipo === filterTipo);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Saúde</h1>
          <p>Controle de saúde e vacinas</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-grid kpi-3">
        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Vacinas Aplicadas</span>
            <span className="kpi-value">{vacinados}</span>
          </div>
          <div className="kpi-icon" style={{ background: "rgba(51,153,255,0.12)", color: "#3399ff" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 2l4 4-14 14H4v-4L18 2z"/><line x1="14" y1="6" x2="18" y2="10"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Em Tratamento</span>
            <span className="kpi-value">{emTratamento}</span>
          </div>
          <div className="kpi-icon" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 2H9a2 2 0 0 0-2 2v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
              <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left">
            <span className="kpi-label">Próximas Ações</span>
            <span className="kpi-value">{proximosEventos}</span>
          </div>
          <div className="kpi-icon" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>
            <IconCalendar />
          </div>
        </div>
      </div>

      {/* Main section */}
      <div className="saude-layout">
        <div className="table-card saude-main">
          <div className="section-header">
            <h2>Histórico de Saúde</h2>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Novo Registro</button>
          </div>

          {/* Filter tabs */}
          <div className="filter-tabs">
            {["Todos", "Vacinas", "Medicamentos", "Check-ups"].map((t) => (
              <button
                key={t}
                className={`filter-tab ${filterTipo === t ? "active" : ""}`}
                onClick={() => setFilterTipo(t === "Vacinas" ? "Vacina" : t === "Medicamentos" ? "Medicamento" : t === "Check-ups" ? "Exame" : "Todos")}
              >{t}</button>
            ))}
          </div>

          {showForm && (
            <div className="inline-form">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pombo *</label>
                    <select className="form-control" required value={form.pomboId} onChange={(e) => set("pomboId", e.target.value)}>
                      <option value="">Selecione…</option>
                      {pombos.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.anilha})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tipo</label>
                    <select className="form-control" value={form.tipo} onChange={(e) => set("tipo", e.target.value as TipoRegistroSaude)}>
                      <option value="Vacina">Vacina</option>
                      <option value="Medicamento">Medicamento</option>
                      <option value="Exame">Exame</option>
                      <option value="Tratamento">Tratamento</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={form.status} onChange={(e) => set("status", e.target.value as StatusRegistroSaude)}>
                      <option value="Concluido">Concluído</option>
                      <option value="Agendado">Agendado</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Descrição *</label>
                    <input className="form-control" required value={form.descricao} onChange={(e) => set("descricao", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Data *</label>
                    <input type="date" className="form-control" required value={form.data} onChange={(e) => set("data", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Próxima Dose</label>
                    <input type="date" className="form-control" value={form.proximaDose} onChange={(e) => set("proximaDose", e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Observações</label>
                    <input className="form-control" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
                  </div>
                  <div className="form-group form-group-btns">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="registro-list">
            {filtered.map((r) => (
              <div key={r.id} className="registro-item">
                <div className="registro-icon" style={{ color: TIPO_COLOR[r.tipo] }}>
                  {TIPO_ICONS[r.tipo]}
                </div>
                <div className="registro-body">
                  <div className="registro-top">
                    <span className="registro-desc">{r.descricao}</span>
                    <span className={`badge ${r.status === "Concluido" ? "badge-concluido" : "badge-agendado"}`}>
                      {r.status === "Concluido" ? "Concluído" : "Agendado"}
                    </span>
                  </div>
                  <div className="registro-sub">{r.pombo?.anilha} – {r.pombo?.nome}</div>
                  {r.observacoes && <div className="registro-obs">{r.observacoes}</div>}
                  <div className="registro-dates">
                    <span>📅 {new Date(r.data).toLocaleDateString("pt-BR")}</span>
                    {r.proximaDose && <span>📅 Próximo: {new Date(r.proximaDose).toLocaleDateString("pt-BR")}</span>}
                  </div>
                </div>
                <button className="icon-btn icon-btn-danger" onClick={() => del(r.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                </button>
              </div>
            ))}
            {filtered.length === 0 && <div className="empty-state">Nenhum registro encontrado.</div>}
          </div>
        </div>

        {/* Agenda */}
        <div className="table-card saude-agenda">
          <h2>Agenda</h2>
          <div className="agenda-list">
            {calendario.map((r) => (
              <div key={r.id} className="agenda-item">
                <div className="agenda-title">{r.descricao}</div>
                <div className="agenda-pombo">{r.pombo?.anilha || "—"}</div>
                <div className="agenda-date">
                  <span className="date-dot" />
                  {r.proximaDose ? new Date(r.proximaDose).toLocaleDateString("pt-BR") : "—"}
                </div>
              </div>
            ))}
            {calendario.length === 0 && <div className="empty-state">Nenhum evento próximo.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
