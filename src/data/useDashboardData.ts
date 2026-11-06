import { useEffect, useState } from 'react';
import type { DashboardData } from '../types';
import { loadDashboardData } from './sheets';

// Estado exposto pelo hook de carregamento dos dados do painel.
export interface UseDashboardData {
  // Dados do painel (planilha ou exemplo). Comeca nulo enquanto carrega.
  data: DashboardData | null;
  // Verdadeiro enquanto o carregamento inicial ainda nao terminou.
  loading: boolean;
  // Verdadeiro quando os dados exibidos sao os de exemplo empacotados.
  isSampleMode: boolean;
  // Erro ocorrido ao buscar a planilha (quando houve queda para os exemplos).
  error?: unknown;
}

// Carrega os dados do painel uma vez, na montagem.
// Como loadDashboardData nunca lanca, o hook sempre termina com dados validos
// (reais ou de exemplo), evitando qualquer estado de erro fatal na interface.
export function useDashboardData(): UseDashboardData {
  const [estado, setEstado] = useState<UseDashboardData>({
    data: null,
    loading: true,
    isSampleMode: false,
  });

  useEffect(() => {
    let ativo = true;

    loadDashboardData().then((resultado) => {
      if (!ativo) {
        return;
      }
      setEstado({
        data: resultado.data,
        loading: false,
        isSampleMode: resultado.isSampleMode,
        error: resultado.error,
      });
    });

    return () => {
      ativo = false;
    };
  }, []);

  return estado;
}
