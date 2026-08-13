import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getIntersectionObservers } from '../../vitest.setup';
import { observeReveal, resetRevealObserver } from './reveal';

function makeElement(top: number, bottom: number): HTMLElement {
  const element = document.createElement('div');
  element.getBoundingClientRect = () => ({ top, bottom, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) });
  document.body.append(element);
  return element;
}

/** Entrada de interseção com só o que o observer realmente lê. */
function entryFor(target: Element, isIntersecting: boolean) {
  return { target, isIntersecting, boundingClientRect: target.getBoundingClientRect() };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  resetRevealObserver();
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('observeReveal', () => {
  it('revela em cascata de 70ms os elementos que entram juntos', () => {
    const calls: string[] = [];
    const a = makeElement(100, 300);
    const b = makeElement(320, 520);
    const c = makeElement(540, 740);
    observeReveal(a, () => calls.push('a'));
    observeReveal(b, () => calls.push('b'));
    observeReveal(c, () => calls.push('c'));

    const [observer] = getIntersectionObservers();
    observer!.trigger([entryFor(a, true), entryFor(b, true), entryFor(c, true)]);

    // o primeiro do lote não espera
    expect(calls).toEqual(['a']);
    vi.advanceTimersByTime(70);
    expect(calls).toEqual(['a', 'b']);
    vi.advanceTimersByTime(70);
    expect(calls).toEqual(['a', 'b', 'c']);
  });

  it('usa um observer só, para a cascata enxergar o lote inteiro', () => {
    observeReveal(makeElement(0, 10), () => {});
    observeReveal(makeElement(0, 10), () => {});
    expect(getIntersectionObservers()).toHaveLength(1);
  });

  it('salvaguarda 1: elemento que já passou pela viewport revela na hora', () => {
    const revealed = vi.fn();
    // top negativo = já ficou acima da tela
    const element = makeElement(-500, -300);
    observeReveal(element, revealed);

    const [observer] = getIntersectionObservers();
    observer!.trigger([entryFor(element, false)]);

    expect(revealed).toHaveBeenCalledTimes(1);
  });

  it('não revela elemento que ainda está abaixo da viewport', () => {
    const revealed = vi.fn();
    const element = makeElement(1200, 1400);
    observeReveal(element, revealed);

    const [observer] = getIntersectionObservers();
    observer!.trigger([entryFor(element, false)]);
    vi.advanceTimersByTime(1000);

    expect(revealed).not.toHaveBeenCalled();
  });

  it('salvaguarda 2: a varredura de scroll pega quem nunca gerou interseção', () => {
    const revealed = vi.fn();
    const element = makeElement(1200, 1400);
    observeReveal(element, revealed);
    expect(revealed).not.toHaveBeenCalled();

    // pulo de scroll: o elemento passou direto para cima da tela
    element.getBoundingClientRect = () =>
      ({ top: -900, bottom: -700 }) as DOMRect;
    window.dispatchEvent(new Event('scroll'));

    expect(revealed).toHaveBeenCalledTimes(1);
  });

  it('revela cada elemento uma vez só', () => {
    const revealed = vi.fn();
    const element = makeElement(100, 300);
    observeReveal(element, revealed);

    const [observer] = getIntersectionObservers();
    observer!.trigger([entryFor(element, true)]);
    observer!.trigger([entryFor(element, true)]);
    vi.advanceTimersByTime(500);

    expect(revealed).toHaveBeenCalledTimes(1);
  });

  it('cancelar antes da entrada impede a revelação', () => {
    const revealed = vi.fn();
    const element = makeElement(100, 300);
    const stop = observeReveal(element, revealed);
    stop();

    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(500);

    expect(revealed).not.toHaveBeenCalled();
  });
});
