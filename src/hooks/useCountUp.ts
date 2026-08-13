import { useEffect, useState } from 'react';

const DURATION_MS = 1500;

/** Ease-out cúbico: rápido no começo, assentando no fim. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Conta de 0 até `target` quando `active` vira true.
 *
 * Com `instant` (reduced-motion) o valor final aparece de uma vez — o número é
 * informação, não decoração, e precisa estar lá de qualquer jeito.
 */
export function useCountUp(target: number, active: boolean, instant = false): number {
  const [value, setValue] = useState(active && instant ? target : 0);

  useEffect(() => {
    if (!active) return;
    if (instant) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setValue(Math.floor(easeOutCubic(progress) * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active, instant]);

  return value;
}
