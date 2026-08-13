import { useEffect, useRef } from 'react';

/**
 * Roda `handler` no mount e a cada scroll/resize, no máximo uma vez por frame.
 *
 * O throttle por `requestAnimationFrame` é o que mantém a barra de progresso, a
 * timeline e a peça 3D do mobile lendo layout sem travar o scroll — todos eles
 * chamam `getBoundingClientRect`, que força reflow se disparado por evento.
 */
export function useScrollEffect(handler: () => void, enabled = true): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const run = () => {
      frame = 0;
      handlerRef.current();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    handlerRef.current();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);
}

/** Fração já rolada da página, de 0 a 1. Alimenta a barra do header. */
export function readScrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(window.scrollY / max, 1);
}
