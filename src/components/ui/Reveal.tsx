import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';
import { observeReveal } from '@/lib/reveal';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import styles from './Reveal.module.css';

/** Variantes de entrada do handoff. Cada uma tem seu transform inicial. */
export type RevealVariant = 'up' | 'rise' | 'left' | 'right' | 'scale' | 'wipe';

interface RevealProps {
  readonly children: ReactNode;
  readonly variant?: RevealVariant;
  /** Elemento renderizado. Padrão `div`. */
  readonly as?: 'div' | 'section' | 'article' | 'p' | 'header' | 'li';
  readonly className?: string;
  readonly id?: string;
  readonly 'aria-hidden'?: boolean;
}

/**
 * Envolve um bloco que deve entrar animado ao aparecer na tela.
 *
 * Com `prefers-reduced-motion` o bloco nasce revelado — o estado final, nunca
 * o vazio.
 */
export function Reveal({
  children,
  variant = 'up',
  as = 'div',
  className,
  ...rest
}: RevealProps): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const element = ref.current;
    if (!element) return;
    return observeReveal(element, () => setRevealed(true));
  }, [reducedMotion]);

  const classes = [styles.reveal, styles[variant], revealed ? styles.visible : '', className]
    .filter(Boolean)
    .join(' ');

  return createElement(as, { ref, className: classes, ...rest }, children);
}
