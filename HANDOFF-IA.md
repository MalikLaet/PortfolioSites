# Handoff para a próxima IA — redesign do site DevSites

Este documento é o prompt de continuação. Leia inteiro antes de escrever código.

---

## 1. O que é este projeto

`d:\Projetos\PortfolioSites` — landing page única da **DevSites**, estúdio de código
freelance brasileiro que vende sites institucionais e landing pages para pequenos e
médios negócios. A conversão acontece no WhatsApp. O objetivo declarado do site é
**provar autoridade técnica e impressionar**, não gerar volume de contato.

A página é escura, tipográfica, com um único acento de cor e movimento presente mas
contido. O eixo da copy é **o custo de não ter site**, não a lista de features.

### Fonte da verdade do design

A pasta `Redesign do site DevSites/design_handoff_devsites/` contém o handoff original:

| Arquivo | O que é |
|---|---|
| `README.md` | **Especificação completa** — cores, tipografia, espaçamentos, durações, easings, comportamento de cada seção, acessibilidade, performance. Leia inteiro. |
| `PROMPT.md` | Prompt original entregue ao cliente |
| `DevSites.dc.html` | Protótipo, acento dourado — **referência de design, não código de produção** |
| `DevSites Roxo.dc.html` | Protótipo, acento roxo — idêntico, só troca a cor |
| `support.js` | Runtime do protótipo — **nunca usar em produção** |
| `referencia-site-atual/` | Site antigo que estava no ar (HTML/CSS/JS puro) |

Os `.dc.html` rodam num runtime de protótipo (`<x-dc>`, `<sc-if>`, `<sc-for>`, estilos
100% inline). **A lógica JavaScript deles dentro de `<script type="text/x-dc">` é a
referência de comportamento mais precisa que existe** — os números de animação, os
thresholds e a matemática de scroll saem de lá. Consulte esse bloco sempre que for
implementar uma interação.

---

## 2. Decisões já tomadas com o cliente — NÃO reabrir

| Decisão | Valor | Observação |
|---|---|---|
| **Acento** | **Roxo `#B89AD1`** (`--accent-rgb: 184, 154, 209`) | Confirmado pelo usuário. A variante dourada `#E9B872` existe no protótipo mas foi descartada. |
| **Stack** | **React 18 + TypeScript + Vite**, sem framework | O handoff sugeria HTML/CSS/JS puro; o usuário pediu explicitamente TypeScript + React. Não há SSR nem router — é página única. |
| **Testes** | **Vitest + Testing Library** (jsdom) | Sem Playwright/E2E. O usuário pediu teste "a cada passo que veja necessário". |
| **Deploy** | **Vercel**, na raiz do domínio | `base: '/'` no `vite.config.ts`. O projeto já está na Vercel. |

### Regras de conteúdo que não podem ser violadas

- **Não invente nada**: números, depoimentos, nomes de cliente ou datas que não estejam
  no `README.md` do handoff.
- As três estatísticas do hero (`20+`, `100%`, `24h`) foram confirmadas como reais pelo
  cliente. **Não alterar e não acrescentar outras.**
- Nada de escassez inventada (datas fixas, contagem de vagas) — foi removido de propósito.
- Voz: primeira pessoa do plural ("nós", "montamos", "a gente"). Sem jargão de marketing,
  sem emoji.
- Contato exato: WhatsApp `+55 11 99903-8780` → `https://wa.me/5511999038780`,
  e-mail `isklikma@gmail.com`, local exibido "São Paulo".

---

## 3. Estado atual — verificado agora

```
npx vitest run     ->  97 testes passando, 16 arquivos ✅
npx tsc --noEmit   ->  0 erros                          ✅
npx vite build     ->  concluído                        ✅
```

