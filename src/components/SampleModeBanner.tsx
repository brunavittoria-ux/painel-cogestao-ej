import { useState } from 'react';

interface SampleModeBannerProps {
  // Quando verdadeiro, o painel esta usando os dados de exemplo empacotados.
  // Na FEAT-003 este valor passara a refletir tambem falhas de busca na planilha.
  isSampleMode: boolean;
}

// Banner dispensavel exibido quando o painel esta usando dados de exemplo.
// Explica, em portugues, como conectar uma planilha real (via README).
function SampleModeBanner({ isSampleMode }: SampleModeBannerProps) {
  const [visivel, setVisivel] = useState(true);

  if (!isSampleMode || !visivel) {
    return null;
  }

  return (
    <div className="banner-exemplo" role="status">
      <span aria-hidden="true">💡</span>
      <span className="banner-texto">
        Voce esta vendo <strong>dados de exemplo</strong>. Nenhuma planilha foi conectada ainda. Para usar os
        dados reais da sua Empresa Junior, conecte uma planilha do Google Sheets seguindo as instrucoes do
        arquivo README do projeto.
      </span>
      <button type="button" onClick={() => setVisivel(false)} aria-label="Dispensar aviso">
        ×
      </button>
    </div>
  );
}

export default SampleModeBanner;
