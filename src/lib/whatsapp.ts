import { whatsappLink } from '@/data/site';

export interface LeadFields {
  readonly name: string;
  readonly phone: string;
  /** Opcional — o passo 3 do wizard pode ser pulado. */
  readonly business: string;
  readonly message: string;
}

/**
 * Monta a mensagem que o visitante vai enviar.
 *
 * Os asteriscos são a sintaxe de negrito do próprio WhatsApp. O campo de
 * negócio some da mensagem quando fica vazio, em vez de virar uma linha solta.
 */
export function buildLeadMessage(fields: LeadFields): string {
  const business = fields.business.trim();
  const lines = [
    'Olá! Vim pelo site.',
    '',
    `*Nome:* ${fields.name.trim()}`,
    `*WhatsApp:* ${fields.phone.trim()}`,
    ...(business ? [`*Negócio:* ${business}`] : []),
    '',
    '*Mensagem:*',
    fields.message.trim(),
  ];
  return lines.join('\n');
}

export function buildLeadLink(fields: LeadFields): string {
  return whatsappLink(buildLeadMessage(fields));
}

/**
 * Prévia mostrada ao vivo no formulário: só os campos já preenchidos, e só até
 * o passo em que o visitante chegou — o que ele ainda não viu não aparece.
 */
export function buildPreviewLines(fields: LeadFields, step: number): string[] {
  const entries: Array<[number, string, string]> = [
    [0, 'Nome', fields.name],
    [1, 'WhatsApp', fields.phone],
    [2, 'Negócio', fields.business],
    [3, 'Mensagem', fields.message],
  ];
  return entries
    .filter(([atStep, , value]) => step >= atStep && value.trim() !== '')
    .map(([, label, value]) => `${label}: ${value.trim()}`);
}
