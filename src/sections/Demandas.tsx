import { useMemo, useState } from 'react';
import type { DashboardData } from '../types';
import { StatusBadge, PrioridadeBadge } from '../components/StatusBadge';

interface DemandasProps {
  dados: DashboardData;
}

const TODOS = 'Todos';

// Secao de cogestao / demandas: tabela com status e prioridade e filtros
// por status e por responsavel.
function Demandas({ dados }: DemandasProps) {
  const [filtroStatus, setFiltroStatus] = useState<string>(TODOS);
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>(TODOS);

  // Valores unicos para alimentar os seletores de filtro.
  const statusDisponiveis = useMemo(
    () => Array.from(new Set(dados.demandas.map((d) => d.status))),
    [dados.demandas],
  );
  const responsaveisDisponiveis = useMemo(
    () => Array.from(new Set(dados.demandas.map((d) => d.responsavel))),
    [dados.demandas],
  );

  const demandasFiltradas = dados.demandas.filter((d) => {
    const okStatus = filtroStatus === TODOS || d.status === filtroStatus;
    const okResponsavel = filtroResponsavel === TODOS || d.responsavel === filtroResponsavel;
    return okStatus && okResponsavel;
  });

  if (dados.demandas.length === 0) {
    return <p className="vazio">Nenhuma demanda cadastrada.</p>;
  }

  return (
    <div>
      <div className="filtros">
        <label className="filtro-campo">
          Status
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value={TODOS}>{TODOS}</option>
            {statusDisponiveis.map((s) => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="filtro-campo">
          Responsavel
          <select value={filtroResponsavel} onChange={(e) => setFiltroResponsavel(e.target.value)}>
            <option value={TODOS}>{TODOS}</option>
            {responsaveisDisponiveis.map((r) => (
              <option value={r} key={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      {demandasFiltradas.length === 0 ? (
        <p className="vazio">Nenhuma demanda corresponde aos filtros selecionados.</p>
      ) : (
        <div className="tabela-wrap cartao" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Responsavel</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Prazo</th>
              </tr>
            </thead>
            <tbody>
              {demandasFiltradas.map((d, i) => (
                <tr key={`${d.tarefa}-${i}`}>
                  <td>{d.tarefa}</td>
                  <td>{d.responsavel}</td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>
                    <PrioridadeBadge prioridade={d.prioridade} />
                  </td>
                  <td>{d.prazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Demandas;
