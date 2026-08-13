import { useRef } from 'react';
import { useScrollEffect } from '@/hooks/useScrollEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import styles from './MobileStack.module.css';

/** Distância em Z entre camadas, e o deslocamento vertical que a acompanha. */
const LAYER_Z = -46;
const LAYER_Y = 15;

/**
 * A peça 3D exclusiva do mobile.
 *
 * O WebGL não roda abaixo de 900px por decisão de performance (bateria), então
 * o hero mobile tem sua própria versão do site explodido — mesmo conceito, em
 * CSS 3D, sem custo de GPU.
 */
export function MobileStack(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // ao rolar, o plano inclina e as camadas se juntam
  useScrollEffect(() => {
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!root || !plane) return;

    const rect = root.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    // -1 no rodapé da tela, 0 no centro, +1 no topo
    const p = Math.max(-1, Math.min(1, ((rect.top + rect.height / 2) / viewport - 0.5) * 2));

    plane.style.transform = `rotateX(${(11 + p * 6).toFixed(2)}deg) rotateY(${(-13 + p * 5).toFixed(2)}deg)`;

    const pull = 1 - Math.min(Math.abs(p), 1) * 0.45;
    for (const [index, layer] of [...plane.querySelectorAll<HTMLElement>('[data-layer]')].entries()) {
      layer.style.transform = `translateZ(${(index * LAYER_Z * pull).toFixed(1)}px) translateY(${(index * LAYER_Y * pull).toFixed(1)}px)`;
    }
  }, !reducedMotion);

  return (
    <div className={styles.root} ref={rootRef} aria-hidden="true">
      <div className={styles.plane} ref={planeRef}>
        {/* 1 · cromo do navegador */}
        <div data-layer className={styles.layer} style={{ animationDelay: '0s', animationDuration: '5s' }}>
          <div className={styles.chrome}>
            <span className={styles.dot} style={{ background: 'var(--tl-red)' }} />
            <span className={styles.dot} style={{ background: 'var(--tl-amber)' }} />
            <span className={styles.dot} style={{ background: 'var(--tl-green)' }} />
            <span className={styles.urlBar} />
          </div>
        </div>

        {/* 2 · faixa de hero */}
        <div data-layer className={styles.layer} style={{ animationDelay: '0.9s', animationDuration: '5.6s' }}>
          <div className={styles.heroBand}>
            <span className={styles.bar} style={{ width: '72%', height: 11, opacity: 0.22 }} />
            <span className={styles.bar} style={{ width: '54%', height: 11, opacity: 0.16, marginTop: 8 }} />
            <span className={styles.bar} style={{ width: '38%', height: 7, opacity: 0.1, marginTop: 12 }} />
            <span className={styles.accentPill} />
          </div>
        </div>

        {/* 3 · fileira de três cards */}
        <div data-layer className={styles.layer} style={{ animationDelay: '1.8s', animationDuration: '6.2s' }}>
          <div className={styles.cardRow}>
            <span className={styles.card} />
            <span className={`${styles.card} ${styles.cardLit}`} />
            <span className={styles.card} />
          </div>
        </div>

        {/* 4 · grade de rodapé, primeira célula em acento */}
        <div data-layer className={styles.layer} style={{ animationDelay: '2.6s', animationDuration: '6.8s' }}>
          <div className={styles.footerGrid}>
            <span className={styles.cellAccent} />
            <span className={styles.cell} />
            <span className={styles.cell} />
            <span className={styles.cellDim} />
            <span className={styles.cellDim} />
            <span className={styles.cellDim} />
          </div>
        </div>

        <span className={styles.scan} aria-hidden="true" />
      </div>
      <p className={styles.caption}>Cada camada escrita à mão</p>
    </div>
  );
}
