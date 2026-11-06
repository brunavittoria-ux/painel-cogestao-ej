import type { DashboardData, LinkUtil } from '../types';

interface LinksUteisProps {
  dados: DashboardData;
}

// Agrupa os links por categoria, preservando a ordem de aparicao.
function agruparPorCategoria(links: LinkUtil[]): Record<string, LinkUtil[]> {
  const grupos: Record<string, LinkUtil[]> = {};
  for (const link of links) {
    const chave = link.categoria || 'Outros';
    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(link);
  }
  return grupos;
}

// Secao de links uteis, organizados por categoria.
function LinksUteis({ dados }: LinksUteisProps) {
  if (dados.links.length === 0) {
    return <p className="vazio">Nenhum link cadastrado.</p>;
  }

  const grupos = agruparPorCategoria(dados.links);

  return (
    <div>
      {Object.entries(grupos).map(([categoria, links]) => (
        <div key={categoria}>
          <h3 className="secao-titulo">{categoria}</h3>
          <div className="grade">
            {links.map((link, i) => (
              <div className="cartao" key={`${link.titulo}-${i}`}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <strong>{link.titulo}</strong>
                </a>
                {link.descricao && (
                  <p style={{ margin: '0.4rem 0 0', color: 'var(--cor-texto-suave)', fontSize: '0.88rem' }}>
                    {link.descricao}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LinksUteis;
