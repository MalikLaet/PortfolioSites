import { describe, expect, it } from 'vitest';
import { buildLeadLink, buildLeadMessage, buildPreviewLines, type LeadFields } from './whatsapp';

const base: LeadFields = {
  name: 'Ana',
  business: 'Barbearia',
  message: 'Preciso de um site.',
};

describe('buildLeadMessage', () => {
  it('monta a mensagem no formato acordado', () => {
    expect(buildLeadMessage(base)).toBe(
      'Olá! Vim pelo site.\n' +
        '\n' +
        '*Nome:* Ana\n' +
        '*Negócio:* Barbearia\n' +
        '\n' +
        '*Mensagem:*\n' +
        'Preciso de um site.',
    );
  });

  it('omite a linha de negócio quando o passo foi pulado', () => {
    const message = buildLeadMessage({ ...base, business: '   ' });
    expect(message).not.toContain('Negócio');
    expect(message).toContain('*Nome:* Ana\n\n*Mensagem:*');
  });

  it('remove espaço sobrando nas pontas dos campos', () => {
    const message = buildLeadMessage({ ...base, name: '  Ana  ', message: '  Oi  ' });
    expect(message).toContain('*Nome:* Ana\n');
    expect(message).toMatch(/Oi$/);
  });
});

describe('buildLeadLink', () => {
  it('aponta para o número do handoff com o texto codificado', () => {
    const link = buildLeadLink(base);
    expect(link.startsWith('https://wa.me/5511925780617?text=')).toBe(true);

    const text = decodeURIComponent(link.split('?text=')[1] ?? '');
    expect(text).toBe(buildLeadMessage(base));
  });

  it('codifica quebras de linha e acentos, sem deixá-los crus na URL', () => {
    const link = buildLeadLink(base);
    expect(link).not.toContain('\n');
    expect(link).not.toContain('á');
  });
});

describe('buildPreviewLines', () => {
  it('não mostra nada antes de qualquer preenchimento', () => {
    const empty: LeadFields = { name: '', business: '', message: '' };
    expect(buildPreviewLines(empty, 0)).toEqual([]);
  });

  it('mostra só o que já foi preenchido até o passo atual', () => {
    expect(buildPreviewLines(base, 0)).toEqual(['Nome: Ana']);
    expect(buildPreviewLines(base, 1)).toEqual(['Nome: Ana', 'Negócio: Barbearia']);
  });

  it('inclui todos os campos no último passo', () => {
    expect(buildPreviewLines(base, 2)).toEqual([
      'Nome: Ana',
      'Negócio: Barbearia',
      'Mensagem: Preciso de um site.',
    ]);
  });

  it('pula campo em branco mesmo com o passo já alcançado', () => {
    expect(buildPreviewLines({ ...base, business: '' }, 2)).toEqual([
      'Nome: Ana',
      'Mensagem: Preciso de um site.',
    ]);
  });
});
