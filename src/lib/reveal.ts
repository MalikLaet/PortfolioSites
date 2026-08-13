/**
 * Observer único que revela os blocos ao entrarem em tela.
 *
 * É um singleton de módulo — e não um observer por componente — porque a
 * cascata de 70ms é contada sobre o LOTE de elementos que entram juntos. Com um
 * observer por elemento, cada um receberia delay 0 e a cascata sumiria.
 *
 * As duas salvaguardas abaixo vêm de bugs reais registrados no handoff: sem
 * elas, blocos ficam invisíveis para sempre quando o visitante pula o scroll ou
 * chega por âncora.
 */

type RevealCallback = () => void;

const CASCADE_MS = 70;
const OPTIONS: IntersectionObserverInit = {
  threshold: [0, 0.12],
  rootMargin: '0px 0px -70px 0px',
};

const pending = new Map<Element, RevealCallback>();
const timers = new Set<ReturnType<typeof setTimeout>>();
let observer: IntersectionObserver | null = null;
let sweepAttached = false;

function fire(element: Element): void {
  const callback = pending.get(element);
  if (!callback) return;
  pending.delete(element);
  observer?.unobserve(element);
  callback();
  if (pending.size === 0) detachSweep();
}

function handleEntries(entries: IntersectionObserverEntry[]): void {
  let position = 0;
  for (const entry of entries) {
    // Salvaguarda 1: o elemento já passou pela viewport (está acima dela).
    // Revelar na hora, sem delay — animar algo que ninguém vai ver só atrasa.
    const alreadyPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    if (alreadyPassed) {
      fire(entry.target);
      continue;
    }
    if (!entry.isIntersecting) continue;

    const delay = position * CASCADE_MS;
    position += 1;
    if (delay === 0) {
      fire(entry.target);
      continue;
    }
    const timer = setTimeout(() => {
      timers.delete(timer);
      fire(entry.target);
    }, delay);
    timers.add(timer);
  }
}

/**
 * Salvaguarda 2: um pulo rápido de scroll pode levar o elemento para cima da
 * viewport sem nunca gerar entrada de interseção. Esta varredura pega os que
 * ficaram para trás.
 */
function sweep(): void {
  for (const element of [...pending.keys()]) {
    if (element.getBoundingClientRect().bottom <= 0) fire(element);
  }
}

function attachSweep(): void {
  if (sweepAttached) return;
  window.addEventListener('scroll', sweep, { passive: true });
  sweepAttached = true;
}

function detachSweep(): void {
  if (!sweepAttached) return;
  window.removeEventListener('scroll', sweep);
  sweepAttached = false;
}

/** Registra um elemento. Devolve a função de cancelamento. */
export function observeReveal(element: Element, onReveal: RevealCallback): () => void {
  if (typeof IntersectionObserver !== 'function') {
    onReveal();
    return () => {};
  }
  observer ??= new IntersectionObserver(handleEntries, OPTIONS);
  pending.set(element, onReveal);
  observer.observe(element);
  attachSweep();

  return () => {
    pending.delete(element);
    observer?.unobserve(element);
    if (pending.size === 0) detachSweep();
  };
}

/** Só para os testes: zera o estado global entre casos. */
export function resetRevealObserver(): void {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
  pending.clear();
  observer?.disconnect();
  observer = null;
  detachSweep();
}
