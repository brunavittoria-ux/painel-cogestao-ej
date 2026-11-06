import type { ReactNode } from 'react';
import type { SectionKey } from '../types';
import Sidebar, { secoes } from './Sidebar';

interface LayoutProps {
  secaoAtiva: SectionKey;
  aoSelecionar: (chave: SectionKey) => void;
  aoSair: () => void;
  children: ReactNode;
}

// Estrutura principal do painel: menu lateral, cabecalho com o titulo da
// secao atual e a area de conteudo onde a secao selecionada e renderizada.
function Layout({ secaoAtiva, aoSelecionar, aoSair, children }: LayoutProps) {
  const atual = secoes.find((item) => item.chave === secaoAtiva);

  return (
    <div className="shell">
      <Sidebar secaoAtiva={secaoAtiva} aoSelecionar={aoSelecionar} aoSair={aoSair} />

      <div className="conteudo">
        <header className="topo">
          <h2>
            {atual ? `${atual.emoji} ${atual.rotulo}` : 'Painel de Cogestao'}
          </h2>
          <p>Presidencia da Empresa Junior - centralize acessos, demandas e informacoes.</p>
        </header>

        <main className="area-principal">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
