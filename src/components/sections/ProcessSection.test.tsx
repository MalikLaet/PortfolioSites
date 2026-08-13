import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { setReducedMotion, setViewportWidth } from '../../../vitest.setup';
import { calculateProcessProgress, isProcessStepActive } from '@/lib/processProgress';
import { ProcessSection } from './ProcessSection';

describe('lógica da timeline', () => {
  it('limita o progresso entre zero e um', () => {
    expect(calculateProcessProgress(1000, 600, 900, false)).toBe(0);
    expect(calculateProcessProgress(-1000, 600, 900, false)).toBe(1);
  });

  it('usa limiares distintos no mobile', () => {
    expect(isProcessStepActive(1, 0.25, false)).toBe(false);
    expect(isProcessStepActive(1, 0.25, true)).toBe(true);
  });
});

describe('ProcessSection', () => {
  it('mostra todas as etapas ativas no layout intermediário', () => {
    setViewportWidth(800);
    const { container } = render(<ProcessSection />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '11');
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(4);
  });

  it('mostra o estado final com reduced-motion', () => {
    setViewportWidth(1440);
    setReducedMotion(true);
    const { container } = render(<ProcessSection />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '11');
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(4);
  });

  it('atualiza dia e etapas a partir do scroll no desktop', async () => {
    setViewportWidth(1440);
    const { container } = render(<ProcessSection />);
    const section = container.querySelector('#processo') as HTMLElement;
    section.getBoundingClientRect = () => ({ top: 200, height: 800 }) as DOMRect;

    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', expect.not.stringMatching(/^1$/));
    expect(container.querySelectorAll('[data-active="true"]').length).toBeGreaterThan(0);
  });
});
