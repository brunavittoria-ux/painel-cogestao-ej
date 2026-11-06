import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  extrairJsonGviz,
  loadDashboardData,
  montarUrlGviz,
  tabelaParaLinhas,
} from '../sheets';
import { sampleData } from '../sampleData';
import { isSheetConfigured } from '../../config';

// Monta uma resposta JSONP no mesmo formato que o endpoint gviz devolve,
// embrulhando a tabela no envelope google.visualization.Query.setResponse(...).
function envelopeGviz(table: unknown): string {
  const corpo = JSON.stringify({ version: '0.6', status: 'ok', table });
  return `/*O_o*/\ngoogle.visualization.Query.setResponse(${corpo});`;
}

// Tabela gviz de credenciais com duas linhas de dados.
const tabelaCredenciais = {
  cols: [
    { id: 'A', label: 'Servico', type: 'string' },
    { id: 'B', label: 'Login/Email', type: 'string' },
    { id: 'C', label: 'Senha', type: 'string' },
    { id: 'D', label: 'Link', type: 'string' },
    { id: 'E', label: 'Observacao', type: 'string' },
  ],
  rows: [
    {
      c: [
        { v: 'Email da Presidencia' },
        { v: 'presidencia@ej.teste' },
        { v: 'segredo-123' },
        { v: 'https://mail.google.com' },
        { v: 'Trocar a cada gestao' },
      ],
    },
    {
      c: [
        { v: 'Instagram' },
        { v: '@ejteste' },
        { v: 'insta-456' },
        { v: 'https://instagram.com/ejteste' },
        { v: '' },
      ],
    },
  ],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('montarUrlGviz', () => {
  it('monta a URL do endpoint gviz com o id e o nome da aba', () => {
    const url = montarUrlGviz('ABC123', 'Credenciais');
    expect(url).toContain('/spreadsheets/d/ABC123/gviz/tq');
    expect(url).toContain('tqx=out%3Ajson');
    expect(url).toContain('sheet=Credenciais');
  });
});

describe('extrairJsonGviz', () => {
  it('remove o envelope JSONP e devolve o objeto JSON', () => {
    const texto = envelopeGviz(tabelaCredenciais);
    const json = extrairJsonGviz(texto);
    expect(json.status).toBe('ok');
    expect(json.table?.cols).toHaveLength(5);
  });

  it('lanca quando o corpo JSON nao e reconhecivel', () => {
    expect(() => extrairJsonGviz('resposta invalida sem json')).toThrow();
  });
});

describe('tabelaParaLinhas', () => {
  it('indexa cada linha pelos rotulos das colunas e ignora linhas vazias', () => {
    const linhas = tabelaParaLinhas({
      ...tabelaCredenciais,
      rows: [
        ...tabelaCredenciais.rows,
        { c: [{ v: '' }, { v: '' }, { v: '' }, { v: '' }, { v: '' }] },
      ],
    });
    expect(linhas).toHaveLength(2);
    expect(linhas[0].Servico).toBe('Email da Presidencia');
    expect(linhas[0]['Login/Email']).toBe('presidencia@ej.teste');
    expect(linhas[1].Servico).toBe('Instagram');
  });
});

describe('loadDashboardData', () => {
  it('devolve os dados de exemplo com isSampleMode=true quando nenhuma planilha esta configurada', async () => {
    // Pre-condicao: no ambiente de teste o VITE_SHEET_ID nao esta definido.
    expect(isSheetConfigured).toBe(false);

    const fetchMock = vi.fn();
    const resultado = await loadDashboardData(fetchMock as unknown as typeof fetch);

    expect(resultado.isSampleMode).toBe(true);
    expect(resultado.data).toBe(sampleData);
    // Nao deve fazer nenhuma requisicao de rede quando nao ha planilha.
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
