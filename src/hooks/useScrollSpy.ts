import { useEffect, useState } from 'react';

/**
 * Diz qual seção está no centro da viewport.
 *
 * A margem de -45% em cima e embaixo reduz a área observada a uma faixa fina no
 * meio da tela: a seção "atual" é a que cruza a linha de leitura, não a que
 * apenas apareceu na borda.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
