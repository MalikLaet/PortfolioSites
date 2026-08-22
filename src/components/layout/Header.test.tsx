import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getIntersectionObservers, setViewportWidth } from '../../../vitest.setup';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
}

/** Página de 5000px numa janela de 1000px: 4000px roláveis. */
beforeEach(() => {
  setScrollY(0);
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 5000, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
});

/**
 * O handler de scroll é throttled por requestAnimationFrame, então o efeito só
 * aparece no frame seguinte — esperar por ele é parte do comportamento.
 */
async function scrollTo(y: number) {
  setScrollY(y);
  await act(async () => {
    window.dispatchEvent(new Event('scroll'));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
}

describe('Header', () => {
  it('mostra a marca, os quatro links e o CTA', () => {
    render(<Header onOpenMenu={() => {}} />);
    expect(screen.getByText('ZÊNITE')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ZÊNITE — início' })).toHaveAttribute('href', '#topo');

    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });
    for (const label of ['Trabalho', 'Processo', 'Sobre', 'Contato']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'Começar um projeto' })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5511925780617'),
    );
  });

  it('condensa a cápsula ao passar de 40px de scroll, e volta ao subir', async () => {
    const { container } = render(<Header onOpenMenu={() => {}} />);
    const header = container.querySelector('header')!;
    const isCondensed = () => [...header.classList].some((c) => c.includes('condensed'));
    expect(isCondensed()).toBe(false);

    await scrollTo(41);
    expect(isCondensed()).toBe(true);

    await scrollTo(10);
    expect(isCondensed()).toBe(false);
  });

  it('avança a barra de progresso conforme a leitura', async () => {
    const { container } = render(<Header onOpenMenu={() => {}} />);
    const fill = container.querySelector('[class*="progressFill"]') as HTMLElement;
    expect(fill.style.width).toBe('0%');

    // 2000 de 4000 roláveis = metade
    await scrollTo(2000);
    expect(fill.style.width).toBe('50%');

    // nunca passa de 100%, mesmo com scrollY além do fim
    await scrollTo(99_999);
    expect(fill.style.width).toBe('100%');
  });

  it('marca o link da seção atual e posiciona a pílula atrás dele', () => {
    const section = document.createElement('section');
    section.id = 'trabalho';
    document.body.append(section);

    render(<Header onOpenMenu={() => {}} />);
    const link = screen.getByRole('link', { name: 'Trabalho' });
    expect(link).not.toHaveAttribute('aria-current');

    const spy = getIntersectionObservers().find((o) => o.elements.has(section));
    act(() => {
      spy!.trigger([{ target: section, isIntersecting: true }]);
    });

    expect(link).toHaveAttribute('aria-current', 'true');
    section.remove();
  });

  it('esconde o relógio abaixo de 1180px e mostra acima', () => {
    setViewportWidth(1000);
    const { rerender } = render(<Header onOpenMenu={() => {}} />);
    expect(screen.queryByText(/São Paulo/)).not.toBeInTheDocument();

    act(() => setViewportWidth(1400));
    rerender(<Header onOpenMenu={() => {}} />);
    expect(screen.getByText(/São Paulo · \d{2}:\d{2}/)).toBeInTheDocument();
  });

  // O responsivo é feito em CSS (media queries) e o jsdom não as avalia: aqui o
  // botão fica com o `display:none` da regra base, que é o estado de desktop.
  // Elemento nesse estado tem nome acessível vazio por spec, então `getByRole`
  // com `name` nunca casaria — a consulta pelo aria-label testa a mesma coisa.
  it('o botão de menu chama onOpenMenu', async () => {
    const onOpenMenu = vi.fn();
    render(<Header onOpenMenu={onOpenMenu} />);
    await userEvent.click(screen.getByLabelText('Abrir menu'));
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });

  it('esconde nav e CTA no mobile, e o botão de menu no desktop', () => {
    const { container } = render(<Header onOpenMenu={() => {}} />);
    const styleText = [...document.querySelectorAll('style')].map((s) => s.textContent).join('');

    const menuClass = [...(container.querySelector('button[aria-label="Abrir menu"]')?.classList ?? [])][0];
    const navClass = [...(container.querySelector('nav')?.classList ?? [])][0];
    expect(styleText).toContain(`.${menuClass}`);
    expect(styleText).toContain(`.${navClass}`);
    // a única regra que reexibe o botão é a media query de 900px
    expect(styleText).toMatch(/@media \(max-width: 899\.98px\)/);
  });
});

describe('MobileMenu', () => {
  it('não renderiza nada fechado', () => {
    const { container } = render(<MobileMenu open={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('lista os quatro links numerados, o WhatsApp e o e-mail', () => {
    render(<MobileMenu open onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Menu' });

    expect(within(dialog).getByText('01')).toBeInTheDocument();
    expect(within(dialog).getByText('04')).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Falar no WhatsApp/ })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'zenite.enterprise@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:zenite.enterprise@gmail.com',
    );
  });

  it('fecha ao clicar num link de seção', async () => {
    const onClose = vi.fn();
    render(<MobileMenu open onClose={onClose} />);
    await userEvent.click(screen.getByRole('link', { name: /Trabalho/ }));
    expect(onClose).toHaveBeenCalled();
  });

  it('fecha com Escape', async () => {
    const onClose = vi.fn();
    render(<MobileMenu open onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('trava a rolagem do fundo enquanto está aberto', () => {
    const { unmount } = render(<MobileMenu open onClose={() => {}} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('prende o foco dentro do overlay', async () => {
    render(<MobileMenu open onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    const focusables = [...dialog.querySelectorAll<HTMLElement>('a[href], button')];

    // abre com o foco no botão fechar
    expect(document.activeElement).toBe(focusables[0]);

    // Shift+Tab no primeiro volta para o último, sem escapar para a página
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(focusables[focusables.length - 1]);
  });
});
