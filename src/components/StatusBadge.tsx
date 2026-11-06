import type { PrioridadeDemanda, StatusDemanda } from '../types';

// Mapeia cada status de demanda para a classe CSS da cor correspondente.
const classePorStatus: Record<StatusDemanda, string> = {
  'A Fazer': 'badge-afazer',
  'Em Andamento': 'badge-andamento',
  Concluido: 'badge-concluido',
  Atrasado: 'badge-atrasado',
};

// Mapeia cada prioridade para a classe CSS da cor correspondente.
const classePorPrioridade: Record<PrioridadeDemanda, string> = {
  Baixa: 'prioridade-baixa',
  Media: 'prioridade-media',
  Alta: 'prioridade-alta',
};

interface StatusBadgeProps {
  status: StatusDemanda;
}

// Selo colorido que representa o status de uma demanda.
export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge ${classePorStatus[status]}`}>{status}</span>;
}

interface PrioridadeBadgeProps {
  prioridade: PrioridadeDemanda;
}

// Indicador colorido de prioridade da demanda.
export function PrioridadeBadge({ prioridade }: PrioridadeBadgeProps) {
  return (
    <span className={`badge badge-prioridade ${classePorPrioridade[prioridade]}`}>{prioridade}</span>
  );
}

export default StatusBadge;
