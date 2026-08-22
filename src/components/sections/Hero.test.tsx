import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setReducedMotion, setViewportWidth, triggerIntersection } from '../../../vitest.setup';
import { Hero } from './Hero';
import { ScrollCue } from './ScrollCue';

// A cena three.js é `lazy` e nunca resolve em jsdom (não há WebGL). O mock
// mantém o teste focado no que o Hero decide: montar ou não montar.
vi.mock('@/components/three/HeroScene', () => ({
  HeroScene: () => <canvas data-testid="hero-scene" />,
}));

beforeEach(() => {
  setViewportWidth(1440);
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
});

afterEach(() => {
  // sem isto, um caso que falha antes do seu próprio cleanup deixa timers
  // falsos ligados e trava por timeout o caso seguinte
  vi.useRealTimers();
});

describe('Hero', () => {
  it('renderiza o H1 nas três linhas do handoff', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Todo dia alguémprocura o que você faze acha outro.');
  });

  it('anima as linhas em cascata, cada uma com seu delay', () => {
    const { container } = render(<Hero />);
    const delays = [...container.querySelectorAll<HTMLElement>('h1 span span')].map(
      (el) => el.style.animationDelay,
    );
    expect(delays).toEqual(['0.12s', '0.23s', '0.34s']);
  });

  it('leva ao trabalho e ao WhatsApp', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /Ver o que já fizemos/ })).toHaveAttribute(
      'href',
      '#trabalho',
    );
    expect(screen.getByRole('link', { name: /Falar no WhatsApp/ })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5511925780617'),
    );
  });

  it('mostra as três estatísticas confirmadas, e só elas', () => {
    render(<Hero />);
    expect(screen.getByText('Projetos entregues')).toBeInTheDocument();
    expect(screen.getByText('Clientes satisfeitos')).toBeInTheDocument();
    expect(screen.getByText('No ar, todo dia')).toBeInTheDocument();

    const { container } = render(<Hero />);
    expect(container.querySelectorAll('[class*="statLabel"]')).toHaveLength(3);
  });

  it('começa os contadores em zero e conta ao entrar em tela', () => {
    vi.useFakeTimers();
    const { container } = render(<Hero />);
    const values = container.querySelectorAll('[class*="statValue"]');
    expect(values[0]).toHaveTextContent('0+');
    // o terceiro é estático: nunca conta
    expect(values[2]).toHaveTextContent('24h');

    // dois `act` separados: o efeito que agenda a animação só roda depois que a
    // mudança de estado da interseção é aplicada
    const statsRow = container.querySelector('[class*="statsRow"]')!;
    act(() => triggerIntersection(statsRow));
    act(() => void vi.advanceTimersByTime(2000));

    expect(values[0]).toHaveTextContent('20+');
    expect(values[1]).toHaveTextContent('100%');
  });

  it('monta a cena 3D no desktop', () => {
    render(<Hero />);
    expect(screen.getByTestId('hero-scene')).toBeInTheDocument();
  });

  it('não monta a cena 3D abaixo de 900px', () => {
    setViewportWidth(480);
    render(<Hero />);
    expect(screen.queryByTestId('hero-scene')).not.toBeInTheDocument();
  });

  it('não monta a cena 3D com prefers-reduced-motion, mesmo no desktop', () => {
    setReducedMotion(true);
    render(<Hero />);
    expect(screen.queryByTestId('hero-scene')).not.toBeInTheDocument();
  });
});

describe('ScrollCue', () => {
  let hero: HTMLElement | null = null;

  /** O `#topo` real vive fora do container do RTL, então some na mão. */
  function mountHero(height: number, viewport = 900) {
    Object.defineProperty(window, 'innerHeight', { value: viewport, configurable: true });
    hero = document.createElement('section');
    hero.id = 'topo';
    hero.getBoundingClientRect = () => ({ height, top: 0 }) as DOMRect;
    document.body.append(hero);
    return hero;
  }

  afterEach(() => {
    hero?.remove();
    hero = null;
  });

  it('aparece quando o hero cabe na viewport', () => {
    mountHero(700);
    render(<ScrollCue targetId="topo" />);
    expect(screen.getByText('Role para ver')).toBeInTheDocument();
  });

  it('não aparece quando o hero transborda — a página já está visivelmente cortada', () => {
    mountHero(1400);
    render(<ScrollCue targetId="topo" />);
    expect(screen.queryByText('Role para ver')).not.toBeInTheDocument();
  });

  it('some depois de 90px de rolagem', async () => {
    mountHero(700);
    const { container } = render(<ScrollCue targetId="topo" />);
    const cue = container.firstElementChild as HTMLElement;
    const isGone = () => [...cue.classList].some((c) => c.includes('gone'));
    expect(isGone()).toBe(false);

    Object.defineProperty(window, 'scrollY', { value: 120, configurable: true });
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(isGone()).toBe(true);
  });
});
