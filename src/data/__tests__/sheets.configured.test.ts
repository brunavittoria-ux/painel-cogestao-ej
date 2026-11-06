import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SectionKey } from '../../types';

// Este arquivo testa o caminho "planilha configurada": com isSheetConfigured=true,
// loadDashboardData busca as abas (via fetch mockado) e mapeia as linhas. Tambem
// prova a queda para os dados de exemplo quando o fetch falha ou devolve lixo.
//
// A configuracao e lida das variaveis de ambiente no carregamento do modulo,
// entao mockamos ../../config para simular uma planilha ja conectada.
vi.mock('../../config', () => {
  const abas: Record<SectionKey, string> = {
    visaoGeral: 'Visao Geral',
    credenciais: 'Credenciais',
    links: 'Links',
    manuais: 'Manuais',
    demandas: 'Demandas',
    calendario: 'Calendario',
    contatos: 'Contatos',
  };
  return {
    isSheetConfigured: true,
    config: { passphrase: 'teste', sheetId: 'PLANILHA_TESTE', abas },
  };
});

// Importado apos o mock para que o modulo enxergue a config simulada.
const { loadDashboardData } = await import('../sheets');
const { sampleData } = await import('../sampleData');

// Monta uma resposta JSONP no formato do endpoint gviz.
function envelopeGviz(cols: Array<{ label: string }>, linhas: string[][]): string {
  const table = {
    cols: cols.map((c, i) => ({ id: String(i), label: c.label, type: 'string' })),
    rows: linhas.map((linha) => ({ c: linha.map((v) => ({ v })) })),
  };
  const corpo = JSON.stringify({ version: '0.6', status: 'ok', table });
  return `/*O_o*/\ngoogle.visualization.Query.setResponse(${corpo});`;
}

// Resposta HTTP de sucesso com um corpo de texto.
function respostaOk(texto: string): Response {
  return { ok: true, status: 200, text: async () => texto } as unknown as Response;
}

// Dados gviz por aba, usados pelo fetch mockado abaixo.
const porAba: Record<string, string> = {
  'Visao Geral': envelopeGviz(
    [{ label: 'Titulo' }, { label: 'Mensagem' }, { label: 'Nivel' }, { label: 'Data' }, { label: 'URL' }, { label: 'Icone' }],
    [
      ['Aviso de teste', 'Mensagem do aviso', 'critico', '2024-06-20', '', ''],
      ['Drive da Presidencia', '', '', '', 'https://drive.exemplo', '📁'],
    ],
  ),
  Credenciais: envelopeGviz(
    [{ label: 'Servico' }, { label: 'Login/Email' }, { label: 'Senha' }, { label: 'Link' }, { label: 'Observacao' }],
    [['ERP', 'admin@ej.teste', 'senha-erp', 'https://erp.exemplo', 'Acesso restrito']],
  ),
  Links: envelopeGviz(
    [{ label: 'Categoria' }, { label: 'Titulo' }, { label: 'URL' }, { label: 'Descricao' }],
    [['Gestao', 'Planilha', 'https://sheets.exemplo', 'Planilha central']],
  ),
  Manuais: envelopeGviz(
    [{ label: 'Titulo' }, { label: 'Descricao' }, { label: 'SLA de Resposta' }, { label: 'Documento URL' }],
    [['Manual de Projeto', 'Como abrir projeto', 'Ate 3 dias uteis', 'https://doc.exemplo']],
  ),
  Demandas: envelopeGviz(
    [{ label: 'Tarefa' }, { label: 'Responsavel' }, { label: 'Status' }, { label: 'Prazo' }, { label: 'Prioridade' }],
    [['Enviar relatorio', 'Presidencia', 'Em Andamento', '2024-06-30', 'Alta']],
  ),
  Calendario: envelopeGviz(
    [{ label: 'Titulo' }, { label: 'Data' }, { label: 'Tipo' }, { label: 'Descricao' }],
    [['Reuniao da diretoria', '2024-06-24', 'Reuniao', 'Alinhamento semanal']],
  ),
  Contatos: envelopeGviz(
    [{ label: 'Nome' }, { label: 'Cargo' }, { label: 'Grupo' }, { label: 'Email' }, { label: 'Telefone' }],
    [['Ana Souza', 'Presidente', 'Diretoria', 'presidencia@ej.teste', '(11) 90000-0001']],
  ),
};

// Fetch mockado que devolve a resposta gviz correta de acordo com o parametro
// sheet=<aba> presente na URL.
function fetchPorAba(url: string): Promise<Response> {
  const sheet = new URL(url).searchParams.get('sheet') ?? '';
  const corpo = porAba[sheet];
  if (corpo === undefined) {
    return Promise.reject(new Error(`Aba inesperada: ${sheet}`));
  }
  return Promise.resolve(respostaOk(corpo));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadDashboardData com planilha configurada', () => {
  it('busca as sete abas e mapeia as linhas para objetos tipados', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => fetchPorAba(String(input)));

    const resultado = await loadDashboardData(fetchMock as unknown as typeof fetch);

    expect(resultado.isSampleMode).toBe(false);
    expect(resultado.error).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(7);

    const dados = resultado.data;
    // Avisos e atalhos saem da mesma aba (Visao Geral), separados por coluna.
    expect(dados.avisos).toHaveLength(1);
    expect(dados.avisos[0]).toMatchObject({ titulo: 'Aviso de teste', nivel: 'critico' });
    expect(dados.atalhos).toHaveLength(1);
    expect(dados.atalhos[0]).toMatchObject({ titulo: 'Drive da Presidencia', icone: '📁' });

    expect(dados.credenciais[0]).toMatchObject({
      servico: 'ERP',
      loginEmail: 'admin@ej.teste',
      senha: 'senha-erp',
    });
    expect(dados.links[0]).toMatchObject({ categoria: 'Gestao', titulo: 'Planilha' });
    expect(dados.manuais[0]).toMatchObject({ titulo: 'Manual de Projeto', slaResposta: 'Ate 3 dias uteis' });
    expect(dados.demandas[0]).toMatchObject({ tarefa: 'Enviar relatorio', status: 'Em Andamento', prioridade: 'Alta' });
    expect(dados.eventos[0]).toMatchObject({ titulo: 'Reuniao da diretoria', tipo: 'Reuniao' });
    expect(dados.contatos[0]).toMatchObject({ nome: 'Ana Souza', grupo: 'Diretoria' });
  });

  it('cai para os dados de exemplo (isSampleMode=true) quando o fetch rejeita', async () => {
    const avisar = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = vi.fn(() => Promise.reject(new Error('rede indisponivel')));

    const resultado = await loadDashboardData(fetchMock as unknown as typeof fetch);

    expect(resultado.isSampleMode).toBe(true);
    expect(resultado.data).toBe(sampleData);
    expect(resultado.error).toBeInstanceOf(Error);
    expect(avisar).toHaveBeenCalled();
  });

  it('cai para os dados de exemplo quando a resposta e malformada', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = vi.fn(() => Promise.resolve(respostaOk('isto nao e um envelope gviz valido')));

    const resultado = await loadDashboardData(fetchMock as unknown as typeof fetch);

    expect(resultado.isSampleMode).toBe(true);
    expect(resultado.data).toBe(sampleData);
  });
});
