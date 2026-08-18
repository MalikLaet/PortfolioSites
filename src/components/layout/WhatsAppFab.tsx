import { useEffect, useRef, useState } from 'react';
import { WHATSAPP_URL } from '@/data/site';
import { WhatsAppIcon } from '@/components/ui/Icons';
import styles from './WhatsAppFab.module.css';

export function WhatsAppFab(): React.JSX.Element {
  const [hidden, setHidden] = useState(false);
  const visibleTargets = useRef(new Set<Element>());

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('[data-fab-target], #footer-whatsapp'));
    if (targets.length === 0 || typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.current.add(entry.target);
        else visibleTargets.current.delete(entry.target);
      });
      setHidden(visibleTargets.current.size > 0);
    }, { threshold: 0.12 });
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      visibleTargets.current.clear();
    };
  }, []);

  return (
    <a
      className={`${styles.fab} ${hidden ? styles.hidden : ''}`}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      <WhatsAppIcon size={25} color="var(--bg)" />
    </a>
  );
}
