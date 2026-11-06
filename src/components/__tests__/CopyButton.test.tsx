import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CopyButton from '../CopyButton';

// Mock da area de transferencia e do contexto seguro para exercitar o caminho
// navigator.clipboard.writeText do CopyButton.
const writeText = vi.fn(() => Promise.resolve());

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
  Object.defineProperty(window, 'isSecureContext', {
    configurable: true,
    value: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CopyButton', () => {
  it('escreve o texto na area de transferencia e mostra "Copiado!"', async () => {
    render(<CopyButton texto="segredo-123" rotulo="Copiar senha" />);

    const botao = screen.getByRole('button', { name: 'Copiar senha' });
    fireEvent.click(botao);

    expect(writeText).toHaveBeenCalledWith('segredo-123');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copiado!' })).toBeInTheDocument();
    });
  });
});