O typecheck foi zerado antes da continuação das seções. Faixa de tecnologias, Trabalho
(3D no desktop e fallback responsivo), Processo, Sobre, CTA intermediário, Contato,
rodapé e FAB do WhatsApp estão implementados, testados e integrados. A revisão visual
foi feita em 390px, 768px e 1440px sem erros de runtime no navegador. A seção
“O custo de não ter” continua deliberadamente fora da integração até o cliente confirmar
se a execução final deve ser a SERP simulada ou as quatro células intermediárias.

### Erros que foram corrigidos

**a) `src/components/three/HeroScene.tsx` — bug real de runtime**

O arquivo tem duas coisas chamadas `frame`: a função `const frame = () => {...}` que
monta a moldura de arame das camadas, e a variável do `requestAnimationFrame`. Renomeei a
variável para `animationFrame` e o cleanup agora chama
`cancelAnimationFrame(animationFrame)`, cancelando corretamente o loop ao desmontar.

**b) `src/components/sections/Hero.tsx` — tipagem do ref**

Em `src/hooks/useInView.ts` a assinatura de retorno está anotada como
`[RefObject<T>, boolean]`, compatível com o retorno de `useRef<T>(null)` nos tipos do
React 18.

**c) `vite.config.ts` — tipagem da configuração do Vitest**

`@types/node` foi adicionado às devDependencies e `defineConfig` agora vem de
`vitest/config`, que reconhece a chave `test`.

**d) `Header.test.tsx` e `hooks.test.tsx` — casts incompletos**

Os casts foram removidos: `MockIntersectionObserver.trigger` já aceita
`Partial<IntersectionObserverEntry>[]`, portanto as entradas parciais são tipadas no
ponto correto sem coerção dupla.

### Decisão sobre `baseUrl` no `tsconfig.json`

Ficou decidido remover `baseUrl`: desde o TypeScript 5, `paths` resolve os valores em
relação ao próprio `tsconfig`, e o alias já está como `"@/*": ["./src/*"]`. Isso preserva
o comportamento atual, mantém o alias do Vite independente e elimina a depreciação que
será incompatível com o TypeScript 7. **Não reabrir esta decisão.**

---

## 4. O que já está construído

### Configuração e tooling

| Arquivo | Estado |
|---|---|
| `package.json` | Vite 6.4.3, React 18.3, TS 5.9, Vitest 4.1.10, three 0.170, sharp 0.35.3. **0 vulnerabilidades** (`npm audit`). |
| `tsconfig.json` | strict + `exactOptionalPropertyTypes`. `noUncheckedIndexedAccess` está **desligado de propósito** — a declaração de CSS Modules do Vite é uma index signature, então com ele ligado todo `styles.x` vira `string \| undefined` e exigiria `!` em cada className. |
| `vite.config.ts` | `base:'/'`, plugin react, alias `@` → `src`, `manualChunks` separando o three e configuração do Vitest tipada por `vitest/config`. |
| `vitest.setup.ts` | Mocks de `IntersectionObserver` (com `trigger`), `ResizeObserver` e `matchMedia`. Exporta `triggerIntersection`, `getIntersectionObservers`, `setMatchMedia`, `setReducedMotion`, `setViewportWidth`. |
| `index.html` | Entry do Vite. SEO, Open Graph completo, `twitter:card`, favicon, apple-touch-icon, JSON-LD `ProfessionalService`. |

### Scripts de asset (já executados, saída commitável em `public/`)

- `npm run assets` → `scripts/optimize-assets.mjs`.
  Os originais em `assets/` são capturas de página inteira (1920 × 7000–9000px, 12,16 MB).
  O script gera dois derivados por projeto porque os dois usos têm necessidades opostas:
  - `*-card-640.webp` / `*-card-1280.webp` (+ `.jpg`): **recorte 16:10 do topo**, para o
    card de navegador do fallback, que só mostra o topo do site.
  - `*-full.webp`: página inteira **com altura limitada a 4096px**, para a textura 3D.
    Este limite não é estético: a altura original passa do teto de textura de boa parte
    das GPUs, onde seria rejeitada ou reamostrada.

  Resultado: **12,16 MB → 0,87 MB (93% menor)**.
