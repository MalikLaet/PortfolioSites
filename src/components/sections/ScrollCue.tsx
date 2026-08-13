import { useEffect, useState } from 'react';
import { useScrollEffect } from '@/hooks/useScrollEffect';
import styles from './ScrollCue.module.css';

/** Abaixo desta rolagem a dica ainda faz sentido; acima, ela some. */
const HIDE_AFTER = 90;
/** Fontes e 3D mudam a altura do hero depois do primeiro paint. */
const REMEASURE_MS = 900;

interface ScrollCueProps {
  /** Id da seção que a dica se refere — normalmente o hero. */
  readonly targetId: string;
}

/**
 * "Role para ver", ancorado na viewport.
 *
 * Só aparece se o hero COUBER na tela. Quando ele transborda, a página já está
 * visivelmente cortada — não há o que sugerir — e uma dica presa à viewport
 * cairia por cima do próprio texto do hero.
 */
export function ScrollCue({ targetId }: ScrollCueProps): React.JSX.Element | null {
  const [fits, setFits] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const measure = () => {
      const hero = document.getElementById(targetId);
      setFits(!!hero && hero.getBoundingClientRect().height <= window.innerHeight - 8);
    };
    measure();
    window.addEventListener('resize', measure);
    const timer = setTimeout(measure, REMEASURE_MS);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
  }, [targetId]);

  useScrollEffect(() => {
    setScrolled(window.scrollY > HIDE_AFTER);
  }, fits);

  if (!fits) return null;

  return (
    <div className={`${styles.cue} ${scrolled ? styles.gone : ''}`} aria-hidden="true">
      <div className="container">
        <div className={styles.inner}>
          <span className={styles.track}>
            <span className={styles.dot} />
          </span>
          <span className={styles.label}>Role para ver</span>
        </div>
      </div>
    </div>
  );
}
