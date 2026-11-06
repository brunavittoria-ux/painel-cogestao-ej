import { useState } from 'react';
import type { DashboardData, SectionKey } from './types';
import { isSheetConfigured } from './config';
import { sampleData } from './data/sampleData';

import Login, { sair } from './components/Login';
import Layout from './components/Layout';
import SampleModeBanner from './components/SampleModeBanner';

import VisaoGeral from './sections/VisaoGeral';
import Credenciais from './sections/Credenciais';
import LinksUteis from './sections/LinksUteis';
import ManuaisSLAs from './sections/ManuaisSLAs';
import Demandas from './sections/Demandas';
import Calendario from './sections/Calendario';
import Contatos from './sections/Contatos';

// Fonte de dados do painel para esta etapa.
// A FEAT-003 substituira este helper por um carregador assincrono que busca
// os dados da planilha do Google Sheets e cai para os dados de exemplo em caso
// de erro ou configuracao ausente.
function getData(): DashboardData {
  return sampleData;
}

// Indica se estamos usando os dados de exemplo empacotados.
// Enquanto nenhuma planilha estiver configurada, estamos em modo de exemplo.
// A FEAT-003 passara a considerar tambem falhas de busca na planilha.
function isSampleMode(): boolean {
  return !isSheetConfigured;
}

// Renderiza a secao correspondente a chave selecionada.
function renderizarSecao(secao: SectionKey, dados: DashboardData) {
  switch (secao) {
    case 'visaoGeral':
      return <VisaoGeral dados={dados} />;
    case 'credenciais':
      return <Credenciais dados={dados} />;
    case 'links':
      return <LinksUteis dados={dados} />;
    case 'manuais':
      return <ManuaisSLAs dados={dados} />;
    case 'demandas':
      return <Demandas dados={dados} />;
    case 'calendario':
      return <Calendario dados={dados} />;
    case 'contatos':
      return <Contatos dados={dados} />;
    default:
      return null;
  }
}

function App() {
  const [secaoAtiva, setSecaoAtiva] = useState<SectionKey>('visaoGeral');
  // Usado apenas para forcar a remontagem do portao de login ao sair.
  const [chaveSessao, setChaveSessao] = useState(0);

  const dados = getData();

  // Limpa o desbloqueio da sessao e volta para a tela de login.
  // Ao mudar a chave, o componente Login e remontado e, como o sessionStorage
  // ja foi limpo, ele volta a exibir a tela de frase-senha.
  function aoSair() {
    sair();
    setChaveSessao((v) => v + 1);
  }

  return (
    <Login key={chaveSessao}>
      <Layout secaoAtiva={secaoAtiva} aoSelecionar={setSecaoAtiva} aoSair={aoSair}>
        <SampleModeBanner isSampleMode={isSampleMode()} />
        {renderizarSecao(secaoAtiva, dados)}
      </Layout>
    </Login>
  );
}

export default App;
