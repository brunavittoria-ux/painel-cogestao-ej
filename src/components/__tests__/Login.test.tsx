import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import { config } from '../../config';

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
});

describe('Login (portao de acesso)', () => {
  it('bloqueia o conteudo protegido ate a frase-senha correta ser informada', async () => {
    const usuario = userEvent.setup();
    render(
      <Login>
        <div>Conteudo protegido do painel</div>
      </Login>,
    );

    // Antes de autenticar, o conteudo protegido nao aparece.
    expect(screen.queryByText('Conteudo protegido do painel')).not.toBeInTheDocument();
    expect(screen.getByText('Painel de Cogestao')).toBeInTheDocument();

    // Uma frase-senha incorreta mantem o bloqueio e mostra o erro.
    await usuario.type(screen.getByLabelText('Frase-senha de acesso'), 'errada');
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByText('Frase-senha incorreta. Tente novamente.')).toBeInTheDocument();
    expect(screen.queryByText('Conteudo protegido do painel')).not.toBeInTheDocument();

    // A frase-senha correta libera o conteudo.
    const campo = screen.getByLabelText('Frase-senha de acesso');
    await usuario.clear(campo);
    await usuario.type(campo, config.passphrase);
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getByText('Conteudo protegido do painel')).toBeInTheDocument();
  });

  it('libera direto quando a sessao ja foi desbloqueada', () => {
    sessionStorage.setItem('painel-cogestao-desbloqueado', 'true');
    render(
      <Login>
        <div>Conteudo protegido do painel</div>
      </Login>,
    );
    expect(screen.getByText('Conteudo protegido do painel')).toBeInTheDocument();
  });
});
