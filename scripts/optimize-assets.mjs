/**
 * Gera as versões publicáveis dos screenshots dos projetos.
 *
 * Os originais em `assets/` são capturas de página inteira (1920 × 7000–9000px,
 * ~12MB somados). Eles servem a dois usos com necessidades opostas:
 *
 *  - card de fallback: um mockup de navegador que mostra só o TOPO do site.
 *    Um recorte 16:10 do topo é mais nítido e ~50× mais leve que a página toda.
 *  - textura 3D: a cena percorre a página inteira verticalmente, então precisa
 *    da altura completa — mas a altura original passa do limite de textura de
 *    4096px de boa parte das GPUs, onde ela seria rejeitada ou reamostrada.
 *
 * Por isso são dois arquivos por projeto, e não um.
 *
 * Uso: npm run assets
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'assets';
const OUT_DIR = 'public/assets';

/** Limite seguro de textura para WebGL em GPUs de entrada. */
const MAX_TEXTURE_PX = 4096;
/** Aspecto da área de tela do card de navegador do fallback. */
const CARD_ASPECT = 16 / 10;
/** Larguras do srcset do card (1× e 2× para um card de ~640px). */
const CARD_WIDTHS = [640, 1280];

const SOURCES = ['neural-bots.png', 'outleteletro.png', 'site-trust.png'];

async function buildCard(file, slug) {
  const input = join(SRC_DIR, file);
  const { width, height } = await sharp(input).metadata();

  // recorta o topo da página no aspecto do card, sem esticar nada
  const cropHeight = Math.min(Math.round(width / CARD_ASPECT), height);

  const outputs = [];
  for (const w of CARD_WIDTHS) {
    const base = sharp(input)
      .extract({ left: 0, top: 0, width, height: cropHeight })
      .resize({ width: w });

    const webp = join(OUT_DIR, `${slug}-card-${w}.webp`);
    await base.clone().webp({ quality: 82, effort: 6 }).toFile(webp);
    outputs.push(webp);

    // fallback para navegadores sem WebP (raro, mas o custo é baixo)
    const jpg = join(OUT_DIR, `${slug}-card-${w}.jpg`);
    await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpg);
    outputs.push(jpg);
  }
  return outputs;
}

async function buildTexture(file, slug) {
  const input = join(SRC_DIR, file);
  const { width, height } = await sharp(input).metadata();

  // cabe dentro do limite de textura preservando a proporção da página
  const scale = Math.min(MAX_TEXTURE_PX / height, 1);
  const texWidth = Math.round(width * scale);
  const texHeight = Math.round(height * scale);

  const out = join(OUT_DIR, `${slug}-full.webp`);
  await sharp(input)
    .resize({ width: texWidth, height: texHeight })
    .webp({ quality: 80, effort: 6 })
    .toFile(out);

  return { out, texWidth, texHeight };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let originalBytes = 0;
  let outputBytes = 0;

  for (const file of SOURCES) {
    const slug = file.replace(/\.png$/, '');
    const { size } = await stat(join(SRC_DIR, file));
    originalBytes += size;

    const cards = await buildCard(file, slug);
    const { out, texWidth, texHeight } = await buildTexture(file, slug);

    for (const f of [...cards, out]) {
      outputBytes += (await stat(f)).size;
    }

    console.log(`${slug}: card ×${CARD_WIDTHS.length} + textura ${texWidth}×${texHeight}`);
  }

  const mb = (n) => (n / 1048576).toFixed(2);
  console.log(
    `\noriginais ${mb(originalBytes)}MB -> publicados ${mb(outputBytes)}MB ` +
      `(${Math.round((1 - outputBytes / originalBytes) * 100)}% menor)`,
  );

  const written = await readdir(OUT_DIR);
  console.log(`${written.length} arquivos em ${OUT_DIR}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
