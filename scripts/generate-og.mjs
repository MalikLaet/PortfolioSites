/**
 * Gera as imagens derivadas da marca: apple-touch-icon e o card de Open Graph.
 *
 * O handoff lista favicon + og:image como pendência CRÍTICA — o site converte
 * por link compartilhado no WhatsApp, e hoje esse link chega cru.
 *
 * O card reproduz o hero: fundo escuro, grade técnica, headline em três linhas
 * com a última em --muted. A tipografia usa a fonte de sistema mais próxima da
 * Manrope disponível no gerador — é uma imagem estática de compartilhamento,
 * não faz parte do sistema tipográfico do site.
 *
 * Uso: npm run og
 */
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const OUT_DIR = 'public';

const ACCENT = '#B89AD1';
const BG = '#08080A';
const TEXT = '#FAFAFA';
const MUTED = '#8B8B94';
const SANS = 'Segoe UI, Manrope, Inter, system-ui, sans-serif';
const MONO = 'Consolas, JetBrains Mono, monospace';

/** O glifo `</>` da marca, desenhado em traços para não depender de fonte. */
function logoMark(x, y, size) {
  const s = size / 32;
  const t = (n) => (n * s).toFixed(2);
  return `
    <g transform="translate(${x},${y})">
      <rect width="${size}" height="${size}" rx="${t(7)}" fill="none"
            stroke="rgba(255,255,255,.16)" stroke-width="${t(1.2)}"/>
      <g fill="none" stroke="${TEXT}" stroke-width="${t(2)}"
         stroke-linecap="round" stroke-linejoin="round">
        <polyline points="${t(11.6)},${t(11.4)} ${t(7.6)},${t(16)} ${t(11.6)},${t(20.6)}"/>
        <line x1="${t(18.6)}" y1="${t(10.4)}" x2="${t(13.4)}" y2="${t(21.6)}"/>
        <polyline points="${t(20.4)},${t(11.4)} ${t(24.4)},${t(16)} ${t(20.4)},${t(20.6)}"/>
      </g>
    </g>`;
}

function ogSvg() {
  const W = 1200;
  const H = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="34%" r="70%">
      <stop offset="0%" stop-color="rgba(255,255,255,.07)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <pattern id="grid" width="88" height="88" patternUnits="userSpaceOnUse">
      <path d="M88 0H0V88" fill="none" stroke="rgba(255,255,255,.03)" stroke-width="1"/>
    </pattern>
    <radialGradient id="gridFade" cx="50%" cy="45%" r="62%">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="78%" stop-color="#000"/>
    </radialGradient>
    <mask id="gridMask">
      <rect width="${W}" height="${H}" fill="url(#gridFade)"/>
    </mask>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" mask="url(#gridMask)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  ${logoMark(72, 64, 40)}
  <text x="126" y="93" font-family="${SANS}" font-size="26" font-weight="700"
        letter-spacing="-0.5" fill="${TEXT}">DevSites</text>

  <g font-family="${SANS}" font-size="76" font-weight="700" letter-spacing="-3.4">
    <text x="72" y="290" fill="${TEXT}">Todo dia alguém</text>
    <text x="72" y="368" fill="${TEXT}">procura o que você faz</text>
    <text x="72" y="446" fill="${MUTED}">e acha outro.</text>
  </g>

  <rect x="72" y="516" width="46" height="2" rx="1" fill="${ACCENT}"/>
  <text x="72" y="562" font-family="${MONO}" font-size="19" letter-spacing="3.4"
        fill="${MUTED}">ESTÚDIO DE CÓDIGO · SÃO PAULO</text>
</svg>`;
}

/** Ícone de app: o mesmo glifo, com respiro maior para o recorte do iOS. */
function touchIconSvg() {
  const S = 180;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${BG}"/>
  <g fill="none" stroke="${ACCENT}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="68,58 40,90 68,122"/>
    <line x1="112" y1="52" x2="76" y2="128"/>
    <polyline points="112,58 140,90 112,122"/>
  </g>
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  await sharp(Buffer.from(ogSvg())).png({ compressionLevel: 9 }).toFile(`${OUT_DIR}/og-image.png`);
  console.log('public/og-image.png  1200x630');

  await sharp(Buffer.from(touchIconSvg()))
    .png({ compressionLevel: 9 })
    .toFile(`${OUT_DIR}/apple-touch-icon.png`);
  console.log('public/apple-touch-icon.png  180x180');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
