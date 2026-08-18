import { useEffect, useState } from 'react';
import { NAV_ITEMS, READABLE_SECTIONS, WHATSAPP_URL } from '@/data/site';
import { useElapsedTime } from '@/hooks/useClock';
import { ArrowUpIcon } from '@/components/ui/Icons';
import styles from './Footer.module.css';

export function readLoadTime(): string {
  if (typeof performance?.getEntriesByType !== 'function') return '<1';
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!navigation) return '<1';
  const milliseconds = navigation.domContentLoadedEventEnd - navigation.startTime;
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return '<1';
  return (milliseconds / 1000).toFixed(1).replace('.', ',');
}

function useReadSections(): number {
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return;
    const sections = READABLE_SECTIONS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );
    const observer = new IntersectionObserver((entries) => {
      const visibleIds = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);
      if (visibleIds.length === 0) return;
      setSeen((current) => new Set([...current, ...visibleIds]));
    }, { threshold: 0.3 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return seen.size;
}

export function Footer(): React.JSX.Element {
  const elapsed = useElapsedTime();
  const readCount = useReadSections();
  const [loadTime] = useState(readLoadTime);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topRow}>
          <a className={styles.brand} href="#topo" aria-label="ZÊNITE — início">
            <span aria-hidden="true">&lt;/&gt;</span>
            <strong>ZÊNITE</strong>
          </a>
          <nav aria-label="Navegação do rodapé">
            {NAV_ITEMS.map((item) => <a href={`#${item.id}`} key={item.id}>{item.label}</a>)}
          </nav>
          <a id="footer-whatsapp" className={styles.whatsapp} href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Falar no WhatsApp
          </a>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.metrics} aria-label={`Abriu em ${loadTime} segundos, você está aqui há ${elapsed}, leu ${readCount} de 5 seções`}>
            <i aria-hidden="true" />
            <span>abriu em <strong>{loadTime}s</strong></span>
            <b aria-hidden="true">/</b>
            <span>você está aqui há <strong>{elapsed}</strong></span>
            <b aria-hidden="true">/</b>
            <span>leu <strong>{readCount}</strong> de {READABLE_SECTIONS.length} seções</span>
          </p>
          <div className={styles.signature}>
            <span>© {new Date().getFullYear()} ZÊNITE · São Paulo</span>
            <a href="#topo" aria-label="Voltar ao topo"><ArrowUpIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
