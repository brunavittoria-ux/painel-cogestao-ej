import { useState, type FormEvent, type ReactNode } from 'react';
import { config } from '../config';

// Chave usada no sessionStorage para lembrar que o painel foi desbloqueado
// durante a sessao atual do navegador.
export const CHAVE_DESBLOQUEIO = 'painel-cogestao-desbloqueado';

// Remove o desbloqueio da sessao atual (usado pela acao "Sair" no shell).
export function sair(): void {
  sessionStorage.removeItem(CHAVE_DESBLOQUEIO);
}

// Indica se o painel ja foi desbloqueado nesta sessao.
function estaDesbloqueado(): boolean {
  return sessionStorage.getItem(CHAVE_DESBLOQUEIO) === 'true';
}

interface LoginProps {
  children: ReactNode;
}

// Portao de acesso simples por frase-senha, do lado do cliente.
// Compara o que o usuario digita com config.passphrase. Em caso de acerto,
// marca um sinalizador no sessionStorage e renderiza o conteudo protegido.
function Login({ children }: LoginProps) {
  const [liberado, setLiberado] = useState<boolean>(estaDesbloqueado);
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState(false);

  if (liberado) {
    return <>{children}</>;
  }

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    if (valor === config.passphrase) {
      sessionStorage.setItem(CHAVE_DESBLOQUEIO, 'true');
      setErro(false);
      setLiberado(true);
    } else {
      setErro(true);
    }
  }

  return (
    <div className="login-tela">
      <div className="login-cartao">
        <h1>Painel de Cogestao</h1>
        <p className="login-subtitulo">Presidencia da Empresa Junior</p>

        <form className="login-form" onSubmit={aoEnviar}>
          <label htmlFor="frase-senha">Frase-senha de acesso</label>
          <input
            id="frase-senha"
            type="password"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Digite a frase-senha"
            autoFocus
          />
          {erro && <p className="login-erro">Frase-senha incorreta. Tente novamente.</p>}
          <button type="submit">Entrar</button>
        </form>

        <p className="login-nota">
          Atencao: esta e uma protecao leve, apenas para evitar acesso casual. Ela roda inteiramente no
          navegador e nao e um armazenamento seguro de segredos. Nao coloque aqui informacoes que nao possam
          ser vistas por quem tiver a frase-senha.
        </p>
      </div>
    </div>
  );
}

export default Login;
