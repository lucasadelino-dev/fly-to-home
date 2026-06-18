import { useEffect, useState } from "react";
import api from "../api";
import type { Pombo } from "../types";
import PomboForm from "../components/PomboForm";
import { toast } from "../toast";

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

export default function Pombos() {
  const [pombos, setPombos] = useState<Pombo[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Pombo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = (q = "") => {
    setLoading(true);
    return api.get<Pombo[]>("/pombos", { params: { search: q } })
      .then((r) => setPombos(r.data))
      .catch(() => toast.error("Erro ao carregar os pombos."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    load(e.target.value);
  };

  const del = async (id: number) => {
    if (!confirm("Remover pombo?")) return;
    try {
      await api.delete(`/pombos/${id}`);
      toast.success("Pombo removido com sucesso.");
      load(search);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Erro ao remover o pombo.";
      toast.error(msg);
    }
  };

  const statusClass = (s: string) => {
    if (s === "Ativo") return "badge badge-ativo";
    if (s === "Vendido") return "badge badge-vendido";
    return "badge badge-falecido";
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pombos</h1>
          <p>Gerencie seus pombos</p>
        </div>
      </div>

      <div className="page-actions">
        <div className="search-wrapper">
          <span className="search-icon"><IconSearch /></span>
          <input
            className="search-input"
            placeholder="Buscar por anilha ou nome..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          + Adicionar Pombo
        </button>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading" style={{ padding: "48px" }}>Carregando...</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Anilha</th><th>Nome</th><th>Sexo</th><th>Data Nasc.</th>
                  <th>Cor</th><th>Origem</th><th>Status</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pombos.map((p) => (
                  <tr key={p.id}>
                    <td><span className="anilha-badge">{p.anilha}</span></td>
                    <td className="font-medium">{p.nome}</td>
                    <td>{p.sexo}</td>
                    <td>{new Date(p.dataNascimento).toLocaleDateString("pt-BR")}</td>
                    <td>{p.cor}</td>
                    <td>{p.origem || "—"}</td>
                    <td><span className={statusClass(p.status)}>{p.status}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" onClick={() => { setEditing(p); setShowForm(true); }} title="Editar">
                          <IconEdit />
                        </button>
                        <button className="icon-btn icon-btn-danger" onClick={() => del(p.id)} title="Excluir">
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pombos.length === 0 && <div className="empty-state">Nenhum pombo encontrado.</div>}
          </>
        )}
      </div>

      {showForm && (
        <PomboForm
          initial={editing}
          pombos={pombos}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(search); }}
        />
      )}
    </div>
  );
}
