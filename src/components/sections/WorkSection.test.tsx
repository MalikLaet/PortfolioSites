import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getIntersectionObservers } from '../../../vitest.setup';
import { WorkSection } from './WorkSection';

describe('WorkSection', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true });
  });

  afterEach(() => vi.useRealTimers());

  it('troca projeto pelas abas e atualiza o link real do fallback', () => {
    render(<WorkSection />);

    fireEvent.click(screen.getByRole('tab', { name: /02 OutletEletro/i }));

    expect(screen.getByRole('tab', { name: /OutletEletro/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', { name: 'Abrir o site OutletEletro' })).toHaveAttribute(
      'href',
      'https://outleteletro.com/',
    );
    expect(screen.getByRole('tabpanel', { name: /OutletEletro/i })).toHaveAttribute('aria-hidden', 'false');
  });

  it('avança automaticamente somente depois de entrar em tela', () => {
    vi.useFakeTimers();
    const { container } = render(<WorkSection />);
    const section = container.querySelector('#trabalho')!;
    const observer = getIntersectionObservers().find((entry) => entry.elements.has(section));

    act(() => observer!.trigger([{ target: section, isIntersecting: true }]));
    act(() => void vi.advanceTimersByTime(6500));

    expect(screen.getByRole('tab', { name: /OutletEletro/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('para o autoplay definitivamente após interação manual', () => {
    vi.useFakeTimers();
    const { container } = render(<WorkSection />);
    const section = container.querySelector('#trabalho')!;
    const observer = getIntersectionObservers().find((entry) => entry.elements.has(section));
    act(() => observer!.trigger([{ target: section, isIntersecting: true }]));

    fireEvent.click(screen.getByRole('button', { name: 'Próximo projeto' }));
    act(() => void vi.advanceTimersByTime(13000));

    expect(screen.getByRole('tab', { name: /OutletEletro/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('não abre o link ao terminar um swipe horizontal', () => {
    render(<WorkSection />);
    const gallery = screen.getByRole('group', { name: 'Galeria de projetos' });
    const link = screen.getByRole('link', { name: 'Abrir o site NeuralBot' });

    fireEvent.touchStart(gallery, { touches: [{ clientX: 180, clientY: 100 }] });
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 80, clientY: 105 }] });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(screen.getByRole('tab', { name: /OutletEletro/i })).toHaveAttribute('aria-selected', 'true');
  });
});
