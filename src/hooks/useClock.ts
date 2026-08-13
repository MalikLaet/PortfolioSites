import { useEffect, useState } from 'react';
import { TIMEZONE } from '@/data/site';

const TICK_MS = 15_000;

function formatSaoPaulo(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
  });
}

/** Hora corrente em São Paulo, no formato HH:MM. Atualiza a cada 15s. */
export function useClock(enabled = true): string {
  const [time, setTime] = useState(() => formatSaoPaulo(new Date()));

  useEffect(() => {
    if (!enabled) return;
    setTime(formatSaoPaulo(new Date()));
    const interval = setInterval(() => setTime(formatSaoPaulo(new Date())), TICK_MS);
    return () => clearInterval(interval);
  }, [enabled]);

  return time;
}

/** Tempo desde o carregamento, no formato M:SS. */
export function useElapsedTime(): string {
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const total = Math.floor((Date.now() - start) / 1000);
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      setElapsed(`${minutes}:${String(seconds).padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return elapsed;
}
