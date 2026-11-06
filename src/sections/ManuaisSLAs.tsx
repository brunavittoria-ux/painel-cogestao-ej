import type { DashboardData } from '../types';

interface ManuaisSLAsProps {
  dados: DashboardData;
}

// Secao de manuais e SLAs: cartoes com descricao, prazo de resposta (SLA)
// e link para o documento.
function ManuaisSLAs({ dados }: ManuaisSLAsProps) {
  if (dados.manuais.length === 0) {
    return <p className="vazio">Nenhum manual cadastrado.</p>;
  }

  return (
    <div className="grade">
      {dados.manuais.map((manual, i) => (
        <div className="cartao" key={`${manual.titulo}-${i}`}>
          <h3 style={{ fontSize: '1rem' }}>{manual.titulo}</h3>
          {manual.descricao && (
            <p style={{ margin: '0.4rem 0', color: 'var(--cor-texto-suave)', fontSize: '0.9rem' }}>
              {manual.descricao}
            </p>
          )}
          {manual.slaResposta && (
            <p style={{ margin: '0.4rem 0' }}>
              <strong>SLA:</strong> {manual.slaResposta}
            </p>
          )}
          {manual.documentoUrl && (
            <p style={{ margin: '0.4rem 0 0' }}>
              <a href={manual.documentoUrl} target="_blank" rel="noopener noreferrer">
                Abrir documento
              </a>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManuaisSLAs;
