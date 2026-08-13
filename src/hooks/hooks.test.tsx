import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountUp } from './useCountUp';
import { useClock, useElapsedTime } from './useClock';
import { useScrollSpy } from './useScrollSpy';
import { readScrollProgress, useScrollEffect } from './useScrollEffect';
import { getIntersectionObservers } from '../../vitest.setup';

// `vi.useFakeTimers()` já falseia requestAnimationFrame e performance.now junto
// com os timers, então avançar o relógio avança os frames de animação também.

describe('useCountUp', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fica em 0 enquanto não está ativo', () => {
    const { result } = renderHook(() => useCountUp(20, false));
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current).toBe(0);
  });

  it('conta até o alvo e para exatamente nele', () => {
    const { result } = renderHook(() => useCountUp(20, true));
    expect(result.current).toBe(0);

    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThanOrEqual(20);

    act(() => vi.advanceTimersByTime(2000));
    expect(result.current).toBe(20);
  });

  it('desacelera no fim (ease-out): passa da metade antes da metade do tempo', () => {
    const { result } = renderHook(() => useCountUp(100, true));
    act(() => vi.advanceTimersByTime(750));
    expect(result.current).toBeGreaterThan(50);
  });

  it('com reduced-motion mostra o valor final de imediato', () => {
    const { result } = renderHook(() => useCountUp(20, true, true));
    expect(result.current).toBe(20);
  });
});

describe('useElapsedTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('conta a partir de 0:00 no formato M:SS', () => {
    const { result } = renderHook(() => useElapsedTime());
    expect(result.current).toBe('0:00');

    act(() => vi.advanceTimersByTime(9_000));
    expect(result.current).toBe('0:09');

    act(() => vi.advanceTimersByTime(125_000));
    expect(result.current).toBe('2:14');
  });
});

describe('useClock', () => {
  it('devolve a hora de São Paulo no formato HH:MM', () => {
    const { result } = renderHook(() => useClock());
    expect(result.current).toMatch(/^\d{2}:\d{2}$/);
  });

  it('não agenda nada quando desabilitado (viewport estreita esconde o relógio)', () => {
    const spy = vi.spyOn(globalThis, 'setInterval');
    renderHook(() => useClock(false));
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('useScrollSpy', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reporta a seção que cruza a linha de leitura', () => {
    const trabalho = document.createElement('section');
    trabalho.id = 'trabalho';
    const sobre = document.createElement('section');
    sobre.id = 'sobre';
    document.body.append(trabalho, sobre);

    const ids = ['trabalho', 'sobre'];
    const { result } = renderHook(() => useScrollSpy(ids));
    expect(result.current).toBeNull();

    const [observer] = getIntersectionObservers();
    act(() => {
      observer!.trigger([{ target: trabalho, isIntersecting: true }]);
    });
    expect(result.current).toBe('trabalho');

    act(() => {
      observer!.trigger([{ target: sobre, isIntersecting: true }]);
    });
    expect(result.current).toBe('sobre');
  });

  it('observa numa faixa fina no meio da tela', () => {
    const section = document.createElement('section');
    section.id = 'trabalho';
    document.body.append(section);

    renderHook(() => useScrollSpy(['trabalho']));
    expect(getIntersectionObservers()[0]?.rootMargin).toBe('-45% 0px -45% 0px');
  });
});

describe('useScrollEffect', () => {
  it('roda no mount e a cada scroll, no máximo uma vez por frame', () => {
    vi.useFakeTimers();
    const handler = vi.fn();
    renderHook(() => useScrollEffect(handler));
    expect(handler).toHaveBeenCalledTimes(1);

    // três scrolls dentro do mesmo frame viram uma execução só
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(20);
    });
    expect(handler).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('desliga os listeners ao desmontar', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useScrollEffect(handler));
    unmount();
    handler.mockClear();
    window.dispatchEvent(new Event('scroll'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('não faz nada quando desabilitado', () => {
    const handler = vi.fn();
    renderHook(() => useScrollEffect(handler, false));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('readScrollProgress', () => {
  it('devolve 0 quando a página não rola', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 800,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    expect(readScrollProgress()).toBe(0);
  });

  it('devolve a fração já rolada, limitada a 1', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });

    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
    expect(readScrollProgress()).toBe(0.5);

    Object.defineProperty(window, 'scrollY', { value: 5000, configurable: true });
    expect(readScrollProgress()).toBe(1);
  });
});
