// Definicoes de tipos para o painel de cogestao.
// Cada interface representa o formato de uma linha de uma secao do painel,
// correspondente a uma aba da planilha do Google Sheets (quando conectada).

// Secao: Visao Geral
// Avisos importantes exibidos em destaque na pagina inicial do painel.
export interface Aviso {
  titulo: string;
  mensagem: string;
  // Nivel de importancia usado para destacar visualmente o aviso.
  nivel: 'info' | 'atencao' | 'critico';
  data: string;
}

// Atalhos rapidos para recursos mais acessados.
export interface Atalho {
  titulo: string;
  url: string;
  icone: string;
}

// Secao: Credenciais & Acessos
export interface Credencial {
  servico: string;
  loginEmail: string;
  senha: string;
  link: string;
  observacao: string;
}

// Secao: Links Uteis
export interface LinkUtil {
  categoria: string;
  titulo: string;
  url: string;
  descricao: string;
}

// Secao: Manuais & SLAs
export interface Manual {
  titulo: string;
  descricao: string;
  slaResposta: string;
  documentoUrl: string;
}

// Status possiveis de uma demanda da cogestao.
export type StatusDemanda = 'A Fazer' | 'Em Andamento' | 'Concluido' | 'Atrasado';

// Prioridade de uma demanda.
export type PrioridadeDemanda = 'Baixa' | 'Media' | 'Alta';

// Secao: Cogestao / Demandas
export interface Demanda {
  tarefa: string;
  responsavel: string;
  status: StatusDemanda;
  prazo: string;
  prioridade: PrioridadeDemanda;
}

// Secao: Calendario / Prazos
export interface EventoCalendario {
  titulo: string;
  data: string;
  tipo: 'Reuniao' | 'Entrega' | 'Evento' | 'Prazo';
  descricao: string;
}

// Secao: Contatos
export interface Contato {
  nome: string;
  cargo: string;
  grupo: 'Diretoria' | 'Conselho' | 'Parceiros' | 'Federacao';
  email: string;
  telefone: string;
}

// Identificadores das sete secoes do painel.
export type SectionKey =
  | 'visaoGeral'
  | 'credenciais'
  | 'links'
  | 'manuais'
  | 'demandas'
  | 'calendario'
  | 'contatos';

// Agregado com todos os dados do painel, vindos da planilha ou dos dados de exemplo.
export interface DashboardData {
  avisos: Aviso[];
  atalhos: Atalho[];
  credenciais: Credencial[];
  links: LinkUtil[];
  manuais: Manual[];
  demandas: Demanda[];
  eventos: EventoCalendario[];
  contatos: Contato[];
}
