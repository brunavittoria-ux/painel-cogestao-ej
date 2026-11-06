import { useState } from 'react';

interface CopyButtonProps {
  // Texto que sera copiado para a area de transferencia.
  texto: string;
  // Rotulo opcional do botao (padrao: "Copiar").
  rotulo?: string;
}

// Copia um texto usando navigator.clipboard, com uma alternativa (fallback)
// baseada em document.execCommand para navegadores ou contextos sem a API moderna.
async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Se falhar, cai para a alternativa abaixo.
  }

  try {
    const area = document.createElement('textarea');
    area.value = texto;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

// Botao que copia um texto e mostra a confirmacao "Copiado!" por alguns segundos.
function CopyButton({ texto, rotulo = 'Copiar' }: CopyButtonProps) {
  const [copiado, setCopiado] = useState(false);

  async function aoClicar() {
    const ok = await copiarTexto(texto);
    if (ok) {
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    }
  }

  return (
    <button
      type="button"
      className={copiado ? 'btn-copiar copiado' : 'btn-copiar'}
      onClick={aoClicar}
      title="Copiar para a area de transferencia"
    >
      {copiado ? 'Copiado!' : rotulo}
    </button>
  );
}

export default CopyButton;
