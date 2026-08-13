import { useEffect, type RefObject } from 'react';

/** Fração da distância cursor→centro que o elemento acompanha. */
const PULL = 0.22;

/**
 * Faz o elemento se deslocar na direção do cursor enquanto ele passa por cima.
 *
 * Mexe no `style.transform` direto em vez de passar por estado do React: são
 * dezenas de atualizações por segundo, e re-renderizar a cada `pointermove`
 * custaria caro por um efeito puramente visual.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, enabled = true): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * PULL;
      const y = (event.clientY - (rect.top + rect.height / 2)) * PULL;
      element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const onLeave = () => {
      element.style.transform = 'translate(0, 0)';
    };

    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);
    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
      element.style.transform = '';
    };
  }, [ref, enabled]);
}
