import { useEffect, useState } from 'react';
import { WHATSAPP_URL } from '@/data/site';
import { WhatsAppIcon } from '@/components/ui/Icons';
import styles from './WhatsAppFab.module.css';

export function WhatsAppFab(): React.JSX.Element {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footerCta = document.getElementById('footer-whatsapp');
    if (!footerCta || typeof IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver(([entry]) => {
      setHidden(entry?.isIntersecting ?? false);
    }, { threshold: 0.12 });
    observer.observe(footerCta);
    return () => observer.disconnect();
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
