import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { getIntersectionObservers } from '../../../vitest.setup';
import { WhatsAppFab } from './WhatsAppFab';

describe('WhatsAppFab', () => {
  let footerCta: HTMLAnchorElement | null = null;
  afterEach(() => { footerCta?.remove(); footerCta = null; });

  it('recolhe quando o CTA do rodapé entra em tela', () => {
    footerCta = document.createElement('a');
    footerCta.id = 'footer-whatsapp';
    document.body.append(footerCta);
    render(<WhatsAppFab />);
    const fab = screen.getByRole('link', { name: 'Falar no WhatsApp' });
    const observer = getIntersectionObservers().find((entry) => entry.elements.has(footerCta!));

    act(() => observer!.trigger([{ target: footerCta!, isIntersecting: true }]));
    expect(fab).toHaveAttribute('aria-hidden', 'true');
    expect(fab).toHaveAttribute('tabindex', '-1');
  });
});
