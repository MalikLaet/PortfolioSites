import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactSection } from './ContactSection';

describe('ContactSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('não toma o foco nem desloca a página na carga inicial', () => {
    render(<ContactSection />);

    expect(document.activeElement).not.toBe(screen.getByRole('textbox', { name: 'Como podemos te chamar?' }));
  });

  it('valida nome e mensagem sem usar alert, e deixa negócio opcional', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Me conta seu nome antes de continuar.');

    await user.type(screen.getByRole('textbox', { name: 'Como podemos te chamar?' }), 'Ana');
    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    expect(screen.getByRole('textbox', { name: 'O que você vende ou faz?' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Pular' }));
    await user.click(screen.getByRole('button', { name: /Enviar pelo WhatsApp/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Escreve rapidinho o que você precisa.');
  });

  it('atualiza a prévia ao vivo conforme o visitante preenche', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    await user.type(screen.getByRole('textbox', { name: 'Como podemos te chamar?' }), 'Ana');
    expect(screen.getByText('Nome: Ana')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    await user.type(screen.getByRole('textbox', { name: 'O que você vende ou faz?' }), 'Barbearia');
    expect(screen.getByText('Negócio: Barbearia')).toBeInTheDocument();
  });

  it('aceita Enter para avançar e Shift+Enter para quebrar linha', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    const name = screen.getByRole('textbox', { name: 'Como podemos te chamar?' });
    await user.type(name, 'Ana{Enter}');
    await user.click(screen.getByRole('button', { name: 'Pular' }));
    const message = screen.getByRole('textbox', { name: 'Me conta rapidinho' });
    fireEvent.keyDown(message, { key: 'Enter', shiftKey: true });
    expect(screen.queryByText('Mensagem pronta')).not.toBeInTheDocument();
  });

  it('mantém o campo final visível e atualiza a prévia enquanto digita', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    await user.type(screen.getByRole('textbox', { name: 'Como podemos te chamar?' }), 'Malik');
    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    await user.click(screen.getByRole('button', { name: 'Pular' }));
    const message = screen.getByRole('textbox', { name: 'Me conta rapidinho' });
    expect(message).toHaveAttribute('tabindex', '0');
    await user.type(message, 'Quero um site novo');
    expect(screen.getByText('Mensagem: Quero um site novo')).toBeInTheDocument();
  });

  it('abre o WhatsApp com os dados e permite preencher novamente', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const user = userEvent.setup();
    render(<ContactSection />);
    await user.type(screen.getByRole('textbox', { name: 'Como podemos te chamar?' }), 'Ana');
    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    await user.click(screen.getByRole('button', { name: 'Pular' }));
    await user.type(screen.getByRole('textbox', { name: 'Me conta rapidinho' }), 'Preciso de um site.');
    await user.click(screen.getByRole('button', { name: /Enviar pelo WhatsApp/ }));

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/5511999038780?text='),
      '_blank',
      'noopener,noreferrer',
    );
    expect(screen.getByText('Mensagem pronta')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Preencher de novo' }));
    expect(screen.getByRole('textbox', { name: 'Como podemos te chamar?' })).toHaveValue('');
  });
});
