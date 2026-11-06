import type { SectionKey } from './types';

// Configuracao do painel lida a partir das variaveis de ambiente (import.meta.env).
// Todas as variaveis sao opcionais: sem elas, o painel funciona com os dados de exemplo
// e com a frase-senha padrao, sem depender de rede.

// Le uma variavel de ambiente, retornando um valor padrao quando ela nao esta definida.
function lerEnv(chave: string, padrao = ''): string {
  const valor = import.meta.env[chave as keyof ImportMetaEnv] as string | undefined;
  return valor !== undefined && valor !== '' ? valor : padrao;
}

// Nome padrao da aba na planilha para cada secao do painel.
// Pode ser sobrescrito por variaveis VITE_TAB_* no arquivo .env.
const abasPadrao: Record<SectionKey, string> = {
  visaoGeral: 'Visao Geral',
  credenciais: 'Credenciais',
  links: 'Links',
  manuais: 'Manuais',
  demandas: 'Demandas',
  calendario: 'Calendario',
  contatos: 'Contatos',
};

// Mapeia cada secao para o nome da aba configurada (ou o padrao).
const abas: Record<SectionKey, string> = {
  visaoGeral: lerEnv('VITE_TAB_VISAO_GERAL', abasPadrao.visaoGeral),
  credenciais: lerEnv('VITE_TAB_CREDENCIAIS', abasPadrao.credenciais),
  links: lerEnv('VITE_TAB_LINKS', abasPadrao.links),
  manuais: lerEnv('VITE_TAB_MANUAIS', abasPadrao.manuais),
  demandas: lerEnv('VITE_TAB_DEMANDAS', abasPadrao.demandas),
  calendario: lerEnv('VITE_TAB_CALENDARIO', abasPadrao.calendario),
  contatos: lerEnv('VITE_TAB_CONTATOS', abasPadrao.contatos),
};

export interface AppConfig {
  // Frase-senha que protege o acesso ao painel (shared secret simples do lado do cliente).
  passphrase: string;
  // ID da planilha do Google Sheets usada como fonte de dados (opcional).
  sheetId: string;
  // Nome da aba correspondente a cada secao do painel.
  abas: Record<SectionKey, string>;
}

export const config: AppConfig = {
  passphrase: lerEnv('VITE_APP_PASSPHRASE', 'presidencia2024'),
  sheetId: lerEnv('VITE_SHEET_ID', ''),
  abas,
};

// Indica se uma planilha do Google Sheets foi configurada.
// Quando falso, o painel usa os dados de exemplo empacotados.
export const isSheetConfigured: boolean = config.sheetId.trim() !== '';
