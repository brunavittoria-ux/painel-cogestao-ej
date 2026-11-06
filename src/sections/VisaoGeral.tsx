import type { DashboardData } from '../types';

interface VisaoGeralProps {
  dados: DashboardData;
}

// Contadores rapidos exibidos no topo da Visao Geral.
function contadores(dados: DashboardData) {
  return [
    { rotulo: 'Credenciais', valor: dados.credenciais.length },
    { rotulo: 'Links uteis', valor: dados.links.length },
    { rotulo: 'Manuais', valor: dados.manuais.length },
    { rotulo: 'Demandas', valor: dados.demandas.length },
    { rotulo: 'Eventos', valor: dados.eventos.length },
    { rotulo: 'Contatos', valor: dados.contatos.length },
  ];
}

// Secao inicial: resumo com contadores, avisos importantes e atalhos rapidos.
function VisaoGeral({ dados }: VisaoGeralProps) {
  return (
    <div>
      <div className="contadores">
        {contadores(dados).map((c) => (
          <div className="contador" key={c.rotulo}>
            <div className="numero">{c.valor}</div>
            <div className="rotulo">{c.rotulo}</div>
          </div>
        ))}
      </div>

      <h3 className="secao-titulo">Avisos importantes</h3>
      {dados.avisos.length === 0 ? (
        <p className="vazio">Nenhum aviso no momento.</p>
      ) : (
        <div className="pilha">
          {dados.avisos.map((aviso, i) => (
            <div className={`cartao aviso ${aviso.nivel}`} key={`${aviso.titulo}-${i}`}>
              <strong>{aviso.titulo}</strong>
              <p style={{ margin: '0.35rem 0' }}>{aviso.mensagem}</p>
              <span className="aviso-meta">
                {aviso.nivel.toUpperCase()} - {aviso.data}
              </span>
            </div>
          ))}
        </div>
      )}

      <h3 className="secao-titulo">Atalhos rapidos</h3>
      {dados.atalhos.length === 0 ? (
        <p className="vazio">Nenhum atalho cadastrado.</p>
      ) : (
        <div className="grade">
          {dados.atalhos.map((atalho, i) => (
            <a
              className="cartao atalho"
              href={atalho.url}
              target="_blank"
              rel="noopener noreferrer"
              key={`${atalho.titulo}-${i}`}
            >
              <span className="emoji" aria-hidden="true">
                {atalho.icone}
              </span>
              {atalho.titulo}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default VisaoGeral;
