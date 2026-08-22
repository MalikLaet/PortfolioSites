import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setReducedMotion, triggerIntersection } from '../../../vitest.setup';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  afterEach(() => vi.useRealTimers());

  it('aprova os seis itens em sequência ao entrar em tela', () => {
    vi.useFakeTimers();
    const { container } = render(<AboutSection />);
    const panel = container.querySelector('[class*="panel"] > div')!;
    expect(container.querySelectorAll('[data-approved="true"]')).toHaveLength(0);

    act(() => triggerIntersection(panel));
    act(() => void vi.advanceTimersByTime(1800));

    expect(container.querySelectorAll('[data-approved="true"]')).toHaveLength(6);
    expect(screen.getByText('Aprovado — pronto para publicar')).toBeInTheDocument();
  });

  it('nasce concluído com reduced-motion', () => {
    setReducedMotion(true);
    const { container } = render(<AboutSection />);

    expect(container.querySelectorAll('[data-approved="true"]')).toHaveLength(6);
    expect(screen.getByText('6/6')).toBeInTheDocument();
  });

  it('usa o contato oficial no CTA', () => {
    render(<AboutSection />);
    expect(screen.getByRole('link', { name: 'Falar com a gente' })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5511925780617'),
    );
  });
});
