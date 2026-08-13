import { afterEach, describe, expect, it } from 'vitest';
import { readAccentColor } from './accent';

afterEach(() => {
  document.documentElement.style.removeProperty('--accent');
});

describe('readAccentColor', () => {
  it('lê o token roxo do CSS', () => {
    document.documentElement.style.setProperty('--accent', '#B89AD1');
    expect(readAccentColor()).toBe(0xb89ad1);
  });

  it('lê a variante dourada sem nenhuma mudança de código', () => {
    document.documentElement.style.setProperty('--accent', '#E9B872');
    expect(readAccentColor()).toBe(0xe9b872);
  });

  it('aceita hex de três dígitos', () => {
    document.documentElement.style.setProperty('--accent', '#abc');
    expect(readAccentColor()).toBe(0xaabbcc);
  });

  it('cai no padrão se o token estiver ausente ou inválido', () => {
    expect(readAccentColor()).toBe(0xb89ad1);
    document.documentElement.style.setProperty('--accent', 'rebeccapurple');
    expect(readAccentColor()).toBe(0xb89ad1);
  });
});
