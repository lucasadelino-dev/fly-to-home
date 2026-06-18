import { useEffect, useState } from "react";
import api from "../api";
import type { Acasalamento, Pombo, StatusAcasalamento } from "../types";
import { toast } from "../toast";

interface FormState {
  machoId: string; femeaId: string; dataUniao: string;
  quantidadeOvos: string; filhotesNascidos: string;
  previsaoNascimento: string; status: StatusAcasalamento; observacoes: string;
}
const emptyForm: FormState = {
  machoId: "", femeaId: "", dataUniao: "", quantidadeOvos: "0",
  filhotesNascidos: "0", previsaoNascimento: "", status: "Planejado", observacoes: "",
};
const STATUS_LABELS: Record<StatusAcasalamento, string> = {
  Planejado: "Acasalados", EmAndamento: "Com Ovos", Concluido: "Eclodidos",
};
const STATUS_BADGE: Record<StatusAcasalamento, string> = {
  Planejado: "badge-agendado", EmAndamento: "badge-vendido", Concluido: "badge-concluido",
};

export default function Acasalamentos() {
  const [lista, setLista] = useState<Acasalamento[]>([]);
  const [pombos, setPombos] = useState<Pombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Acasalamento | null>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });

  const load = () =>
    api.get<Acasalamento[]>("/acasalamentos").then((r) => setLista(r.data));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      load(),
      api.get<Pombo[]>("/pombos").then((r) => setPombos(r.data)),
    ])
      .catch(() => toast.error("Erro ao carregar os acasalamentos."))
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true); };
  const openEdit = (a: Acasalamento) => {
    setEditing(a);
    setForm({
      machoId: String(a.machoId), femeaId: String(a.femeaId),
      dataUniao: a.dataUniao.substring(0, 10),
      quantidadeOvos: String(a.quantidadeOvos),
      filhotesNascidos: String(a.filhotesNascidos),
      previsaoNascimento: a.previsaoNascimento?.substring(0, 10) ?? "",
      status: a.status, observacoes: a.observacoes ?? "",
    });
    setShowForm(true);
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      machoId: Number(form.machoId), femeaId: Number(form.femeaId),
      quantidadeOvos: Number(form.quantidadeOvos),
      filhotesNascidos: Number(form.filhotesNascidos),
      previsaoNascimento: form.previsaoNascimento || null,
    };
    try {
      if (editing) await api.put(`/acasalamentos/${editing.id}`, { id: editing.id, ...payload });
      else await api.post("/acasalamentos", payload);
      toast.success(editing ? "Acasalamento atualizado." : "Acasalamento registrado com sucesso.");
      setShowForm(false);
      await load();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Erro ao salvar o acasalamento.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Excluir acasalamento?")) return;
    try {
      await api.delete(`/acasalamentos/${id}`);
      toast.success("Acasalamento removido.");
      await load();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Erro ao remover o acasalamento.";
      toast.error(msg);
    }
  };

  const machos = pombos.filter((p) => p.sexo === "Macho");
  const femeas = pombos.filter((p) => p.sexo === "Femea");

  const totalAca = lista.length;
  const bemSucedidos = lista.filter((a) => a.status === "Concluido").length;
  const totalOvos = lista.reduce((s, a) => s + a.quantidadeOvos, 0);
  const totalFilhotes = lista.reduce((s, a) => s + a.filhotesNascidos, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Acasalamentos</h1>
          <p>Controle de reprodução e linhagens</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Acasalamentos</span><span className="kpi-value">{totalAca}</span></div>
          <div className="kpi-icon" style={{ background: "rgba(236,72,153,0.12)", color: "#f472b6" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Bem Sucedidos</span><span className="kpi-value">{bemSucedidos}</span></div>
          <div className="kpi-icon" style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Total de Ovos</span><span className="kpi-value">{totalOvos}</span></div>
          <div className="kpi-icon" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <ellipse cx="12" cy="12" rx="5" ry="7"/>
            </svg>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left"><span className="kpi-label">Filhotes</span><span className="kpi-value">{totalFilhotes}</span></div>
          <div className="kpi-icon" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="section-header">
          <h2>Histórico de Acasalamentos</h2>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Acasalamento</button>
        </div>

        {loading ? (
          <div className="loading" style={{ padding: "48px" }}>Carregando...</div>
        ) : (
          <div className="aca-list">
            {lista.map((a) => (
              <div key={a.id} className="aca-row-card">
                <div className="aca-couple-row">
                  <div className="aca-pigeon male">
                    <span className="sex-badge sex-m">♂</span>
                    <div>
                      <div className="pigeon-anilha">{a.macho?.anilha}</div>
                      <div className="pigeon-nome">{a.macho?.nome}</div>
                    </div>
                  </div>
                  <div className="aca-heart">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f472b6" stroke="#f472b6" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <div className="aca-pigeon female">
                    <span className="sex-badge sex-f">♀</span>
                    <div>
                      <div className="pigeon-anilha">{a.femea?.anilha}</div>
                      <div className="pigeon-nome">{a.femea?.nome}</div>
                    </div>
                  </div>
                  <div className="aca-actions-right">
                    <span className={`badge ${STATUS_BADGE[a.status]}`}>{STATUS_LABELS[a.status]}</span>
                    <button className="icon-btn" onClick={() => openEdit(a)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="icon-btn icon-btn-danger" onClick={() => del(a.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="aca-details">
                  <span>📅 Acasalamento: {new Date(a.dataUniao).toLocaleDateString("pt-BR")}</span>
                  {a.previsaoNascimento && <span>🕐 Previsão: {new Date(a.previsaoNascimento).toLocaleDateString("pt-BR")}</span>}
                  <span>⭕ Ovos: {a.quantidadeOvos}</span>
                  {a.filhotesNascidos > 0 && <span className="nascidos">✓ Nascidos: {a.filhotesNascidos}</span>}
                </div>
                {a.observacoes && <div className="aca-obs">{a.observacoes}</div>}
              </div>
            ))}
            {lista.length === 0 && <div className="empty-state">Nenhum acasalamento registrado.</div>}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3>{editing ? "Editar Acasalamento" : "Novo Acasalamento"}</h3>
              <button className="icon-btn" onClick={() => setShowForm(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Macho *</label>
                  <select className="form-control" required value={form.machoId} onChange={(e) => set("machoId", e.target.value)}>
                    <option value="">Selecione…</option>
                    {machos.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.anilha})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fêmea *</label>
                  <select className="form-control" required value={form.femeaId} onChange={(e) => set("femeaId", e.target.value)}>
                    <option value="">Selecione…</option>
                    {femeas.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.anilha})</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Data de União *</label>
                  <input type="date" className="form-control" required value={form.dataUniao} onChange={(e) => set("dataUniao", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Previsão de Nascimento</label>
                  <input type="date" className="form-control" value={form.previsaoNascimento} onChange={(e) => set("previsaoNascimento", e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Qtd. Ovos</label>
                  <input type="number" min={0} className="form-control" value={form.quantidadeOvos} onChange={(e) => set("quantidadeOvos", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Filhotes Nascidos</label>
                  <input type="number" min={0} className="form-control" value={form.filhotesNascidos} onChange={(e) => set("filhotesNascidos", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-control" value={form.status} onChange={(e) => set("status", e.target.value as StatusAcasalamento)}>
                    <option value="Planejado">Planejado</option>
                    <option value="EmAndamento">Em Andamento</option>
                    <option value="Concluido">Concluído</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Observações</label>
                <textarea className="form-control" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} rows={2} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
