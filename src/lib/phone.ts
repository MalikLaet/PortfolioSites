/** Quantidade mínima de dígitos aceita como número de WhatsApp válido. */
export const MIN_PHONE_DIGITS = 10;

/** Só os dígitos — é o que a validação conta e o que vai para o link. */
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Máscara de telefone brasileiro, aplicada a cada tecla.
 *
 * Celular (11 dígitos) vira `(11) 99999-9999` e fixo (10 dígitos) vira
 * `(11) 3333-4444`. O protótipo só previa o formato de celular, o que exibia
 * um fixo como `(11) 33334-444`; como a validação aceita 10 dígitos, os dois
 * formatos precisam sair certos.
 *
 * O separador só aparece quando existe dígito depois dele, para o campo não
 * mostrar um hífen solto no meio da digitação.
 */
export function maskPhone(raw: string): string {
  const digits = phoneDigits(raw).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;

  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  // 11 dígitos = celular com o 9 na frente; até 10 = fixo
  const headLength = digits.length > 10 ? 5 : 4;
  const head = rest.slice(0, headLength);
  const tail = rest.slice(headLength);

  if (!tail) return `(${area}) ${head}`;
  return `(${area}) ${head}-${tail}`;
}

export function isValidPhone(value: string): boolean {
  return phoneDigits(value).length >= MIN_PHONE_DIGITS;
}
