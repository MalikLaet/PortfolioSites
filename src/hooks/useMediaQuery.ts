import { useSyncExternalStore } from 'react';

/**
 * Lê uma media query e re-renderiza quando ela muda.
 *
 * `useSyncExternalStore` em vez de useState+useEffect porque o valor já existe
 * no primeiro render — com efeito haveria um frame com o valor errado, o que
 * no hero significaria montar a peça mobile e o canvas 3D ao mesmo tempo.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => {};
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => (typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false),
    // no servidor não há viewport; o SSR não é usado hoje, mas o default evita
    // que o hook exploda se um dia houver pré-render
    () => false,
  );
}

/** Breakpoints do handoff, nomeados para não espalhar números soltos pelo código. */
export const BREAKPOINTS = {
  /** abas da galeria com tipografia e padding reduzidos */
  xs: 420,
  /** grid de 4 colunas -> 1; timeline vira vertical */
  sm: 640,
  /** grid do rodapé -> 1 coluna */
  footer: 700,
  /** galeria 3D desligada (usa imagens + swipe) */
  gallery3d: 760,
  /** nav -> menu mobile; hero 3D desligado; 2 colunas -> 1; holofote desligado */
  md: 900,
  /** grids de 4 -> 2 colunas; trilho horizontal da timeline oculto */
  lg: 1024,
  /** relógio do header oculto */
  clock: 1180,
} as const;

export function useMaxWidth(px: number): boolean {
  return useMediaQuery(`(max-width: ${px - 0.02}px)`);
}

export function useMinWidth(px: number): boolean {
  return useMediaQuery(`(min-width: ${px}px)`);
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
