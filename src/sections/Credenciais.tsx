import { useState } from 'react';
import type { Credencial, DashboardData } from '../types';
import CopyButton from '../components/CopyButton';

interface CredenciaisProps {
  dados: DashboardData;
}

// Cartao de uma credencial, com copia para login e senha e senha
// mascarada por padrao, com botao para revelar/ocultar.
function CartaoCredencial({ credencial }: { credencial: Credencial }) {
  const [revelada, setRevelada] = useState(false);

  return (
    <div className="cartao">
      <h3 style={{ fontSize: '1rem' }}>{credencial.servico}</h3>

      <p style={{ margin: '0.5rem 0 0.25rem' }}>
        <strong>Login / Email</strong>
      </p>
      <div className="campo-copia">
        <code>{credencial.loginEmail}</code>
        <CopyButton texto={credencial.loginEmail} rotulo="Copiar login" />
      </div>

      <p style={{ margin: '0.75rem 0 0.25rem' }}>
        <strong>Senha</strong>
      </p>
      <div className="campo-copia">
        <code>{revelada ? credencial.senha : '••••••••'}</code>
        <button
          type="button"
          className="btn-revelar"
          onClick={() => setRevelada((v) => !v)}
          aria-label={revelada ? 'Ocultar senha' : 'Revelar senha'}
          title={revelada ? 'Ocultar senha' : 'Revelar senha'}
        >
          {revelada ? '🙈' : '👁️'}
        </button>
        <CopyButton texto={credencial.senha} rotulo="Copiar senha" />
      </div>

      {credencial.link && (
        <p style={{ margin: '0.75rem 0 0.25rem' }}>
          <a href={credencial.link} target="_blank" rel="noopener noreferrer">
            Abrir servico
          </a>
        </p>
      )}

      {credencial.observacao && (
        <p style={{ margin: '0.5rem 0 0', color: 'var(--cor-texto-suave)', fontSize: '0.88rem' }}>
          {credencial.observacao}
        </p>
      )}
    </div>
  );
}

// Secao de credenciais e acessos.
function Credenciais({ dados }: CredenciaisProps) {
  if (dados.credenciais.length === 0) {
    return <p className="vazio">Nenhuma credencial cadastrada.</p>;
  }

  return (
    <div className="grade">
      {dados.credenciais.map((c, i) => (
        <CartaoCredencial credencial={c} key={`${c.servico}-${i}`} />
      ))}
    </div>
  );
}

export default Credenciais;
