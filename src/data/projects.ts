export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly businessType: string;
  readonly description: string;
  readonly result: string;
  readonly tags: readonly string[];
  readonly url: string;
  /** Domínio exibido no bloco "Ver ao vivo". */
  readonly domain: string;
  /** Recorte do topo da página, usado no card de fallback. */
  readonly card: { readonly src: string; readonly srcSet: string };
  /** Página inteira, usada como textura na cena 3D. */
  readonly texture: string;
  readonly alt: string;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'neural-bots',
    name: 'NeuralBot',
    category: 'SaaS',
    businessType: 'Chatbots de IA',
    description:
      'Tinham um produto bom e nenhum lugar para explicá-lo. Montamos o site institucional e a página de captura que qualifica o lead antes de virar conversa.',
    result: 'Base pronta para escalar campanhas sem refazer o site.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Conversão'],
    url: 'https://neural-bots.vercel.app/',
    domain: 'neural-bots.vercel.app',
    card: {
      src: '/assets/neural-bots-card-1280.webp',
      srcSet: '/assets/neural-bots-card-640.webp 640w, /assets/neural-bots-card-1280.webp 1280w',
    },
    texture: '/assets/neural-bots-full.webp',
    alt: 'Site institucional da NeuralBot',
  },
  {
    slug: 'outleteletro',
    name: 'OutletEletro',
    category: 'Local',
    businessType: 'Assistência técnica',
    description:
      'Vivia de indicação e sumia da busca. Estruturamos as páginas por serviço e por bairro, com o WhatsApp a um toque de qualquer ponto da tela.',
    result: 'Passou a ser encontrado no Google pela própria região.',
    tags: ['SEO local', 'Responsivo', 'WhatsApp', 'Maps'],
    url: 'https://outleteletro.com/',
    domain: 'outleteletro.com',
    card: {
      src: '/assets/outleteletro-card-1280.webp',
      srcSet: '/assets/outleteletro-card-640.webp 640w, /assets/outleteletro-card-1280.webp 1280w',
    },
    texture: '/assets/outleteletro-full.webp',
    alt: 'Site da OutletEletro, assistência técnica',
  },
  {
    slug: 'site-trust',
    name: 'TrustDetail',
    category: 'Premium',
    businessType: 'Estética automotiva',
    description:
      'Serviço caro com cara de barato na internet. Refizemos a imagem digital em torno das fotos de antes e depois, e o orçamento virou um botão só.',
    result: 'Preço deixou de ser a primeira pergunta do cliente.',
    tags: ['Galeria', 'Agendamento', 'Branding'],
    url: 'https://trust-detail-three.vercel.app/',
    domain: 'trust-detail-three.vercel.app',
    card: {
      src: '/assets/site-trust-card-1280.webp',
      srcSet: '/assets/site-trust-card-640.webp 640w, /assets/site-trust-card-1280.webp 1280w',
    },
    texture: '/assets/site-trust-full.webp',
    alt: 'Site da TrustDetail, estética automotiva',
  },
] as const;
