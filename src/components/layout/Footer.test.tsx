import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { READABLE_SECTIONS } from '@/data/site';
import { getIntersectionObservers } from '../../../vitest.setup';
import { Footer, readLoadTime } from './Footer';

describe('readLoadTime', () => {
  it('não inventa uma medição quando Navigation Timing não está disponível', () => {
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([]);
    expect(readLoadTime()).toBe('<1');
  });
});

describe('Footer', () => {
  const sections: HTMLElement[] = [];

  afterEach(() => {
    sections.splice(0).forEach((section) => section.remove());
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('conta somente seções realmente vistas', () => {
    for (const id of READABLE_SECTIONS) {
      const section = document.createElement('section');
      section.id = id;
      sections.push(section);
      document.body.append(section);
    }
    render(<Footer />);
    const observer = getIntersectionObservers().find((entry) => entry.elements.has(sections[0]!));

    act(() => observer!.trigger([
      { target: sections[0]!, isIntersecting: true },
      { target: sections[1]!, isIntersecting: true },
    ]));

    expect(screen.getByText('2', { selector: 'strong' })).toBeInTheDocument();
  });

  it('mostra o tempo de permanência real', () => {
    vi.useFakeTimers();
    render(<Footer />);
    act(() => void vi.advanceTimersByTime(65_000));
    expect(screen.getByText('1:05')).toBeInTheDocument();
  });

  it('expõe navegação, WhatsApp e retorno ao topo', () => {
    render(<Footer />);
    expect(screen.getByRole('navigation', { name: 'Navegação do rodapé' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Falar no WhatsApp' })).toHaveAttribute('id', 'footer-whatsapp');
    expect(screen.getByRole('link', { name: 'Voltar ao topo' })).toHaveAttribute('href', '#topo');
  });
});
