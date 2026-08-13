import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { setMatchMedia, setReducedMotion, setViewportWidth } from '../../vitest.setup';
import { BREAKPOINTS, useMaxWidth, useMediaQuery, usePrefersReducedMotion } from './useMediaQuery';

describe('useMediaQuery', () => {
  it('devolve o valor certo já no primeiro render, sem frame intermediário', () => {
    setMatchMedia((q) => q === '(min-width: 900px)');
    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    expect(result.current).toBe(true);
  });

  it('reage à mudança da query', () => {
    setViewportWidth(1440);
    const { result } = renderHook(() => useMaxWidth(BREAKPOINTS.md));
    expect(result.current).toBe(false);

    act(() => setViewportWidth(500));
    expect(result.current).toBe(true);
  });
});

describe('usePrefersReducedMotion', () => {
  it('é falso por padrão', () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it('acompanha a preferência do sistema', () => {
    setReducedMotion(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });
});
