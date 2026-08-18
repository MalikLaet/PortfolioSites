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

  it('valida cada etapa sem usar alert', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Me conta seu nome antes de continuar.');

    await user.type(screen.getByRole('textbox', { name: 'Como podemos te chamar?' }), 'Ana');
    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    expect(screen.getByRole('textbox', { name: 'Qual seu número?' })).toHaveFocus();

    await user.type(screen.getByRole('textbox', { name: 'Qual seu número?' }), '11999');
    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Falta um número válido de WhatsApp.');
  });

  it('aplica a máscara e atualiza a prévia ao vivo', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    await user.type(screen.getByRole('textbox', { name: 'Como podemos te chamar?' }), 'Ana');
    expect(screen.getByText('Nome: Ana')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continuar/ }));
    await user.type(screen.getByRole('textbox', { name: 'Qual seu número?' }), '11999038780');
    expect(screen.getByRole('textbox', { name: 'Qual seu número?' })).toHaveValue('(11) 99903-8780');
  });

  it('aceita Enter para avançar e Shift+Enter para quebrar linha', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    const name = screen.getByRole('textbox', { name: 'Como podemos te chamar?' });
    await user.type(name, 'Ana{Enter}');
    await user.type(screen.getByRole('textbox', { name: 'Qual seu número?' }), '11999038780{Enter}');
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
    await user.type(screen.getByRole('textbox', { name: /Qual seu/ }), '11999038780');
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
    await user.type(screen.getByRole('textbox', { name: 'Qual seu número?' }), '11999038780');
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
