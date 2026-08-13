import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom não implementa nada disto, e praticamente todo hook do site depende de
// pelo menos um. Definir aqui evita repetir o mesmo boilerplate em cada teste.

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? '';
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold ?? 0];
    observerRegistry.add(this);
  }
  readonly elements = new Set<Element>();
  observe(target: Element): void {
    this.elements.add(target);
  }
  unobserve(target: Element): void {
    this.elements.delete(target);
  }
  disconnect(): void {
    this.elements.clear();
    observerRegistry.delete(this);
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  /** Dispara entradas manualmente a partir do teste. */
  trigger(entries: Partial<IntersectionObserverEntry>[]): void {
    this.callback(entries as IntersectionObserverEntry[], this);
  }
}

const observerRegistry = new Set<MockIntersectionObserver>();

/** Entrega os observers vivos para os testes que precisam disparar interseção. */
export function getIntersectionObservers(): MockIntersectionObserver[] {
  return [...observerRegistry];
}

/**
 * Marca `element` como visível em todos os observers que o observam.
 * É o gatilho usado pelos reveals, contadores e checklist.
 */
export function triggerIntersection(element: Element, isIntersecting = true): void {
  for (const observer of observerRegistry) {
    if (!observer.elements.has(element)) continue;
    observer.trigger([
      {
        target: element,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: element.getBoundingClientRect(),
      },
    ]);
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// matchMedia: por padrão nada casa (viewport "desktop", sem reduced-motion).
// `setMatchMedia` troca o cenário e avisa as MediaQueryList já entregues, para
// que os testes possam simular resize e a troca de prefers-reduced-motion.

type MediaListener = (event: MediaQueryListEvent) => void;

let currentMatcher: (query: string) => boolean = () => false;
const liveQueries = new Map<string, { list: MediaQueryList; listeners: Set<MediaListener> }>();

export function setMatchMedia(matches: (query: string) => boolean): void {
  currentMatcher = matches;
  for (const [query, entry] of liveQueries) {
    const next = matches(query);
    if (next === entry.list.matches) continue;
    (entry.list as { matches: boolean }).matches = next;
    const event = { matches: next, media: query } as MediaQueryListEvent;
    for (const listener of entry.listeners) listener(event);
  }
}

vi.stubGlobal('matchMedia', (query: string): MediaQueryList => {
  const existing = liveQueries.get(query);
  if (existing) return existing.list;

  const listeners = new Set<MediaListener>();
  const list: MediaQueryList = {
    matches: currentMatcher(query),
    media: query,
    onchange: null,
    addEventListener: (_: string, listener: EventListener) =>
      listeners.add(listener as MediaListener),
    removeEventListener: (_: string, listener: EventListener) =>
      listeners.delete(listener as MediaListener),
    addListener: (listener: MediaListener) => listeners.add(listener),
    removeListener: (listener: MediaListener) => listeners.delete(listener),
    dispatchEvent: () => true,
  };
  liveQueries.set(query, { list, listeners });
  return list;
});

afterEach(() => {
  liveQueries.clear();
  currentMatcher = () => false;
});

/** Atalho para o cenário mais usado nos testes. */
export function setReducedMotion(enabled: boolean): void {
  setMatchMedia((query) => query.includes('prefers-reduced-motion') && enabled);
}

/** Simula uma viewport de `width` px para as media queries de largura. */
export function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
  setMatchMedia((query) => {
    const max = /max-width:\s*(\d+(?:\.\d+)?)px/.exec(query);
    if (max) return width <= Number(max[1]);
    const min = /min-width:\s*(\d+(?:\.\d+)?)px/.exec(query);
    if (min) return width >= Number(min[1]);
    return false;
  });
}

if (!window.scrollTo) {
  vi.stubGlobal('scrollTo', () => {});
}