- `npm run og` → `scripts/generate-og.mjs`. Gera `public/og-image.png` (1200×630) e
  `public/apple-touch-icon.png`. O handoff lista favicon + og:image como pendência
  **crítica** (o site vive de link compartilhado no WhatsApp e o link chegava cru).
  `public/favicon.svg` foi escrito à mão. O texto do OG usa fonte de sistema porque o
  gerador não tem a Manrope instalada. **Decisão:** isto está aprovado e não bloqueia a
  entrega; o card é um raster estático fora da interface do site e deve continuar
  determinístico sem depender das fontes instaladas na máquina.

### Estilos globais

- `src/styles/tokens.css` — todos os design tokens. **O acento está isolado em
  `--accent` + `--accent-rgb`; trocar a variante é editar essas duas linhas e nada mais.**
  `--accent-rgb` existe porque quase todo uso é com alpha.
- `src/styles/base.css` — reset, tipografia base, scrollbar, `::selection`, `.container`,
  `.eyebrow`, `:focus-visible`, `scroll-margin-top: 88px`, bloco de `prefers-reduced-motion`.
- `src/styles/animations.css` — keyframes globais: `marquee`, `dotPulse`, `menuIn`,
  `menuItem`, `blink`, `popIn`, `stackScan`, `stackFloat`, `scrollCue`, `shake`.

### Camada de dados (tipada, sem conteúdo hardcoded nos componentes)

- `src/data/site.ts` — contatos, `whatsappLink()`, `NAV_ITEMS`, `READABLE_SECTIONS`.
- `src/data/projects.ts` — os três projetos com `card.srcSet`, `texture`, `alt`, `domain`.
- `src/data/content.ts` — `STACK_ITEMS`, `HERO_STATS`, `COST_ITEMS`, `PROCESS_STEPS`
  (+ `PROCESS_TOTAL_DAYS` calculado, = 11), `DELIVERY_SPECS`.

### Lógica pura (`src/lib/`) — toda testada

| Arquivo | O que faz |
|---|---|
| `phone.ts` | Máscara BR. **Melhoria consciente sobre o protótipo:** ele só previa celular de 11 dígitos e exibia um fixo de 10 como `(11) 33334-444`; como a validação aceita 10 dígitos, aqui os dois formatos saem certos. Também não mostra hífen solto durante a digitação. |
| `whatsapp.ts` | `buildLeadMessage`, `buildLeadLink`, `buildPreviewLines`. |
| `reveal.ts` | Observer **singleton** dos reveals. Ver seção 6. |
| `accent.ts` | Lê `--accent` do CSS como inteiro para as cenas three.js, para não duplicar o hex no JS. |

### Hooks (`src/hooks/`)

`useMediaQuery.ts` (+ `BREAKPOINTS`, `useMaxWidth`, `useMinWidth`,
`usePrefersReducedMotion`), `useInView.ts`, `useScrollEffect.ts` (+ `readScrollProgress`),
`useCountUp.ts`, `useScrollSpy.ts`, `useClock.ts` (+ `useElapsedTime`), `useMagnetic.ts`.

### Componentes prontos

| Componente | Cobre |
|---|---|
| `ui/Icons.tsx` | Todos os SVG inline (WhatsApp, setas, chevrons, check, mail, menu, close, link externo). Sem biblioteca de ícones e sem emoji, por exigência do handoff. |
| `ui/Reveal.tsx` + css | Wrapper de entrada. Variantes `up` `rise` `left` `right` `scale` `wipe`. |
| `layout/Header.tsx` + css | Cápsula com dois estados (condensa em `scrollY > 40`), logo que gira −90° no hover, pílula de scrollspy que desliza, relógio ao vivo (≥1180px), CTA magnético, botão de menu, barra de progresso de leitura. |
| `layout/MobileMenu.tsx` + css | Overlay full-screen, cascata dos itens, trava de scroll, **foco preso** e Escape para fechar. |
| `sections/Hero.tsx` + css | H1 em três linhas com revelação por máscara, subtítulo, dois botões, stats com contador, monta a cena 3D só ≥900px e sem reduced-motion. |
| `sections/MobileStack.tsx` + css | Peça CSS 3D exclusiva do mobile (<900px) — quatro camadas que inclinam e se juntam ao rolar. |
| `sections/ScrollCue.tsx` + css | "Role para ver". Só aparece **se o hero couber na viewport**; remede 900ms depois do load. |
| `three/HeroScene.tsx` + css | Site explodido em 4 camadas de metal, varredura de acento, pointer suavizado, loop pausado fora da tela. Carregado com `lazy`. Cleanup do rAF corrigido. |
| `App.tsx`, `main.tsx` | Shell. Hoje monta **apenas** Header + MobileMenu + Hero. |

