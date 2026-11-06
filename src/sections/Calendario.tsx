import type { DashboardData, EventoCalendario } from '../types';

interface CalendarioProps {
  dados: DashboardData;
}

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

// Extrai dia e mes de uma data no formato ISO (AAAA-MM-DD) sem depender de fuso.
function formatarData(iso: string): { dia: string; mes: string } {
  const partes = iso.split('-');
  if (partes.length === 3) {
    const mesIndice = Number(partes[1]) - 1;
    const mes = MESES[mesIndice] ?? partes[1];
    return { dia: partes[2], mes };
  }
  return { dia: iso, mes: '' };
}

// Ordena os eventos por data (crescente).
function ordenarPorData(eventos: EventoCalendario[]): EventoCalendario[] {
  return [...eventos].sort((a, b) => a.data.localeCompare(b.data));
}

// Secao de calendario / prazos: eventos ordenados por data.
function Calendario({ dados }: CalendarioProps) {
  if (dados.eventos.length === 0) {
    return <p className="vazio">Nenhum evento cadastrado.</p>;
  }

  const eventos = ordenarPorData(dados.eventos);

  return (
    <div className="pilha">
      {eventos.map((evento, i) => {
        const { dia, mes } = formatarData(evento.data);
        return (
          <div className="cartao evento" key={`${evento.titulo}-${i}`}>
            <div className="evento-data">
              <span className="dia">{dia}</span>
              <span className="mes">{mes}</span>
            </div>
            <div>
              <strong>{evento.titulo}</strong> <span className="badge badge-afazer">{evento.tipo}</span>
              {evento.descricao && (
                <p style={{ margin: '0.35rem 0 0', color: 'var(--cor-texto-suave)', fontSize: '0.9rem' }}>
                  {evento.descricao}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Calendario;
