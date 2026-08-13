import { WHATSAPP_URL } from '@/data/site';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import styles from './CtaSection.module.css';

export function CtaSection(): React.JSX.Element {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className="container">
        <Reveal variant="scale" className={styles.card}>
          <span className="eyebrow">Diagnóstico gratuito</span>
          <h2 id="cta-title">Em 10 minutos você descobre quanto cliente está passando batido.</h2>
          <p>
            Conta o que seu negócio faz e a gente aponta onde está o vazamento — de graça, sem
            proposta genérica. Se você não precisar de site agora, falamos isso na cara.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={21} />
            Falar no WhatsApp agora
          </a>
        </Reveal>
      </div>
    </section>
  );
}
