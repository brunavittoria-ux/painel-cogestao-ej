import type { Contato, DashboardData } from '../types';
import CopyButton from '../components/CopyButton';

interface ContatosProps {
  dados: DashboardData;
}

// Ordem de exibicao dos grupos de contatos.
const ORDEM_GRUPOS: Contato['grupo'][] = ['Diretoria', 'Conselho', 'Parceiros', 'Federacao'];

// Agrupa os contatos por grupo.
function agruparPorGrupo(contatos: Contato[]): Record<string, Contato[]> {
  const grupos: Record<string, Contato[]> = {};
  for (const contato of contatos) {
    const chave = contato.grupo || 'Outros';
    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(contato);
  }
  return grupos;
}

// Secao de contatos, organizados por grupo, com copia de email e telefone.
function Contatos({ dados }: ContatosProps) {
  if (dados.contatos.length === 0) {
    return <p className="vazio">Nenhum contato cadastrado.</p>;
  }

  const grupos = agruparPorGrupo(dados.contatos);
  // Mostra primeiro os grupos na ordem definida e depois quaisquer outros.
  const chavesOrdenadas = [
    ...ORDEM_GRUPOS.filter((g) => grupos[g]),
    ...Object.keys(grupos).filter((g) => !ORDEM_GRUPOS.includes(g as Contato['grupo'])),
  ];

  return (
    <div>
      {chavesOrdenadas.map((grupo) => (
        <div key={grupo}>
          <h3 className="secao-titulo">{grupo}</h3>
          <div className="grade">
            {grupos[grupo].map((contato, i) => (
              <div className="cartao" key={`${contato.nome}-${i}`}>
                <strong>{contato.nome}</strong>
                <p style={{ margin: '0.15rem 0', color: 'var(--cor-texto-suave)', fontSize: '0.88rem' }}>
                  {contato.cargo}
                </p>

                {contato.email && (
                  <div className="campo-copia" style={{ marginTop: '0.4rem' }}>
                    <code>{contato.email}</code>
                    <CopyButton texto={contato.email} rotulo="Copiar email" />
                  </div>
                )}

                {contato.telefone && (
                  <div className="campo-copia" style={{ marginTop: '0.4rem' }}>
                    <code>{contato.telefone}</code>
                    <CopyButton texto={contato.telefone} rotulo="Copiar telefone" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Contatos;
