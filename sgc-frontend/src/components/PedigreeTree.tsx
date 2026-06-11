import { useEffect, useState } from 'react';
import api from '../api';

interface TreeNode {
  id: number;
  anilha: string;
  nome: string;
  sexo: string;
  cor: string;
  pai?: TreeNode | null;
  mae?: TreeNode | null;
}

interface Props {
  id: number;
  onClose: () => void;
}

function TreeNodeCard({ node, depth }: { node: TreeNode; depth: number }) {
  if (depth > 3) return null;
  return (
    <div className={`tree-node depth-${depth}`}>
      <div className="tree-card">
        <span className={`tree-sex ${node.sexo === 'Macho' ? 'sex-m' : 'sex-f'}`}>{node.sexo === 'Macho' ? '♂' : '♀'}</span>
        <div>
          <div className="tree-nome">{node.nome}</div>
          <div className="tree-anilha">{node.anilha}</div>
          <div className="tree-cor">{node.cor}</div>
        </div>
      </div>
      {(node.pai || node.mae) && (
        <div className="tree-children">
          {node.pai && <TreeNodeCard node={node.pai} depth={depth + 1} />}
          {node.mae && <TreeNodeCard node={node.mae} depth={depth + 1} />}
        </div>
      )}
    </div>
  );
}

export default function PedigreeTree({ id, onClose }: Props) {
  const [tree, setTree] = useState<TreeNode | null>(null);

  useEffect(() => {
    api.get<TreeNode>(`/pombos/${id}/pedigree`).then(r => setTree(r.data));
  }, [id]);

  return (
    <div className="modal-overlay">
      <div className="modal modal-wide">
        <div className="modal-header">
          <h2>Pedigree / Árvore Genealógica</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="pedigree-container">
          {tree ? <TreeNodeCard node={tree} depth={1} /> : <div className="loading">Carregando…</div>}
        </div>
      </div>
    </div>
  );
}
