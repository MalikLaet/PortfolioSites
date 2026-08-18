import { useEffect, useRef } from 'react';
import { EMAIL, NAV_ITEMS, WHATSAPP_URL } from '@/data/site';
import { CloseIcon } from '@/components/ui/Icons';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps): React.JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // com o overlay aberto, rolar o fundo é desorientador
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      // prende o Tab dentro do overlay: fora dele o conteúdo está inerte
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu">
      <div className={styles.top}>
        <span className={styles.wordmark}>ZÊNITE</span>
        <button type="button" aria-label="Fechar menu" onClick={onClose} className={styles.close} ref={closeRef}>
          <CloseIcon />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={onClose}
            className={styles.item}
            // cascata: cada link entra 70ms depois do anterior
            style={{ animationDelay: `${(0.06 + index * 0.07).toFixed(2)}s` }}
          >
            <span className={styles.itemNumber}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.itemLabel}>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className={styles.footer}>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className={styles.whatsapp}>
          Falar no WhatsApp
        </a>
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          {EMAIL}
        </a>
      </div>
    </div>
  );
}
