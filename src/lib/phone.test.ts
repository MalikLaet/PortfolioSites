import { describe, expect, it } from 'vitest';
import { isValidPhone, maskPhone, phoneDigits } from './phone';

describe('maskPhone', () => {
  it('abre o parêntese assim que o DDD começa a ser digitado', () => {
    expect(maskPhone('1')).toBe('(1');
    expect(maskPhone('11')).toBe('(11');
  });

  it('fecha o DDD e começa o prefixo', () => {
    expect(maskPhone('119')).toBe('(11) 9');
    expect(maskPhone('11999')).toBe('(11) 999');
  });

  it('não mostra hífen solto enquanto não há dígito depois dele', () => {
    expect(maskPhone('119990')).toBe('(11) 9990');
    expect(maskPhone('1199903')).toBe('(11) 9990-3');
  });

  it('formata celular de 11 dígitos', () => {
    expect(maskPhone('11999038780')).toBe('(11) 99903-8780');
  });

  it('formata fixo de 10 dígitos', () => {
    expect(maskPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('descarta o que passar de 11 dígitos', () => {
    expect(maskPhone('119990387801234')).toBe('(11) 99903-8780');
  });

  it('ignora qualquer caractere que não seja dígito', () => {
    expect(maskPhone('(11) 99903-8780')).toBe('(11) 99903-8780');
    expect(maskPhone('+55 11 99903 8780')).toBe('(55) 11999-0387');
  });

  it('devolve string vazia quando não há dígito nenhum', () => {
    expect(maskPhone('')).toBe('');
    expect(maskPhone('abc')).toBe('');
  });

  it('é idempotente — remascarar o valor já mascarado não muda nada', () => {
    const once = maskPhone('11999038780');
    expect(maskPhone(once)).toBe(once);
  });
});

describe('phoneDigits', () => {
  it('extrai só os dígitos', () => {
    expect(phoneDigits('(11) 99903-8780')).toBe('11999038780');
  });
});

describe('isValidPhone', () => {
  it('aceita a partir de 10 dígitos', () => {
    expect(isValidPhone('(11) 3333-4444')).toBe(true);
    expect(isValidPhone('(11) 99903-8780')).toBe(true);
  });

  it('recusa abaixo de 10 dígitos', () => {
    expect(isValidPhone('(11) 9990')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
});
