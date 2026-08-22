import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CtaSection } from './CtaSection';

describe('CtaSection', () => {
  it('usa a copy aprovada e o contato oficial', () => {
    render(<CtaSection />);

    expect(screen.getByRole('heading', { name: /Em 10 minutos você descobre/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Falar no WhatsApp agora/ })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5511925780617'),
    );
  });
});
