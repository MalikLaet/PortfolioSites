import { lazy, Suspense } from 'react';
import { HERO_STATS } from '@/data/content';
import { WHATSAPP_URL } from '@/data/site';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { BREAKPOINTS, useMinWidth, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { MobileStack } from './MobileStack';
import { ScrollCue } from './ScrollCue';
import styles from './Hero.module.css';

// three.js sai do bundle inicial: só é buscado quando a tela comporta a cena.
const HeroScene = lazy(() =>
  import('@/components/three/HeroScene').then((m) => ({ default: m.HeroScene })),
);

/** As três linhas do H1. A última é a virada, e vive em --muted. */
const HEADLINE = ['Todo dia alguém', 'procura o que você faz', 'e acha outro.'] as const;

export function Hero(): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion();
  // 3D nunca abaixo de 900px, nem com reduced-motion
  const show3D = useMinWidth(BREAKPOINTS.md) && !reducedMotion;

  return (
    <section id="topo" className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      {show3D && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}

      <ScrollCue targetId="topo" />

      <div className="container">
        <div className={styles.column}>
          <h1 className={styles.headline}>
            {HEADLINE.map((line, index) => (
              <span key={line} className={styles.lineMask}>
                <span
                  className={`${styles.line} ${index === HEADLINE.length - 1 ? styles.lineMuted : ''}`}
                  style={{ animationDelay: `${(0.12 + index * 0.11).toFixed(2)}s` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <Reveal as="p" className={styles.subtitle}>
            Quem vive de indicação e de Instagram depende da sorte para ser encontrado. Um site
            próprio coloca seu nome na frente de quem já está decidido a comprar — e joga a conversa
            direto no seu WhatsApp.
          </Reveal>

          <Reveal className={styles.actions}>
            <a href="#trabalho" className={styles.primary}>
              Ver o que já fizemos
              <ArrowRightIcon />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className={styles.secondary}>
              <WhatsAppIcon size={17} color="var(--whatsapp)" />
              Falar no WhatsApp
            </a>
          </Reveal>

          <MobileStack />

          <HeroStats />
        </div>
      </div>
    </section>
  );
}

function HeroStats(): React.JSX.Element {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.6 });

  return (
    <Reveal className={styles.stats}>
      <div ref={ref} className={styles.statsRow}>
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statValue}>
              <StatNumber stat={stat} active={inView} />
              <span className={styles.statSuffix}>{stat.suffix}</span>
            </div>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function StatNumber({
  stat,
  active,
}: {
  readonly stat: (typeof HERO_STATS)[number];
  readonly active: boolean;
}): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion();
  const counted = useCountUp(stat.countTo ?? 0, active && stat.countTo !== undefined, reducedMotion);
  return <span>{stat.countTo === undefined ? stat.value : counted}</span>;
}
