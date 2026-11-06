import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Credenciais from '../Credenciais';
import type { DashboardData } from '../../types';

// Dados minimos com uma unica credencial para isolar o comportamento de mascara.
const dados = {
  avisos: [],
  atalhos: [],
  credenciais: [
    {
      servico: 'ERP',
      loginEmail: 'admin@ej.teste',
      senha: 'senha-super-secreta',
      link: 'https://erp.exemplo',
      observacao: 'Acesso restrito',
    },
  ],
  links: [],
  manuais: [],
  demandas: [],
  eventos: [],
  contatos: [],
} satisfies DashboardData;

beforeEach(() => {
  // CopyButton usa a area de transferencia; mockamos para evitar erros no jsdom.
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(() => Promise.resolve()) },
  });
  Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Credenciais', () => {
  it('mascara a senha por padrao e revela ao alternar o botao', async () => {
    const usuario = userEvent.setup();
    render(<Credenciais dados={dados} />);

    // Por padrao a senha aparece mascarada e o valor real nao e exibido.
    expect(screen.queryByText('senha-super-secreta')).not.toBeInTheDocument();
    expect(screen.getByText('••••••••')).toBeInTheDocument();

    // Revela a senha.
    await usuario.click(screen.getByRole('button', { name: 'Revelar senha' }));
    expect(screen.getByText('senha-super-secreta')).toBeInTheDocument();

    // Oculta novamente.
    await usuario.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(screen.queryByText('senha-super-secreta')).not.toBeInTheDocument();
    expect(screen.getByText('••••••••')).toBeInTheDocument();
  });
});
