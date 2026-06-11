import { useEffect, useState } from "react";
import api from "../api";
import type { Pombo, SexoPombo, StatusPombo } from "../types";

interface FormState {
  anilha: string; nome: string; sexo: SexoPombo; dataNascimento: string;
  cor: string; origem: string; status: StatusPombo; paiId: string; maeId: string;
}
interface Props {
  initial: Pombo | null; pombos: Pombo[];
  onClose: () => void; onSaved: () => void;
}
const emptyForm: FormState = {
  anilha: "", nome: "", sexo: "Macho", dataNascimento: "",
  cor: "", origem: "", status: "Ativo", paiId: "", maeId: "",
};

export default function PomboForm({ initial, pombos, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>({ ...emptyForm });

  useEffect(() => {
    if (initial) {
      setForm({
        anilha: initial.anilha, nome: initial.nome, sexo: initial.sexo,
        dataNascimento: initial.dataNascimento.substring(0, 10),
        cor: initial.cor, origem: initial.origem, status: initial.status,
        paiId: initial.paiId ? String(initial.paiId) : "",
        maeId: initial.maeId ? String(initial.maeId) : "",
      });
    } else {
      setForm({ ...emptyForm });
    }
  }, [initial]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      paiId: form.paiId ? Number(form.paiId) : null,
      maeId: form.maeId ? Number(form.maeId) : null,
    };
    if (initial) await api.put(`/pombos/${initial.id}`, { id: initial.id, ...payload });
    else await api.post("/pombos", payload);
    onSaved();
  };

  const machos = pombos.filter((p) => p.sexo === "Macho");
  const femeas = pombos.filter((p) => p.sexo === "Femea");

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3>{initial ? "Editar Pombo" : "Adicionar Pombo"}</h3>
          <button className="icon-btn" onClick={onClose} style={{ border: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Anilha + Nome */}
          <div className="form-row">
            <div className="form-group">
              <label>Anilha *</label>
              <input
                className="form-control"
                required
                placeholder="BR2024-001"
                value={form.anilha}
                onChange={(e) => set("anilha", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nome *</label>
              <input
                className="form-control"
                required
                placeholder="Thunder"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Sexo + Data */}
          <div className="form-row">
            <div className="form-group">
              <label>Sexo</label>
              <select className="form-control" value={form.sexo} onChange={(e) => set("sexo", e.target.value as SexoPombo)}>
                <option value="Macho">Macho</option>
                <option value="Femea">Fêmea</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                className="form-control"
                required
                value={form.dataNascimento}
                onChange={(e) => set("dataNascimento", e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Cor + Origem */}
          <div className="form-row">
            <div className="form-group">
              <label>Cor</label>
              <input
                className="form-control"
                placeholder="Azul"
                value={form.cor}
                onChange={(e) => set("cor", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Origem</label>
              <input
                className="form-control"
                placeholder="Brasil"
                value={form.origem}
                onChange={(e) => set("origem", e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Status full width */}
          <div className="form-group">
            <label>Status</label>
            <select className="form-control" value={form.status} onChange={(e) => set("status", e.target.value as StatusPombo)}>
              <option value="Ativo">Ativo</option>
              <option value="Vendido">Vendido</option>
              <option value="Falecido">Falecido</option>
            </select>
          </div>

          {/* Row 5: Pai + Mãe */}
          <div className="form-row">
            <div className="form-group">
              <label>Pai</label>
              <select className="form-control" value={form.paiId} onChange={(e) => set("paiId", e.target.value)}>
                <option value="">Nenhum</option>
                {machos.filter((p) => p.id !== initial?.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.nome} ({p.anilha})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Mãe</label>
              <select className="form-control" value={form.maeId} onChange={(e) => set("maeId", e.target.value)}>
                <option value="">Nenhuma</option>
                {femeas.filter((p) => p.id !== initial?.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.nome} ({p.anilha})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{initial ? "Salvar" : "Cadastrar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
