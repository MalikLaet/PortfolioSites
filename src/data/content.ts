/**
 * Conteúdo editorial das seções.
 *
 * Nada aqui pode ser inventado: números, depoimentos, nomes de cliente e datas
 * saem do handoff. As três estatísticas do hero foram confirmadas pelo cliente
 * — não alterar nem acrescentar outras.
 */

/* --- Faixa da stack --- */

export const STACK_ITEMS: readonly string[] = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'SEO local',
  'Core Web Vitals',
  'Mobile first',
  'Acessibilidade',
  'WhatsApp API',
  'Google Business',
  'Analytics',
] as const;

/* --- Estatísticas do hero --- */

export interface HeroStat {
  /** Quando presente, o número conta de 0 até aqui ao entrar em tela. */
  readonly countTo?: number;
  /** Texto fixo, para o valor que não é contável. */
  readonly value?: string;
  readonly suffix: string;
  readonly label: string;
}

export const HERO_STATS: readonly HeroStat[] = [
  { countTo: 20, suffix: '+', label: 'Projetos entregues' },
  { countTo: 100, suffix: '%', label: 'Clientes satisfeitos' },
  { value: '24', suffix: 'h', label: 'No ar, todo dia' },
] as const;

/* --- 02 · O custo de não ter --- */

export interface CostItem {
  readonly title: string;
  readonly body: string;
}

export const COST_ITEMS: readonly CostItem[] = [
  {
    title: 'Você não aparece na busca',
    body: 'Quem digita o seu serviço na sua cidade vê uma lista. Sem site, você não está nela.',
  },
  {
    title: 'Você repete preço o dia todo',
    body: 'Sem uma página que explique o serviço, cada cliente começa a conversa do zero com você.',
  },
  {
    title: 'Parece menor do que é',
    body: 'Só com perfil no Instagram, o cliente te compara com amador — e pechincha o seu preço.',
  },
  {
    title: 'Perde quem decide de noite',
    body: 'Quem resolve às 23h não manda DM esperando resposta. Ele procura e fecha com quem já está lá.',
  },
] as const;

/* --- 03 · Como funciona --- */

export interface ProcessStep {
  readonly title: string;
  /** Duração em dias — o total exibido na régua é a soma real destes valores. */
  readonly days: number;
  readonly durationLabel: string;
  readonly body: string;
}

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    title: 'Conversa',
    days: 1,
    durationLabel: '1 dia',
    body: 'Meia hora no WhatsApp ou na chamada para entender o negócio, o cliente e o que trava hoje.',
  },
  {
    title: 'Estrutura',
    days: 2,
    durationLabel: '2 dias',
    body: 'Definimos as seções, o texto e o caminho até o botão. Você aprova antes de existir design.',
  },
  {
    title: 'Construção',
    days: 7,
    durationLabel: '7 dias',
    body: 'Código escrito à mão, link de prévia atualizado todo dia. Você acompanha e comenta.',
  },
  {
    title: 'No ar',
    days: 1,
    durationLabel: '1 dia',
    body: 'Domínio, Google, Analytics e WhatsApp configurados. Depois, suporte quando precisar.',
  },
] as const;

/** 11 dias — soma real das durações, não um número escolhido a dedo. */
export const PROCESS_TOTAL_DAYS = PROCESS_STEPS.reduce((total, step) => total + step.days, 0);

/* --- 04 · Sobre / padrão-de-entrega --- */

export interface DeliverySpec {
  readonly label: string;
  readonly value: string;
}

export const DELIVERY_SPECS: readonly DeliverySpec[] = [
  { label: 'Velocidade', value: 'Abre em menos de 1,5s no 4G. Medimos antes de publicar.' },
  { label: 'Código', value: 'Escrito do zero. Sem tema, sem construtor, sem plugin pago.' },
  { label: 'Teste', value: 'Aparelho real na mão — não só a janelinha do navegador.' },
  { label: 'Propriedade', value: 'Código e domínio no nome da sua empresa, sempre.' },
  { label: 'Busca', value: 'Estrutura de SEO e Google Business configurados na entrega.' },
  { label: 'Suporte', value: '30 dias inclusos. Depois, sem contrato amarrado.' },
] as const;
