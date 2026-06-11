import { useEffect, useState } from "react";
import api from "../api";
import type { Pombo } from "../types";

interface PedigreeNode {
  id: number; nome: string; anilha: string; sexo: string; cor?: string;
  pai?: PedigreeNode; mae?: PedigreeNode;
}

function PedigreeCard({ node, level }: { node: PedigreeNode; level: number }) {
  const labels = ["Pombo", "Pais", "Avós"];
  const isMale = node.sexo === "Macho";
  return (
    <div className={`pedigree-card ${isMale ? "pedigree-male" : "pedigree-female"}`}>
      <div className="pedigree-level">{labels[level] || "Ancestral"}</div>
      <div className="pedigree-anilha">{node.anilha}</div>
      <div className="pedigree-name">{node.nome}</div>
      <div className="pedigree-sex">{isMale ? "♂ Macho" : "♀ Fêmea"}</div>
    </div>
  );
}

export default function Pedigree() {
  const [pombos, setPombos] = useState<Pombo[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [tree, setTree] = useState<PedigreeNode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Pombo[]>("/pombos").then((r) => {
      setPombos(r.data);
      if (r.data.length > 0) setSelectedId(String(r.data[0].id));
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    api.get<PedigreeNode>(`/pombos/${selectedId}/pedigree`)
      .then((r) => setTree(r.data))
      .finally(() => setLoading(false));
  }, [selectedId]);

  const pai = tree?.pai;
  const mae = tree?.mae;
  const avos = [pai?.pai, pai?.mae, mae?.pai, mae?.mae].filter(Boolean) as PedigreeNode[];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pedigree</h1>
          <p>Árvore genealógica dos pombos</p>
        </div>
      </div>

      <div className="table-card" style={{ marginBottom: 16, padding: "20px 24px" }}>
        <div className="form-group" style={{ maxWidth: 340, margin: 0 }}>
          <label className="kpi-label">Selecionar Pombo</label>
          <select
            className="form-control"
            style={{ marginTop: 8 }}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {pombos.map((p) => (
              <option key={p.id} value={p.id}>{p.anilha} – {p.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading">Carregando árvore…</div>}

      {!loading && tree && (
        <div className="table-card" style={{ padding: "32px 24px" }}>
          <div className="pedigree-tree-layout">
            {/* Col 1: selected pigeon */}
            <div className="pedigree-col pedigree-col-1">
              <PedigreeCard node={tree} level={0} />
            </div>

            {/* Col 2: parents */}
            <div className="pedigree-col pedigree-col-2">
              {pai && <PedigreeCard node={pai} level={1} />}
              {mae && <PedigreeCard node={mae} level={1} />}
              {!pai && !mae && <div className="empty-state">Sem pais registrados</div>}
            </div>

            {/* Col 3: grandparents */}
            <div className="pedigree-col pedigree-col-3">
              {avos.length > 0
                ? avos.map((av) => <PedigreeCard key={av.id} node={av} level={2} />)
                : <div className="empty-state">Sem avós registrados</div>}
            </div>
          </div>
        </div>
      )}

      {!loading && !tree && selectedId && (
        <div className="empty-state">Nenhuma árvore disponível.</div>
      )}
    </div>
  );
}
