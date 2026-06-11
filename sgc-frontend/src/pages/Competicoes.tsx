import { useEffect, useState } from "react";
import api from "../api";
import type { Competicao, ResultadoCompeticao, Pombo } from "../types";

function IconClock() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconPin() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconDist() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l3-3-3-3"/><path d="M19 15l3-3-3-3"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
}

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function Competicoes() {
  const [competicoes, setCompeticoes] = useState<Competicao[]>([]);
  const [pombos, setPombos] = useState<Pombo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showResultForm, setShowResultForm] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", data: "", local: "", distancia: "", observacoes: "" });
  const [resultForm, setResultForm] = useState({ pomboId: "", posicao: "", velocidade: "", tempo: "", observacoes: "" });

  const load = () => api.get<Competicao[]>("/competicoes").then((r) => setCompeticoes(r.data));
  useEffect(() => { load(); api.get<Pombo[]>("/pombos").then((r) => setPombos(r.data)); }, []);

  const saveCompeticao = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/competicoes", { ...form, distancia: Number(form.distancia) });
    setShowForm(false);
    setForm({ nome: "", data: "", local: "", distancia: "", observacoes: "" });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Excluir competição?")) return;
    await api.delete(`/competicoes/${id}`);
    load();
  };

  const saveResultado = async (e: React.FormEvent, compId: number) => {
    e.preventDefault();
    await api.post(`/competicoes/${compId}/resultados`, {
      pomboId: Number(resultForm.pomboId),
      posicao: resultForm.posicao ? Number(resultForm.posicao) : null,
      observacoes: resultForm.observacoes || null,
    });
    setShowResultForm(null);
    setResultForm({ pomboId: "", posicao: "", velocidade: "", tempo: "", observacoes: "" });
    load();
  };

  const delResultado = async (resultadoId: number) => {
    if (!confirm("Remover resultado?")) return;
    await api.delete(`/competicoes/resultados/${resultadoId}`);
    load();
  };

  const totalComps = competicoes.length;
  const vitorias = competicoes.reduce((acc, c) => acc + (c.resultados?.filter((r) => r.posicao === 1).length ?? 0), 0);
  const participacoes = competicoes.reduce((acc, c) => acc + (c.resultados?.length ?? 0), 0);
  const taxa = participacoes > 0 ? Math.round((vitorias / participacoes) * 100) : 0;

  const isUpcoming = (c: Competicao) => new Date(c.data) >= new Date();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Competições</h1>
          <p>Gerencie competições e resultados</p>
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Competições</span><span className="kpi-value">{totalComps}</span></div>
          <div className="kpi-icon" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"/>
              <path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Vitórias</span><span className="kpi-value">{vitorias}</span></div>
          <div className="kpi-icon" style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Participações</span><span className="kpi-value">{participacoes}</span></div>
          <div className="kpi-icon" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Taxa de Vitória</span><span className="kpi-value">{taxa}%</span></div>
          <div className="kpi-icon" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"/>
              <path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Competition list card */}
      <div className="table-card">
        <div className="section-header">
          <h2>Todas as Competições</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Nova Competição</button>
        </div>

        {showForm && (
          <div className="inline-form">
            <form onSubmit={saveCompeticao}>
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Nome *</label>
                  <input className="form-control" required value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Data *</label>
                  <input type="date" className="form-control" required value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Local</label>
                  <input className="form-control" value={form.local} onChange={(e) => setForm((f) => ({ ...f, local: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Distância (km)</label>
                  <input type="number" className="form-control" value={form.distancia} onChange={(e) => setForm((f) => ({ ...f, distancia: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Observações</label>
                  <input className="form-control" value={form.observacoes} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} />
                </div>
                <div className="form-group form-group-btns">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="comp-list">
          {competicoes.map((c) => (
            <div key={c.id} className="comp-card">
              <div className="comp-header" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                <div className="comp-info">
                  <span className="comp-name">{c.nome}</span>
                  <div className="comp-meta">
                    <span><IconClock /> {new Date(c.data).toLocaleDateString("pt-BR")}</span>
                    {c.local && <span><IconPin /> {c.local}</span>}
                    {c.distancia && <span><IconDist /> {c.distancia}km</span>}
                  </div>
                </div>
                <div className="comp-right">
                  <span className={`badge ${isUpcoming(c) ? "badge-agendado" : "badge-concluido"}`}>
                    {isUpcoming(c) ? "Próxima" : "Finalizada"}
                  </span>
                  <button className="icon-btn icon-btn-danger" onClick={(e) => { e.stopPropagation(); del(c.id); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    </svg>
                  </button>
                </div>
              </div>

              {expandedId === c.id && (
                <div className="comp-body">
                  <div className="comp-participants-header">
                    <span className="comp-participants-label">Participantes:</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowResultForm(showResultForm === c.id ? null : c.id)}>
                      + Adicionar
                    </button>
                  </div>

                  {showResultForm === c.id && (
                    <form className="result-inline-form" onSubmit={(e) => saveResultado(e, c.id)}>
                      <select className="form-control" required value={resultForm.pomboId} onChange={(e) => setResultForm((f) => ({ ...f, pomboId: e.target.value }))}>
                        <option value="">Pombo…</option>
                        {pombos.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.anilha})</option>)}
                      </select>
                      <input type="number" className="form-control" placeholder="Posição" value={resultForm.posicao}
                        onChange={(e) => setResultForm((f) => ({ ...f, posicao: e.target.value }))} />
                      <input className="form-control" placeholder="Observações" value={resultForm.observacoes}
                        onChange={(e) => setResultForm((f) => ({ ...f, observacoes: e.target.value }))} />
                      <button type="submit" className="btn btn-primary btn-sm">OK</button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowResultForm(null)}>✕</button>
                    </form>
                  )}

                  <div className="participant-grid">
                    {(c.resultados ?? [])
                      .sort((a, b) => (a.posicao ?? 999) - (b.posicao ?? 999))
                      .map((r: ResultadoCompeticao) => (
                        <div key={r.id} className={`participant-card ${r.posicao === 1 ? "winner" : ""}`}>
                          <div className="participant-info">
                            <span className="participant-anilha">{r.pombo?.anilha || `#${r.pomboId}`}</span>
                            <span className="participant-nome">{r.pombo?.nome || "—"}</span>
                            {r.observacoes && <span className="participant-obs">{r.observacoes}</span>}
                          </div>
                          <div className="participant-right">
                            {r.posicao && (
                              <span className="participant-pos">
                                {MEDAL[r.posicao] ? MEDAL[r.posicao] : `#${r.posicao}`}
                              </span>
                            )}
                            <button className="icon-btn icon-btn-danger" onClick={() => delResultado(r.id)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    {(c.resultados ?? []).length === 0 && (
                      <div className="empty-state" style={{ padding: "12px 0" }}>Nenhum participante registrado.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {competicoes.length === 0 && <div className="empty-state">Nenhuma competição registrada.</div>}
        </div>
      </div>
    </div>
  );
}
