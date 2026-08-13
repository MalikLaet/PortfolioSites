/**
 * Dados de contato e navegação.
 *
 * Os valores de contato são os do handoff e devem ser usados exatamente assim.
 */

export const WHATSAPP_NUMBER = '5511999038780';
export const WHATSAPP_DISPLAY = '(11) 99903-8780';
export const EMAIL = 'isklikma@gmail.com';
export const LOCATION = 'São Paulo';
export const TIMEZONE = 'America/Sao_Paulo';

/** Texto padrão dos links diretos de WhatsApp do site. */
export const WHATSAPP_DEFAULT_TEXT = 'Olá, quero um site para meu negócio';

/** Link de WhatsApp com uma mensagem pré-escrita. */
export function whatsappLink(text: string = WHATSAPP_DEFAULT_TEXT): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_URL = whatsappLink();

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'trabalho', label: 'Trabalho' },
  { id: 'processo', label: 'Processo' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
] as const;

/** Seções contadas pelo medidor de leitura do rodapé. */
export const READABLE_SECTIONS = ['topo', 'trabalho', 'processo', 'sobre', 'contato'] as const;
