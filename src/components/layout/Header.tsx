import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NAV_ITEMS, WHATSAPP_URL, LOCATION } from '@/data/site';
import { useClock } from '@/hooks/useClock';
import { useMagnetic } from '@/hooks/useMagnetic';
import { BREAKPOINTS, useMinWidth, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { readScrollProgress, useScrollEffect } from '@/hooks/useScrollEffect';
import { MenuIcon } from '@/components/ui/Icons';
import styles from './Header.module.css';

/** Acima disto a cápsula se desprende da borda e vira uma ilha de vidro. */
const CONDENSE_AT = 40;
/** Duração da transição da cápsula — a pílula só reposiciona quando ela assenta. */
const CONDENSE_MS = 620;

const NAV_IDS = NAV_ITEMS.map((item) => item.id);

interface HeaderProps {
  readonly onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps): React.JSX.Element {
  const [condensed, setCondensed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const showClock = useMinWidth(BREAKPOINTS.clock);
  const activeId = useScrollSpy(NAV_IDS);
  const time = useClock(showClock);

  useMagnetic(ctaRef, !reducedMotion);

  useScrollEffect(() => {
    setCondensed(window.scrollY > CONDENSE_AT);
    setProgress(readScrollProgress());
  });

  // A pílula desliza atrás do link da seção atual. Medir é obrigatório: a
  // largura de cada link depende da fonte, que só assenta depois do primeiro
  // paint.
  const placeIndicator = () => {
    const nav = navRef.current;
    const link = activeId ? linkRefs.current.get(activeId) : undefined;
    if (!nav || !link) {
      setIndicator(null);
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setIndicator({
      left: Math.round(linkRect.left - navRect.left),
      width: Math.round(linkRect.width),
    });
  };

  useLayoutEffect(placeIndicator, [activeId]);

  useEffect(() => {
    const onResize = () => placeIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  // condensar muda a largura da cápsula, que move os links: reposicionar depois
  // que a transição termina, senão a pílula fica no lugar antigo
  useEffect(() => {
    const timer = setTimeout(placeIndicator, CONDENSE_MS);
    return () => clearTimeout(timer);
  }, [condensed]);

  return (
    <header className={`${styles.header} ${condensed ? styles.condensed : ''}`}>
      <div className={styles.shell}>
        <a href="#topo" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            &lt;/&gt;
          </span>
          <span className={styles.wordmark}>DevSites</span>
        </a>

        <nav className={styles.nav} ref={navRef} aria-label="Navegação principal">
          <span
            className={styles.indicator}
            aria-hidden="true"
            style={
              indicator
                ? { opacity: 1, width: `${indicator.width}px`, transform: `translate(${indicator.left}px, -50%)` }
                : { opacity: 0 }
            }
          />
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`${styles.navLink} ${activeId === item.id ? styles.navLinkActive : ''}`}
              aria-current={activeId === item.id ? 'true' : undefined}
              ref={(element) => {
                if (element) linkRefs.current.set(item.id, element);
                else linkRefs.current.delete(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          {showClock && (
            <div className={styles.clock}>
              <span className={styles.pulse} aria-hidden="true" />
              <span className={styles.clockLabel}>
                {LOCATION} · {time}
              </span>
            </div>
          )}

          <a
            ref={ctaRef}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className={styles.cta}
          >
            Começar um projeto
          </a>

          <button type="button" aria-label="Abrir menu" onClick={onOpenMenu} className={styles.menuButton}>
            <MenuIcon />
          </button>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </header>
  );
}
