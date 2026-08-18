import { useEffect, useState } from 'react';
import { DELIVERY_SPECS } from '@/data/content';
import { WHATSAPP_URL } from '@/data/site';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { CheckIcon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import styles from './AboutSection.module.css';

const CHECKLIST_START_MS = 280;
const CHECKLIST_STEP_MS = 300;

export function AboutSection(): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion();
  const [panelRef, inView] = useInView<HTMLDivElement>({ threshold: 0.3, enabled: !reducedMotion });
  const [approvedCount, setApprovedCount] = useState(reducedMotion ? DELIVERY_SPECS.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setApprovedCount(DELIVERY_SPECS.length);
      return;
    }
    if (!inView) return;
    const timers = DELIVERY_SPECS.map((_, index) =>
      window.setTimeout(() => setApprovedCount(index + 1), CHECKLIST_START_MS + index * CHECKLIST_STEP_MS),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [inView, reducedMotion]);

  const complete = approvedCount === DELIVERY_SPECS.length;

  return (
    <section className={styles.section} id="sobre">
      <div className={`container ${styles.layout}`}>
        <Reveal variant="left" className={styles.copy}>
          <span className="eyebrow">04 — Sobre</span>
          <h2>Um estúdio de código, não uma fábrica de sites.</h2>
          <p>
            A ZÊNITE trabalha direto com quem decide. Sem intermediário, sem gerente de conta,
            sem reunião que podia ser mensagem — quem escreve o código é quem entendeu o seu negócio.
          </p>
          <p>
            Aceitamos poucos projetos por mês de propósito. Preferimos entregar três sites que
            funcionam a dez que apenas existem.
          </p>
          <div className={styles.actions}>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Falar com a gente</a>
            <span><i aria-hidden="true" /> Resposta em minutos</span>
          </div>
        </Reveal>

        <Reveal variant="scale" className={styles.panel}>
          <div ref={panelRef}>
            <div className={styles.panelBar}>
              <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
              <span className={styles.path}>zenite / padrão-de-entrega</span>
              <strong className={complete ? styles.counterComplete : ''}>{approvedCount}/6</strong>
            </div>

            <ol className={styles.checklist}>
              {DELIVERY_SPECS.map((spec, index) => {
                const approved = index < approvedCount;
                return (
                  <li className={approved ? styles.approved : ''} data-approved={approved} key={spec.label}>
                    <span className={styles.node}>
                      <b>{String(index + 1).padStart(2, '0')}</b>
                      <CheckIcon color="var(--whatsapp)" />
                    </span>
                    <span className={styles.specCopy}>
                      <strong>{spec.label}</strong>
                      <span>{spec.value}</span>
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className={`${styles.panelFooter} ${complete ? styles.panelFooterVisible : ''}`}>
              <CheckIcon color="var(--whatsapp)" />
              <span>Aprovado — pronto para publicar</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
