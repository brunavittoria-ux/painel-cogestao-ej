// Cliente do Google Sheets via endpoint gviz (sem backend e sem chave de API).
//
// O endpoint gviz devolve o conteudo de uma aba em um formato JSONP: um JSON
// embrulhado em uma chamada de funcao do tipo
//   /*O_o*/
//   google.visualization.Query.setResponse({ ... });
// Aqui removemos esse envelope, lemos as colunas pelo cabecalho (primeira linha)
// e convertemos cada linha em um objeto tipado de cada secao do painel.
//
// Em qualquer falha (rede, parse, planilha vazia) o carregador registra um
// aviso no console e devolve os dados de exemplo empacotados, marcando
// isSampleMode = true. O carregador nunca lanca excecao para a interface e
// nao faz nenhuma requisicao de rede quando a planilha nao esta configurada.

import type {
  Aviso,
  Atalho,
  Contato,
  Credencial,
  DashboardData,
  Demanda,
  EventoCalendario,
  LinkUtil,
  Manual,
  PrioridadeDemanda,
  SectionKey,
  StatusDemanda,
} from '../types';
import { config, isSheetConfigured } from '../config';
import { sampleData } from './sampleData';

// Resultado do carregamento dos dados do painel.
export interface LoadResult {
  data: DashboardData;
  isSampleMode: boolean;
  error?: unknown;
}

// Representacao simplificada de uma aba: uma lista de linhas, cada uma sendo
// um mapa de "cabecalho da coluna" -> "valor da celula como texto".
type Linha = Record<string, string>;

// Formato (parcial) da resposta do gviz que nos interessa.
interface GvizCell {
  v: unknown;
  f?: string;
}
interface GvizRow {
  c: Array<GvizCell | null>;
}
interface GvizColumn {
  label?: string;
  id?: string;
}
interface GvizTable {
  cols: GvizColumn[];
  rows: GvizRow[];
}
interface GvizResponse {
  status?: string;
  table?: GvizTable;
}

