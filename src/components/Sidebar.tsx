import type { SectionKey } from '../types';

// Definicao de cada item do menu lateral: chave, emoji e rotulo em portugues.
// Os rotulos usam acentuacao mesmo que os dados de exemplo usem ASCII.
export interface ItemSecao {
  chave: SectionKey;
  emoji: string;
  rotulo: string;
}

export const secoes: ItemSecao[] = [
  { chave: 'visaoGeral', emoji: '🏠', rotulo: 'Visão Geral' },
  { chave: 'credenciais', emoji: '🔐', rotulo: 'Credenciais & Acessos' },
  { chave: 'links', emoji: '🔗', rotulo: 'Links Úteis' },
  { chave: 'manuais', emoji: '📘', rotulo: 'Manuais & SLAs' },
  { chave: 'demandas', emoji: '✅', rotulo: 'Cogestão / Demandas' },
  { chave: 'calendario', emoji: '📅', rotulo: 'Calendário / Prazos' },
  { chave: 'contatos', emoji: '👥', rotulo: 'Contatos' },
];

interface SidebarProps {
  secaoAtiva: SectionKey;
  aoSelecionar: (chave: SectionKey) => void;
  aoSair: () => void;
}

// Menu lateral com as sete secoes do painel e a acao de sair.
function Sidebar({ secaoAtiva, aoSelecionar, aoSair }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-titulo">
        Painel de Cogestao
        <small>Presidencia da Empresa Junior</small>
      </div>

      <nav className="sidebar-nav" aria-label="Secoes do painel">
        {secoes.map((item) => (
          <button
            key={item.chave}
            type="button"
            className={item.chave === secaoAtiva ? 'sidebar-item ativo' : 'sidebar-item'}
            onClick={() => aoSelecionar(item.chave)}
            aria-current={item.chave === secaoAtiva ? 'page' : undefined}
          >
            <span className="emoji" aria-hidden="true">
              {item.emoji}
            </span>
            {item.rotulo}
          </button>
        ))}
      </nav>

      <div className="sidebar-rodape">
        <button type="button" className="btn-sair" onClick={aoSair}>
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
