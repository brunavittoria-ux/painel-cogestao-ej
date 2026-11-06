import { config, isSheetConfigured } from './config';
import { sampleData } from './data/sampleData';

// Placeholder da aplicacao para esta etapa (a interface completa vem na FEAT-002).
// Aqui apenas confirmamos que a base de dados e a configuracao compilam e carregam.
function App() {
  const totalSecoes = {
    avisos: sampleData.avisos.length,
    atalhos: sampleData.atalhos.length,
    credenciais: sampleData.credenciais.length,
    links: sampleData.links.length,
    manuais: sampleData.manuais.length,
    demandas: sampleData.demandas.length,
    eventos: sampleData.eventos.length,
    contatos: sampleData.contatos.length,
  };

  return (
    <main>
      <h1>Painel de Cogestao - Presidencia EJ</h1>
      <p>
        Fonte de dados:{' '}
        {isSheetConfigured ? 'Google Sheets configurado' : 'dados de exemplo (planilha nao configurada)'}.
      </p>
      <p>Aba de credenciais configurada: {config.abas.credenciais}</p>
      <ul>
        <li>Avisos: {totalSecoes.avisos}</li>
        <li>Atalhos: {totalSecoes.atalhos}</li>
        <li>Credenciais: {totalSecoes.credenciais}</li>
        <li>Links uteis: {totalSecoes.links}</li>
        <li>Manuais: {totalSecoes.manuais}</li>
        <li>Demandas: {totalSecoes.demandas}</li>
        <li>Eventos: {totalSecoes.eventos}</li>
        <li>Contatos: {totalSecoes.contatos}</li>
      </ul>
    </main>
  );
}

export default App;
