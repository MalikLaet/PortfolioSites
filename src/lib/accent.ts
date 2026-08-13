/** Fallback igual ao token — usado só se o CSS ainda não estiver aplicado. */
const FALLBACK = 0xb89ad1;

/**
 * Lê `--accent` do CSS como inteiro, para as cenas three.js.
 *
 * A alternativa seria repetir o hex no JS, e aí trocar a variante de acento
 * deixaria de ser a edição de uma linha só que o handoff pede.
 */
export function readAccentColor(): number {
  if (typeof getComputedStyle !== 'function') return FALLBACK;

  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(raw);
  if (!match) return FALLBACK;

  const hex = match[1]!;
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  return Number.parseInt(full, 16);
}