// Monta a URL do endpoint gviz para uma aba especifica da planilha.
export function montarUrlGviz(sheetId: string, aba: string): string {
  const base = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq`;
  const params = new URLSearchParams({ tqx: 'out:json', sheet: aba });
  return `${base}?${params.toString()}`;
}

// Remove o envelope JSONP do gviz e devolve o objeto JSON de resposta.
// Aceita variacoes do prefixo (com ou sem o comentario /*O_o*/) e tolera
// espacos em branco ao redor.
export function extrairJsonGviz(texto: string): GvizResponse {
  const inicio = texto.indexOf('{');
  const fim = texto.lastIndexOf('}');
  if (inicio === -1 || fim === -1 || fim < inicio) {
    throw new Error('Resposta do gviz sem corpo JSON reconhecivel.');
  }
  const corpo = texto.slice(inicio, fim + 1);
  return JSON.parse(corpo) as GvizResponse;
}

// Converte o valor de uma celula do gviz em texto limpo.
function valorCelula(cell: GvizCell | null): string {
  if (!cell) {
    return '';
  }
  // Preferimos o valor formatado (f) quando existe, pois reflete o que o
  // usuario ve na planilha (datas, numeros etc.). Caso contrario usamos v.
  if (cell.f !== undefined && cell.f !== null) {
    return String(cell.f).trim();
  }
  if (cell.v === undefined || cell.v === null) {
    return '';
  }
  return String(cell.v).trim();
}

// Converte uma tabela gviz em uma lista de linhas indexadas pelo cabecalho.
// Os cabecalhos vem dos rotulos das colunas (cols[].label); quando ausentes,
// a primeira linha de dados e usada como cabecalho.
export function tabelaParaLinhas(table: GvizTable | undefined): Linha[] {
  if (!table || !Array.isArray(table.rows)) {
    return [];
  }

  const colunas = Array.isArray(table.cols) ? table.cols : [];
  let cabecalhos: string[] = colunas.map((c) => (c.label ?? '').trim());
  let linhasDados = table.rows;

  // Se os rotulos das colunas estiverem vazios, usamos a primeira linha como
  // cabecalho (caso comum quando a planilha nao tem linha de cabecalho propria).
  const temCabecalho = cabecalhos.some((h) => h !== '');
  if (!temCabecalho && table.rows.length > 0) {
    cabecalhos = table.rows[0].c.map((c) => valorCelula(c));
    linhasDados = table.rows.slice(1);
  }

  const linhas: Linha[] = [];
  for (const row of linhasDados) {
    const celulas = Array.isArray(row.c) ? row.c : [];
    const registro: Linha = {};
    let temConteudo = false;
    cabecalhos.forEach((cabecalho, indice) => {
      if (!cabecalho) {
        return;
      }
      const valor = valorCelula(celulas[indice] ?? null);
      registro[cabecalho] = valor;
      if (valor !== '') {
        temConteudo = true;
      }
    });
    // Ignora linhas completamente vazias.
    if (temConteudo) {
      linhas.push(registro);
    }
  }
  return linhas;
}

// Le o valor de uma linha tentando varios nomes de coluna possiveis.
// Isso torna o mapeamento tolerante a pequenas variacoes de cabecalho.
function campo(linha: Linha, ...nomes: string[]): string {
  for (const nome of nomes) {
    const valor = linha[nome];
    if (valor !== undefined && valor !== '') {
      return valor;
    }
  }
  return '';
}

// ----- Mapeamentos por secao -----
// Cada funcao recebe as linhas lidas da aba e produz os objetos tipados.
// Os cabecalhos esperados estao documentados no README (tabela de colunas).

function mapearAvisos(linhas: Linha[]): Aviso[] {
  const niveis: Aviso['nivel'][] = ['info', 'atencao', 'critico'];
  return linhas.map((l) => {
    const nivel = campo(l, 'Nivel', 'Nível').toLowerCase();
    return {
      titulo: campo(l, 'Titulo', 'Título'),
      mensagem: campo(l, 'Mensagem'),
      nivel: (niveis.includes(nivel as Aviso['nivel']) ? nivel : 'info') as Aviso['nivel'],
      data: campo(l, 'Data'),
    };
  });
}

function mapearAtalhos(linhas: Linha[]): Atalho[] {
  return linhas.map((l) => ({
    titulo: campo(l, 'Titulo', 'Título'),
    url: campo(l, 'URL', 'Url', 'Link'),
    icone: campo(l, 'Icone', 'Ícone'),
  }));
}

function mapearCredenciais(linhas: Linha[]): Credencial[] {
  return linhas.map((l) => ({
    servico: campo(l, 'Servico', 'Serviço'),
    loginEmail: campo(l, 'Login/Email', 'Login', 'Email', 'Login / Email'),
    senha: campo(l, 'Senha'),
    link: campo(l, 'Link', 'URL'),
    observacao: campo(l, 'Observacao', 'Observação', 'Obs'),
  }));
}

function mapearLinks(linhas: Linha[]): LinkUtil[] {
  return linhas.map((l) => ({
    categoria: campo(l, 'Categoria'),
    titulo: campo(l, 'Titulo', 'Título'),
    url: campo(l, 'URL', 'Url', 'Link'),
    descricao: campo(l, 'Descricao', 'Descrição'),
  }));
}

function mapearManuais(linhas: Linha[]): Manual[] {
  return linhas.map((l) => ({
    titulo: campo(l, 'Titulo', 'Título'),
    descricao: campo(l, 'Descricao', 'Descrição'),
    slaResposta: campo(l, 'SLA de Resposta', 'SLA', 'SLA Resposta'),
    documentoUrl: campo(l, 'Documento URL', 'Documento', 'URL', 'Link'),
  }));
}

function mapearDemandas(linhas: Linha[]): Demanda[] {
  const status: StatusDemanda[] = ['A Fazer', 'Em Andamento', 'Concluido', 'Atrasado'];
  const prioridades: PrioridadeDemanda[] = ['Baixa', 'Media', 'Alta'];
  return linhas.map((l) => {
    const st = campo(l, 'Status');
    const pr = campo(l, 'Prioridade');
    return {
      tarefa: campo(l, 'Tarefa'),
      responsavel: campo(l, 'Responsavel', 'Responsável'),
      status: (status.includes(st as StatusDemanda) ? st : 'A Fazer') as StatusDemanda,
      prazo: campo(l, 'Prazo'),
      prioridade: (prioridades.includes(pr as PrioridadeDemanda) ? pr : 'Media') as PrioridadeDemanda,
    };
  });
}

function mapearEventos(linhas: Linha[]): EventoCalendario[] {
  const tipos: EventoCalendario['tipo'][] = ['Reuniao', 'Entrega', 'Evento', 'Prazo'];
  return linhas.map((l) => {
    const tipo = campo(l, 'Tipo');
    return {
      titulo: campo(l, 'Titulo', 'Título'),
      data: campo(l, 'Data'),
      tipo: (tipos.includes(tipo as EventoCalendario['tipo']) ? tipo : 'Evento') as EventoCalendario['tipo'],
      descricao: campo(l, 'Descricao', 'Descrição'),
    };
  });
}

function mapearContatos(linhas: Linha[]): Contato[] {
  const grupos: Contato['grupo'][] = ['Diretoria', 'Conselho', 'Parceiros', 'Federacao'];
  return linhas.map((l) => {
    const grupo = campo(l, 'Grupo');
    return {
      nome: campo(l, 'Nome'),
      cargo: campo(l, 'Cargo'),
      grupo: (grupos.includes(grupo as Contato['grupo']) ? grupo : 'Parceiros') as Contato['grupo'],
      email: campo(l, 'Email', 'E-mail'),
      telefone: campo(l, 'Telefone', 'Fone'),
    };
  });
}

// Busca uma aba da planilha e devolve suas linhas ja indexadas pelo cabecalho.
// Lanca excecao em caso de falha de rede, resposta nao reconhecivel ou aba vazia.
async function buscarAba(sheetId: string, aba: string, fetchImpl: typeof fetch): Promise<Linha[]> {
  const url = montarUrlGviz(sheetId, aba);
  const resposta = await fetchImpl(url);
  if (!resposta.ok) {
    throw new Error(`Falha ao buscar a aba "${aba}" (HTTP ${resposta.status}).`);
  }
  const texto = await resposta.text();
  const json = extrairJsonGviz(texto);
  const linhas = tabelaParaLinhas(json.table);
  if (linhas.length === 0) {
    throw new Error(`A aba "${aba}" nao retornou linhas de dados.`);
  }
  return linhas;
}

// Busca todas as sete abas e monta o objeto DashboardData.
// Falha (lanca) se qualquer aba falhar, para que o chamador caia no fallback.
async function buscarPlanilha(sheetId: string, fetchImpl: typeof fetch): Promise<DashboardData> {
  const abas = config.abas;

  // A aba de Visao Geral contem tanto avisos quanto atalhos. Para manter a
  // planilha simples, lemos a mesma aba e separamos pelas colunas presentes.
  const [
    linhasVisaoGeral,
    linhasCredenciais,
    linhasLinks,
    linhasManuais,
    linhasDemandas,
    linhasCalendario,
    linhasContatos,
  ] = await Promise.all([
    buscarAba(sheetId, abas.visaoGeral, fetchImpl),
    buscarAba(sheetId, abas.credenciais, fetchImpl),
    buscarAba(sheetId, abas.links, fetchImpl),
    buscarAba(sheetId, abas.manuais, fetchImpl),
    buscarAba(sheetId, abas.demandas, fetchImpl),
    buscarAba(sheetId, abas.calendario, fetchImpl),
    buscarAba(sheetId, abas.contatos, fetchImpl),
  ]);

  // Linhas de avisos tem "Mensagem"; linhas de atalhos tem "URL"/"Icone".
  const linhasAvisos = linhasVisaoGeral.filter((l) => campo(l, 'Mensagem') !== '');
  const linhasAtalhos = linhasVisaoGeral.filter(
    (l) => campo(l, 'URL', 'Url', 'Link') !== '' || campo(l, 'Icone', 'Ícone') !== '',
  );

  return {
    avisos: mapearAvisos(linhasAvisos),
    atalhos: mapearAtalhos(linhasAtalhos),
    credenciais: mapearCredenciais(linhasCredenciais),
    links: mapearLinks(linhasLinks),
    manuais: mapearManuais(linhasManuais),
    demandas: mapearDemandas(linhasDemandas),
    eventos: mapearEventos(linhasCalendario),
    contatos: mapearContatos(linhasContatos),
  };
}

// Carrega os dados do painel.
// - Sem planilha configurada: devolve os dados de exemplo (sem rede).
// - Com planilha configurada: busca as abas e, em qualquer erro, cai para os
//   dados de exemplo registrando um aviso. Nunca lanca para a interface.
export async function loadDashboardData(fetchImpl: typeof fetch = fetch): Promise<LoadResult> {
  if (!isSheetConfigured) {
    return { data: sampleData, isSampleMode: true };
  }

  try {
    const data = await buscarPlanilha(config.sheetId, fetchImpl);
    return { data, isSampleMode: false };
  } catch (error) {
    console.warn(
      'Nao foi possivel carregar os dados da planilha do Google Sheets. ' +
        'Usando os dados de exemplo empacotados.',
      error,
    );
    return { data: sampleData, isSampleMode: true, error };
  }
}

// Exporta utilidades usadas tambem nos testes.
export const _internos = {
  tabelaParaLinhas,
  extrairJsonGviz,
  mapearCredenciais,
  mapearDemandas,
};

// As colunas por secao usadas no mapeamento e documentadas no README.
export type { SectionKey };