---

## 5. O que falta construir

Em ordem sugerida. Cada item tem a seção correspondente do `README.md` do handoff, que
traz medidas, cores e comportamento exatos. **Sempre confira também o bloco
`<script type="text/x-dc">` do `DevSites Roxo.dc.html` para a matemática das interações.**

0. ~~**Zerar o typecheck**~~ — concluído; seção 3 registra as correções.

1. **Faixa da stack** — marquee infinito, `README.md` › "Faixa da stack".
   Duas listas idênticas (a segunda `aria-hidden`), `animation: marquee 38s linear infinite`.
   Dados já em `STACK_ITEMS`.

2. **Seção 02 · O custo de não ter** — `README.md` › "02 — O custo de não ter".
   Grid de 4 células com `gap:1px` sobre fundo `rgba(255,255,255,.08)` (as linhas viram
   divisores). **Holofote do cursor** (≥900px, desligado no mobile e com reduced-motion),
   um `radial-gradient(260px circle at X Y)` seguindo o ponteiro via rAF.
   Reveal `wipe` em cascata. Dados em `COST_ITEMS`.

3. **Seção 01 · Trabalho** — a mais complexa. `README.md` › "01 — Trabalho".
   - O **fallback é o estado padrão e contém conteúdo real**: card de navegador com os
     três screenshots como `<img>` (use `card.srcSet` de `projects.ts`), cross-fade de
     `.6s`, o card inteiro é um `<a>` para o projeto ativo. Isso cobre reduced-motion,
     ausência de WebGL, telas <760px e o intervalo até o three.js carregar — e os `<img>`
     contam para SEO.
   - Abas 01/02/03, painéis de detalhe empilhados em `grid-area: 1/1` (altura estável),
     cross-fade + `translateY(14px)`.
   - **Autoplay** de 6500ms que só começa quando a seção entra em tela (threshold .25) e
     **para de vez no primeiro clique — nunca retoma**. A aba ativa mostra uma barrinha
     preenchendo em `width 6500ms linear`.
   - Setas laterais, setas do teclado (só quando a seção está no centro da viewport),
     swipe por toque (>45px horizontal; **um swipe não pode disparar o link**).
   - Depois: `three/WorkScene.tsx`, galeria coverflow 3D (≥760px). Toda a matemática está
     no protótipo em `buildWork()`: posições por distância `d` ao ativo, lerp a 8,5%/frame,
     inclinação na direção do movimento, reflexo no chão, e o card da frente rolando
     sozinho pela textura. O canvas só assume 220ms **depois de realmente pintar**.

4. **Seção 03 · Processo** — `README.md` › "03 — Como funciona".
   Timeline dirigida pelo scroll com **três layouts**: trilho horizontal ≥1024px, sem
   trilho e tudo ativo entre 640–1024px, trilho **vertical** <640px. As fórmulas de
   progresso, do contador "Dia X de 11" e de ativação por etapa estão no `README.md` e em
   `initProcess()` no protótipo. Com reduced-motion: tudo ativo, preenchimento 100%, "Dia 11".
   Dados em `PROCESS_STEPS` / `PROCESS_TOTAL_DAYS`.

