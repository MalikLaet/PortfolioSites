import { useEffect, useRef, useState } from 'react';
import { EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/data/site';
import { buildLeadLink, buildPreviewLines, type LeadFields } from '@/lib/whatsapp';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  MailIcon,
  WhatsAppIcon,
} from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import styles from './ContactSection.module.css';

const EMPTY_FIELDS: LeadFields = { name: '', business: '', message: '' };

function validationMessage(step: number, fields: LeadFields): string {
  if (step === 0 && !fields.name.trim()) return 'Me conta seu nome antes de continuar.';
  if (step === 2 && !fields.message.trim()) return 'Escreve rapidinho o que você precisa.';
  return '';
}

export function ContactSection(): React.JSX.Element {
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<LeadFields>(EMPTY_FIELDS);
  const [error, setError] = useState('');
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const fieldRefs = useRef<Array<HTMLInputElement | HTMLTextAreaElement | null>>([]);
  const shouldFocusField = useRef(false);

  useEffect(() => {
    if (!success && shouldFocusField.current) fieldRefs.current[step]?.focus();
  }, [step, success]);

  const updateField = (key: keyof LeadFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (error) {
      setError('');
      setErrorStep(null);
    }
  };

  const showError = (message: string) => {
    setError(message);
    setErrorStep(step);
    setShaking(false);
    requestAnimationFrame(() => setShaking(true));
  };

  const submit = () => {
    const message = validationMessage(2, fields);
    if (message) {
      showError(message);
      return;
    }
    window.open(buildLeadLink(fields), '_blank', 'noopener,noreferrer');
    setSuccess(true);
  };

  const advance = () => {
    const message = validationMessage(step, fields);
    if (message) {
      showError(message);
      return;
    }
    setError('');
    setErrorStep(null);
    if (step === 2) submit();
    else {
      shouldFocusField.current = true;
      setStep((current) => current + 1);
    }
  };

  const reset = () => {
    setFields(EMPTY_FIELDS);
    shouldFocusField.current = true;
    setStep(0);
    setError('');
    setErrorStep(null);
    setSuccess(false);
  };

  const onFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    advance();
  };

  const previewLines = buildPreviewLines(fields, step);

  return (
    <section className={styles.section} id="contato">
      <div className={`container ${styles.layout}`}>
        <Reveal variant="left" className={styles.copy}>
          <span className="eyebrow">05 — Contato</span>
          <h2>Prefere escrever? Também funciona.</h2>
          <p>
            Conta o essencial por aqui. A mensagem já sai organizada no WhatsApp e a conversa
            começa sem formulário perdido nem resposta automática.
          </p>
          <div className={styles.channels}>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <span><WhatsAppIcon size={20} color="var(--whatsapp)" /></span>
              <span><small>WhatsApp</small><strong>{WHATSAPP_DISPLAY}</strong></span>
              <ArrowRightIcon />
            </a>
            <a href={`mailto:${EMAIL}`}>
              <span><MailIcon /></span>
              <span><small>E-mail</small><strong>{EMAIL}</strong></span>
              <ArrowRightIcon />
            </a>
          </div>
        </Reveal>

        <Reveal variant="right" className={styles.formCard}>
          {success ? (
            <div className={styles.success}>
              <span className={styles.successIcon}><CheckIcon size={28} color="var(--whatsapp)" /></span>
              <h3>Mensagem pronta</h3>
              <p>Abrimos o WhatsApp em outra aba com tudo preenchido. É só apertar enviar.</p>
              <button type="button" onClick={reset}>Preencher de novo</button>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); advance(); }} noValidate>
              <div className={styles.formHeader}>
                <strong>Conte mais sobre o seu projeto</strong>
                <span>Passo {step + 1}/3</span>
              </div>
              <div className={styles.progress} aria-hidden="true">
                <span style={{ width: `${((step + 1) / 3) * 100}%` }} />
              </div>

              <div className={styles.preview} aria-live="polite">
                <div><WhatsAppIcon size={15} color="var(--whatsapp)" /><span>Prévia da mensagem</span></div>
                {previewLines.length > 0 ? (
                  <p>{previewLines.map((line) => <span key={line}>{line}</span>)}<i aria-hidden="true" /></p>
                ) : (
                  <p className={styles.previewEmpty}>Vai aparecer aqui conforme você preenche…<i aria-hidden="true" /></p>
                )}
              </div>

              <div className={styles.viewport}>
                <div
                  className={`${styles.track} ${shaking ? styles.trackShaking : ''}`}
                  style={{ transform: `translateX(-${step * 100}%)` }}
                  onAnimationEnd={() => setShaking(false)}
                >
                  <div className={styles.fieldPanel} aria-hidden={step !== 0}>
                    <label htmlFor="lead-name"><span aria-hidden="true">01 · Nome</span>Como podemos te chamar?</label>
                    <input
                      id="lead-name"
                      ref={(element) => { fieldRefs.current[0] = element; }}
                      value={fields.name}
                      onChange={(event) => updateField('name', event.target.value)}
                      onKeyDown={onFieldKeyDown}
                      autoComplete="name"
                      placeholder="Seu nome"
                      tabIndex={step === 0 ? 0 : -1}
                    />
                  </div>
                  <div className={styles.fieldPanel} aria-hidden={step !== 1}>
                    <label htmlFor="lead-business"><span aria-hidden="true">02 · Negócio</span>O que você vende ou faz?</label>
                    <input
                      id="lead-business"
                      ref={(element) => { fieldRefs.current[1] = element; }}
                      value={fields.business}
                      onChange={(event) => updateField('business', event.target.value)}
                      onKeyDown={onFieldKeyDown}
                      placeholder="Ex.: clínica, oficina, consultoria"
                      tabIndex={step === 1 ? 0 : -1}
                    />
                  </div>
                  <div className={styles.fieldPanel} aria-hidden={step !== 2}>
                    <label htmlFor="lead-message"><span aria-hidden="true">03 · O que você precisa</span>Me conta rapidinho</label>
                    <textarea
                      id="lead-message"
                      ref={(element) => { fieldRefs.current[2] = element; }}
                      value={fields.message}
                      onChange={(event) => updateField('message', event.target.value)}
                      onKeyDown={onFieldKeyDown}
                      placeholder="O que você quer melhorar ou construir?"
                      rows={3}
                      tabIndex={step === 2 ? 0 : -1}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.error} role={error && errorStep === step ? 'alert' : undefined}>
                {error && errorStep === step ? error : ''}
              </div>

              <div className={styles.controls}>
                {step > 0 ? (
                  <button className={styles.back} type="button" onClick={() => { setError(''); setErrorStep(null); shouldFocusField.current = true; setStep((current) => current - 1); }} aria-label="Voltar uma etapa">
                    <ArrowLeftIcon />
                  </button>
                ) : <span />}
                <div>
                  {step === 1 ? <button className={styles.skip} type="button" onClick={advance}>Pular</button> : null}
                  <button className={styles.next} type="submit" data-fab-target>
                    {step === 2 ? <><WhatsAppIcon size={18} color="var(--whatsapp)" /> Enviar pelo WhatsApp</> : <>Continuar <ArrowRightIcon /></>}
                  </button>
                </div>
              </div>
              <p className={styles.privacy}>Abre o WhatsApp com a mensagem já escrita. Nada é armazenado aqui.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
