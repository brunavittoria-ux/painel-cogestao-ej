/// <reference types="vite/client" />

// Tipagem das variaveis de ambiente usadas pelo painel.
interface ImportMetaEnv {
  readonly VITE_APP_PASSPHRASE?: string;
  readonly VITE_SHEET_ID?: string;
  readonly VITE_TAB_VISAO_GERAL?: string;
  readonly VITE_TAB_CREDENCIAIS?: string;
  readonly VITE_TAB_LINKS?: string;
  readonly VITE_TAB_MANUAIS?: string;
  readonly VITE_TAB_DEMANDAS?: string;
  readonly VITE_TAB_CALENDARIO?: string;
  readonly VITE_TAB_CONTATOS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