5. **Seção 04 · Sobre** — `README.md` › "04 — Sobre".
   Duas colunas, **sem foto** (posicionamento de empresa, não de pessoa). À direita, o
   painel "padrão-de-entrega": janela de terminal onde os seis itens são **aprovados um a
   um** a cada `220 + i × 260ms` ao entrar em tela, com contador subindo até `6/6` e um
   rodapé "Aprovado — pronto para publicar". Com reduced-motion, já nasce tudo aprovado.
   Dados em `DELIVERY_SPECS`.

6. **CTA** — `README.md` › "CTA". Bloco centralizado, raio 28px, brilho radial + grade
   mascarada, botão branco grande com ícone do WhatsApp.

7. **Seção 05 · Contato** — wizard de 4 passos. `README.md` › "05 — Contato".
   Trilho de `width:400%` deslizando `translateX(-25% × passo)`. **Prévia ao vivo da
   mensagem** com cursor piscando. Validação por passo com micro-shake e mensagem em
   `--error` (**sem `alert()`**). Enter avança; Shift+Enter quebra linha no textarea.
   Passo 3 é opcional e tem "Pular". Ao enviar, abre `wa.me` em nova aba e mostra a tela
   de sucesso com "Preencher de novo".
   **A lógica já existe e está testada** em `lib/phone.ts` e `lib/whatsapp.ts` — reutilize,
   não reescreva. Nada é enviado a servidor; não há backend.

8. **Rodapé** — `README.md` › "Rodapé". Duas linhas. A segunda é a assinatura da visita
   com **medições reais do navegador**: `abriu em Xs` (Navigation Timing — se não houver
   medida, exibir `<1`, **nunca inventar**), `você está aqui há M:SS` (`useElapsedTime` já
   existe), `leu N de 5 seções` (IntersectionObserver, threshold .3, ids em
   `READABLE_SECTIONS`). As barras `/` são decorativas e usam `--decor`.

9. **FAB do WhatsApp** — `README.md` › "Botão flutuante". Círculo de 54px. **Recolhe
   quando o CTA do rodapé entra em tela** (threshold .12): `scale(.6)`, `opacity 0`,
   `pointer-events:none`, `aria-hidden="true"` — lá embaixo já existe um botão de
   WhatsApp e o flutuante competiria com o CTA.

10. **`vercel.json`** com headers de cache para `/assets/*` e os imutáveis do Vite.

11. **Verificação final**: `npx tsc --noEmit`, `npx vitest run`, `npx vite build`, e
    revisão visual em 390px / 768px / 1440px.

---

## 6. Convenções estabelecidas — siga para o código sair coerente

- **CSS Modules por componente** (`X.module.css` ao lado do `X.tsx`) + os três globais.
  Nada de estilo inline, exceto valor calculado em runtime (largura de barra, delay de
  cascata, transform que muda a cada frame).
- **Responsivo em media queries de CSS**, nunca em JS. O protótipo faz tudo em JS por
  limitação do runtime dele; o handoff manda usar CSS. `BREAKPOINTS` em
  `useMediaQuery.ts` só serve para decisões que o CSS não consegue tomar — como
  **montar ou não montar** a cena three.js.
- **Reduced-motion mostra o ESTADO FINAL, nunca o vazio.** Vale para reveals,
  contadores, timeline, checklist e as cenas 3D. É o contrato do `enabled: false` do
  `useInView`.
- **Alvos de toque ≥44px** em todo link e botão, inclusive os links mono de 10px do
  rodapé — com `min-height` + padding, sem alterar o layout.
- **Contraste AA.** `--muted` (`#8B8B94`) é o cinza mais escuro permitido para texto.
  `--decor` (`#6E6E78`) só em elemento puramente decorativo.
- **Os reveals passam por `lib/reveal.ts`**, que é um singleton de módulo de propósito: a
  cascata de 70ms é contada sobre o **lote** de elementos que entram juntos, e um observer
  por componente daria delay 0 para todos. Ele tem **duas salvaguardas que vieram de bugs
  reais** — elemento que já passou pela viewport revela na hora, e uma varredura no scroll
  pega quem nunca gerou interseção (pulo de scroll / navegação por âncora). Não remova.
