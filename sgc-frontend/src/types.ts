export type SexoPombo = 'Macho' | 'Femea';
export type StatusPombo = 'Ativo' | 'Vendido' | 'Falecido';
export type TipoRegistroSaude = 'Vacina' | 'Medicamento' | 'Exame' | 'Tratamento';
export type StatusRegistroSaude = 'Concluido' | 'Agendado';
export type StatusAcasalamento = 'Planejado' | 'EmAndamento' | 'Concluido';

export interface Pombo {
  id: number;
  anilha: string;
  nome: string;
  sexo: SexoPombo;
  dataNascimento: string;
  cor: string;
  origem: string;
  status: StatusPombo;
  paiId?: number;
  paiNome?: string;
  maeId?: number;
  maeNome?: string;
}

export interface RegistroSaude {
  id: number;
  pomboId: number;
  pombo?: Pombo;
  tipo: TipoRegistroSaude;
  descricao: string;
  data: string;
  proximaDose?: string;
  status: StatusRegistroSaude;
  observacoes?: string;
}

export interface Competicao {
  id: number;
  nome: string;
  data: string;
  local: string;
  distancia: number;
  observacoes?: string;
  resultados?: ResultadoCompeticao[];
}

export interface ResultadoCompeticao {
  id: number;
  competicaoId: number;
  pomboId: number;
  pombo?: Pombo;
  posicao?: number;
  tempo?: string;
  observacoes?: string;
}

export interface Acasalamento {
  id: number;
  machoId: number;
  macho?: Pombo;
  femeaId: number;
  femea?: Pombo;
  dataUniao: string;
  quantidadeOvos: number;
  filhotesNascidos: number;
  previsaoNascimento?: string;
  status: StatusAcasalamento;
  observacoes?: string;
}

export interface DashboardData {
  totalPombos: number;
  pombosTotal: number;
  emTratamento: number;
  totalCompeticoes: number;
  vitorias: number;
  taxaVitoria: number;
  acasalamentosAtivos: number;
  totalFilhotes: number;
  competicoesPorMes: { year: number; month: number; total: number }[];
  saudePorMes: { year: number; month: number; concluidos: number; agendados: number }[];
  proximasCompeticoes: { nome: string; data: string; local: string }[];
  topPerformers: { nome: string; anilha: string; vitorias: number }[];
  atividadesRecentes: { tipo: string; descricao: string; data: string }[];
}
