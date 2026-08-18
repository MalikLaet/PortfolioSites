import { useState } from 'react';
import { STACK_ITEMS } from '@/data/content';
import styles from './StackMarquee.module.css';

function StackList({ hidden = false }: { readonly hidden?: boolean }): React.JSX.Element {
  return (
    <ul className={styles.list} aria-hidden={hidden || undefined}>
      {STACK_ITEMS.map((item) => (
        <li className={styles.item} key={item}>
          <span>{item}</span>
          <span className={styles.separator} aria-hidden="true">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Faixa contínua que apresenta a stack sem duplicar conteúdo para leitores de tela. */
export function StackMarquee(): React.JSX.Element {
  const [paused, setPaused] = useState(false);

  return (
    <section className={styles.section} aria-label="Tecnologias e práticas">
      <div className={`${styles.track} ${paused ? styles.trackPaused : ''}`}>
        <StackList />
        <StackList hidden />
      </div>
      <button
        className={styles.toggle}
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((current) => !current)}
      >
        {paused ? 'Retomar movimento' : 'Pausar movimento'}
      </button>
    </section>
  );
}