- **Comentários explicam o porquê, não o quê**, e em português.
- Todo handler de scroll passa por `useScrollEffect` (throttle por rAF).

---

## 7. Armadilhas já descobertas — não repita

1. **jsdom não avalia media queries.** Um elemento com `display:none` na regra base (como
   o botão de menu, que só reaparece na media query de 900px) fica invisível no teste. Pior:
   pela spec, elemento nesse estado tem **nome acessível vazio**, então
   `getByRole('button', { name })` nunca casa, nem com `hidden: true`. Use
   `getByLabelText`.

2. **`vi.useFakeTimers()` já falseia `requestAnimationFrame` e `performance.now`.** Não
   escreva um mock manual de rAF: ele conflita, e o `vi.useRealTimers()` acaba apagando o
   `cancelAnimationFrame` real, derrubando o cleanup dos efeitos.

3. **Sempre `afterEach(() => vi.useRealTimers())`.** Um caso que falha antes do seu próprio
   `useRealTimers()` deixa os timers falsos ligados e o caso seguinte morre por timeout.

4. **Efeito e avanço de timer precisam de `act()` separados.** `act(() => { trigger();
   vi.advanceTimersByTime(2000); })` não funciona: o efeito que agenda a animação só roda
   depois que a mudança de estado é aplicada. Faça
   `act(() => trigger())` e depois `act(() => void vi.advanceTimersByTime(2000))`.

5. **Handler throttled por rAF exige esperar o frame no teste:**
   ```ts
   await act(async () => {
     window.dispatchEvent(new Event('scroll'));
     await new Promise<void>((r) => requestAnimationFrame(() => r()));
   });
   ```

6. **Elemento criado à mão no `document.body` não é limpo pelo Testing Library.** O
   `cleanup()` só remove o container dele. Remova no `afterEach`, ou o
   `document.getElementById('topo')` do próximo teste acha o do teste anterior.

7. **`scrollY` vaza entre testes.** Reset em `beforeEach`.

8. **Textura acima de 4096px é rejeitada por muitas GPUs.** Por isso o
   `optimize-assets.mjs` limita a altura — não suba esse teto sem motivo.

---

## 8. Comandos

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # tsc -b && vite build
npm test           # vitest run
npm run test:watch
npm run assets     # regenera public/assets a partir de assets/
npm run og         # regenera og-image.png e apple-touch-icon.png
npx tsc --noEmit   # typecheck isolado
```

**Ambiente:** Windows 11, Node v21.5.0, npm 10.2.4. O npm emite `EBADENGINE` porque Vite
6 e Vitest 4 não incluem o Node 21 nas faixas suportadas — **é só aviso neste estado;
typecheck, testes e build funcionam**. O caminho recomendado é subir o Node para uma
versão LTS suportada (22 ou posterior), não baixar as ferramentas.

**Git:** o site antigo (HTML/CSS/JS puro) foi removido e está preservado no commit
`076d624`, recuperável com `git show 076d624:index.html`. A pasta `assets/` com os PNGs
originais foi mantida como fonte para o script de otimização. Nada foi commitado ainda —
todo o trabalho novo está no working tree.

---

## 9. Pendências que o próprio handoff deixou em aberto

Combinadas com o cliente e **ainda não aprovadas** — não implemente sem perguntar:

1. Seção "O custo de não ter" como **busca simulada do Google** (uma SERP falsa onde o
   negócio do cliente não aparece). O cliente escolheu essa direção; as quatro células
   atuais são a versão intermediária.
2. **Prova de cliente** — não há depoimentos hoje. Quando houver, entra entre Trabalho e
   "O custo de não ter".
3. **Analytics** — não há nenhum instalado.
4. **Página de case study** por projeto — sugerida, não aprovada.

O favicon e a imagem de Open Graph, que também estavam nessa lista, **já foram feitos**.
