import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS } from '@/data/projects';
import { useInView } from '@/hooks/useInView';
import { BREAKPOINTS, useMinWidth, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import styles from './WorkSection.module.css';

const AUTOPLAY_MS = 6500;
const SWIPE_MIN_PX = 45;

const WorkScene = lazy(() =>
  import('@/components/three/WorkScene').then((module) => ({ default: module.WorkScene })),
);

export function WorkSection(): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion();
  const canUse3d = useMinWidth(BREAKPOINTS.gallery3d) && !reducedMotion;
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.25, once: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressNextLink = useRef(false);

  const select = useCallback((index: number, manual = true) => {
    if (manual) setUserInteracted(true);
    setActiveIndex((index + PROJECTS.length) % PROJECTS.length);
  }, []);

  const previous = useCallback(() => select(activeIndex - 1), [activeIndex, select]);
  const next = useCallback(() => select(activeIndex + 1), [activeIndex, select]);

  useEffect(() => {
    if (!inView || userInteracted || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % PROJECTS.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion, userInteracted]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const centered = rect.top < window.innerHeight * 0.65 && rect.bottom > window.innerHeight * 0.35;
      if (!centered) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') previous();
      else next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [next, previous, sectionRef]);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    pointerStart.current = { x: touch.clientX, y: touch.clientY };
    suppressNextLink.current = false;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) <= SWIPE_MIN_PX || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    suppressNextLink.current = true;
    if (deltaX < 0) next();
    else previous();
  };

  const activeProject = PROJECTS[activeIndex]!;
  const autoplayRunning = inView && !userInteracted && !reducedMotion;

  return (
    <section className={styles.section} id="trabalho" ref={sectionRef}>
      <div className="container">
        <Reveal as="header" variant="rise" className={styles.header}>
          <div>
            <span className="eyebrow">01 — Trabalho selecionado</span>
            <h2>Três negócios que pararam de esperar a indicação chegar.</h2>
          </div>
          <p>
            Clique numa tela ao lado para trazê-la à frente. Clique na da frente para abrir o site.
          </p>
        </Reveal>

        <Reveal className={styles.gallery}>
          <div
            className={styles.stage}
            role="group"
            aria-label="Galeria de projetos"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <a
              className={`${styles.browserCard} ${sceneReady ? styles.browserCardHidden : ''}`}
              href={activeProject.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir o site ${activeProject.name}`}
              onClick={(event) => {
                if (!suppressNextLink.current) return;
                event.preventDefault();
                suppressNextLink.current = false;
              }}
            >
              <span className={styles.browserBar} aria-hidden="true">
                <span className={styles.dots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.address}>{activeProject.domain}</span>
              </span>
              <span className={styles.images}>
                {PROJECTS.map((project, index) => (
                  <img
                    className={`${styles.image} ${index === activeIndex ? styles.imageActive : ''}`}
                    src={project.card.src}
                    srcSet={project.card.srcSet}
                    sizes="(max-width: 760px) 88vw, 640px"
                    alt={project.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    aria-hidden={index !== activeIndex}
                    key={project.slug}
                  />
                ))}
              </span>
              <span className={styles.openBadge}>
                Abrir site <ExternalLinkIcon />
              </span>
            </a>

            {canUse3d ? (
              <Suspense fallback={null}>
                <WorkScene
                  activeIndex={activeIndex}
                  onSelect={(index) => select(index)}
                  onReady={() => setSceneReady(true)}
                />
              </Suspense>
            ) : null}

            <button className={`${styles.arrow} ${styles.arrowLeft}`} type="button" onClick={previous} aria-label="Projeto anterior">
              <ChevronLeftIcon size={20} />
            </button>
            <button className={`${styles.arrow} ${styles.arrowRight}`} type="button" onClick={next} aria-label="Próximo projeto">
              <ChevronRightIcon size={20} />
            </button>
            <p className={styles.dragHint}>Arraste para ver os outros</p>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Projetos">
            {PROJECTS.map((project, index) => {
              const active = index === activeIndex;
              return (
                <button
                  className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`project-panel-${project.slug}`}
                  id={`project-tab-${project.slug}`}
                  onClick={() => select(index)}
                  key={project.slug}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{project.name}</strong>
                  {active && autoplayRunning ? <i className={styles.autoplay} key={`${index}-${activeIndex}`} /> : null}
                </button>
              );
            })}
          </div>

          <div className={styles.panels}>
            {PROJECTS.map((project, index) => {
              const active = index === activeIndex;
              return (
                <article
                  className={`${styles.panel} ${active ? styles.panelActive : ''}`}
                  role="tabpanel"
                  id={`project-panel-${project.slug}`}
                  aria-labelledby={`project-tab-${project.slug}`}
                  aria-hidden={!active}
                  key={project.slug}
                >
                  <div className={styles.projectCopy}>
                    <div className={styles.meta}>
                      <span>{project.category}</span>
                      <span>{project.businessType}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <ul className={styles.tags} aria-label={`Tecnologias de ${project.name}`}>
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                  <div className={styles.projectResult}>
                    <div className={styles.resultBox}>
                      <span>Resultado</span>
                      <p>{project.result}</p>
                    </div>
                    <a href={project.url} target="_blank" rel="noreferrer" tabIndex={active ? 0 : -1} data-fab-target={active || undefined}>
                      <span>Ver ao vivo</span>
                      <strong>{project.domain}</strong>
                      <ExternalLinkIcon size={15} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
