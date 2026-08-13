import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { PROCESS_STEPS, PROCESS_TOTAL_DAYS } from '@/data/content';
import { BREAKPOINTS, useMaxWidth, useMinWidth, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { useScrollEffect } from '@/hooks/useScrollEffect';
import { Reveal } from '@/components/ui/Reveal';
import { calculateProcessProgress, isProcessStepActive } from '@/lib/processProgress';
import styles from './ProcessSection.module.css';

export function ProcessSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const mobile = useMaxWidth(BREAKPOINTS.sm);
  const desktop = useMinWidth(BREAKPOINTS.lg);
  const staticLayout = reducedMotion || (!mobile && !desktop);
  const [progress, setProgress] = useState(staticLayout ? 1 : 0);

  useEffect(() => {
    if (staticLayout) setProgress(1);
  }, [staticLayout]);

  const updateProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    setProgress(calculateProcessProgress(rect.top, rect.height, window.innerHeight || 1, mobile));
  }, [mobile]);

  useScrollEffect(updateProgress, !staticLayout);

  const displayedDay = 1 + Math.round(progress * (PROCESS_TOTAL_DAYS - 1));
  const progressStyle = { '--process-progress': `${progress * 100}%` } as CSSProperties;

  return (
    <section className={styles.section} id="processo" ref={sectionRef} style={progressStyle}>
      <div className="container">
        <Reveal as="header" variant="left" className={styles.header}>
          <span className="eyebrow">03 — Como funciona</span>
          <h2>Do primeiro “oi” ao site no ar em cerca de duas semanas.</h2>
        </Reveal>

        <Reveal className={styles.timeline}>
          <div className={styles.timelineHeader}>
            <span>Linha do tempo</span>
            <span>
              Dia <strong>{String(displayedDay).padStart(2, '0')}</strong> de {PROCESS_TOTAL_DAYS}
            </span>
          </div>

          <div
            className={styles.rail}
            role="progressbar"
            aria-label="Progresso da linha do tempo"
            aria-valuemin={1}
            aria-valuemax={PROCESS_TOTAL_DAYS}
            aria-valuenow={displayedDay}
          >
            <span className={styles.railFill} />
            {PROCESS_STEPS.map((step, index) => {
              const active = staticLayout || isProcessStepActive(index, progress, mobile);
              return (
                <i
                  className={`${styles.railNode} ${active ? styles.railNodeActive : ''}`}
                  style={{ left: `${12.5 + index * 25}%` }}
                  key={step.title}
                />
              );
            })}
          </div>

          <ol className={styles.steps}>
            {PROCESS_STEPS.map((step, index) => {
              const active = staticLayout || isProcessStepActive(index, progress, mobile);
              return (
                <li className={`${styles.step} ${active ? styles.stepActive : ''}`} data-active={active} key={step.title}>
                  <i className={styles.mobileNode} aria-hidden="true" />
                  <div className={styles.stepMeta}>
                    <span>Etapa {String(index + 1).padStart(2, '0')}</span>
                    <i aria-hidden="true" />
                    <strong>{step.durationLabel}</strong>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
