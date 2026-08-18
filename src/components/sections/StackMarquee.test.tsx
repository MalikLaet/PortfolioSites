import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { STACK_ITEMS } from '@/data/content';
import { StackMarquee } from './StackMarquee';

describe('StackMarquee', () => {
  it('expõe uma única lista acessível e mantém a cópia visual escondida', () => {
    render(<StackMarquee />);

    const section = screen.getByRole('region', { name: 'Tecnologias e práticas' });
    const lists = within(section).getAllByRole('list');
    expect(lists).toHaveLength(1);

    for (const item of STACK_ITEMS) {
      expect(within(lists[0]!).getByText(item)).toBeInTheDocument();
      expect(screen.getAllByText(item)).toHaveLength(2);
    }
  });

  it('permite pausar e retomar o movimento contínuo', () => {
    const { container } = render(<StackMarquee />);
    const toggle = screen.getByRole('button', { name: 'Pausar movimento' });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Retomar movimento' })).toBeInTheDocument();
    expect(container.querySelector('[class*="trackPaused"]')).toBeInTheDocument();
  });
});
