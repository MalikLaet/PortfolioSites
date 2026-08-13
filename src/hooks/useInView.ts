import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface InViewOptions {
  readonly threshold?: number | number[];
  readonly rootMargin?: string;
  /** Depois de aparecer uma vez, para de observar. Padrão: true. */
  readonly once?: boolean;
  /** Quando false, o hook nem observa e reporta visível — usado por reduced-motion. */
  readonly enabled?: boolean;
}

/**
 * Diz se o elemento está em tela.
 *
 * Com `enabled: false` o hook reporta `true` imediatamente: é o contrato usado
 * por `prefers-reduced-motion`, onde cada efeito deve mostrar seu ESTADO FINAL
 * em vez de nada.
 */
export function useInView<T extends Element>(
  options: InViewOptions = {},
): [RefObject<T>, boolean] {
  const { threshold = 0, rootMargin = '0px', once = true, enabled = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setInView(true);
      return;
    }
    const element = ref.current;
    if (!element || typeof IntersectionObserver !== 'function') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
    // threshold pode ser array; serializar evita reassinar a cada render
  }, [enabled, once, rootMargin, JSON.stringify(threshold)]);

  return [ref, inView];
}
