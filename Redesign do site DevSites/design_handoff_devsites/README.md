# Handoff: Site DevSites — redesign completo

## Visão geral

Landing page única de um estúdio de código freelance brasileiro (**DevSites**), que vende sites institucionais e landing pages para pequenos e médios negócios. O objetivo declarado do site é **provar autoridade técnica e impressionar** — não gerar volume de contato a qualquer custo. A conversão acontece no WhatsApp.

Público: donos de negócio local (barbearia, clínica, oficina, assistência técnica) e gestores de empresas médias.

A página é escura, tipográfica, com um único acento de cor e movimento presente mas contido. O eixo da copy é **o custo de não ter site**, não a lista de features.

## Sobre os arquivos de design

Os arquivos `DevSites.dc.html` e `DevSites Roxo.dc.html` deste pacote são **referências de design criadas em HTML** — protótipos que mostram aparência e comportamento pretendidos. **Não são código de produção.**

Eles rodam sobre um runtime de protótipo (`support.js`, elementos `<x-dc>`, `<sc-if>`, `<sc-for>`, `<x-import>`, e estilos 100% inline). Esse runtime existe para permitir prototipagem rápida e **não deve ser levado para produção**.

A tarefa é **recriar esses designs no ambiente alvo**, usando padrões próprios de produção: HTML semântico, CSS em arquivo com classes e custom properties, JavaScript em módulos. Os estilos inline do protótipo devem virar CSS organizado; a lógica da classe `Component` deve virar módulos JS normais.

Incluí também `referencia-site-atual/` — o site que está no ar hoje (HTML/CSS/JS puro, sem build). **É a stack alvo recomendada**, para manter o deploy simples. Se outra escolha fizer mais sentido, discuta antes de trocar.

## Fidelidade

**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamentos, raios, durações e easings estão finalizados e devem ser reproduzidos com precisão. Todos os valores estão neste documento.

Duas variantes de acento, idênticas em tudo o mais:

| Variante | Arquivo | Acento |
|---|---|---|
| Dourada (padrão) | `DevSites.dc.html` | `#E9B872` |
| Roxa | `DevSites Roxo.dc.html` | `#B89AD1` |

**Pergunte ao cliente qual usar antes de implementar.** As duas foram calibradas com a mesma luminância, então todos os contrastes AA valem para ambas. Implemente o acento como uma única custom property (`--accent`) para permitir a troca em um lugar só.

---

## Design tokens

### Cores

```css
--bg:            #08080A;  /* fundo base da página */
--bg-alt:        #0A0A0C;  /* seções alternadas, faixa da stack, rodapé */
--surface:       #0C0C0F;  /* cards, formulário, painéis */
--surface-hover: #101014;  /* card em hover; barra de título de painéis */
--chrome:        #16161B;  /* barra do navegador nos mockups */
--chrome-dot:    #2E2E37;

--text:          #FAFAFA;  /* títulos e texto principal */
--text-2:        #DEDEE4;  /* itens de lista aprovados */
--text-3:        #C9C9D2;  /* labels em destaque */
--text-4:        #B9B9C2;  /* corpo secundário */
--text-5:        #9A9AA4;  /* parágrafos de apoio */
--muted:         #8B8B94;  /* TODO texto pequeno (mono 9–12px) e labels */

--accent:        #E9B872;  /* dourado — ou #B89AD1 na variante roxa */
--whatsapp:      #25D366;
--error:         #F08A8A;

/* cromo de janela nos mockups (dessaturado de propósito) */
--tl-red:   #D65F5A;
--tl-amber: #D9A34A;
--tl-green: #5BA86B;
```

**Regra de contraste crítica:** `--muted` (`#8B8B94`) é o cinza mais escuro permitido para texto. Tons como `#6E6E78` e `#5A5A63` **falham AA** nos tamanhos de 9–12px usados aqui e foram removidos do design. `#6E6E78` só aparece em elementos puramente decorativos (as barras `/` separadoras do rodapé).

Bordas, sempre branco com alpha sobre fundo escuro:

```
rgba(255,255,255,.07)  divisores internos
rgba(255,255,255,.08)  bordas de seção e de grid
rgba(255,255,255,.09)  bordas de card e de input
rgba(255,255,255,.10)  bordas de painel
rgba(255,255,255,.12)  botões e controles
rgba(255,255,255,.14)  linha superior das etapas
rgba(255,255,255,.16)  moldura do logo
rgba(255,255,255,.22)  nós inativos da timeline
```

Fundos translúcidos: `rgba(255,255,255,.018)` a `.06` para superfícies sutis; acento com alpha `.04`–`.10` para blocos de destaque (`rgba(233,184,114,.045)` etc.).

### Tipografia

Duas famílias, via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Manrope** (400/500/600/700/800) — todo o texto de leitura e títulos.
- **JetBrains Mono** (400/500) — rótulos, números, sobrelinhas ("eyebrows"), medições. Sempre em caixa alta com `letter-spacing` largo.

Escala:

| Uso | Tamanho | Peso | letter-spacing | line-height |
|---|---|---|---|---|
| H1 do hero | `clamp(42px,7.4vw,94px)` | 800 | `-.045em` | `.98` |
| H2 do CTA final | `clamp(34px,5.6vw,66px)` | 800 | `-.045em` | `1` |
| H2 de seção | `clamp(30px,4.4vw,58px)` | 800 | `-.04em` | `1.02`–`1.04` |
| Título de projeto | `clamp(28px,3.4vw,42px)` | 800 | `-.038em` | `1.02` |
| Pergunta do formulário | `clamp(17px,2vw,21px)` | 700 | `-.02em` | — |
| H3 de card | `19`–`22px` | 700/800 | `-.025em`/`-.03em` | — |
| Parágrafo principal | `16.5px` | 400 | — | `1.7` |
| Parágrafo de apoio | `14`–`15px` | 400 | — | `1.6`–`1.65` |
| Eyebrow mono | `11px` | 400 | `.2em` | uppercase |
| Nav mono | `11px` | 400 | `.16em` | uppercase |
| Micro mono | `9.5`–`10.5px` | 400 | `.14`–`.18em` | uppercase |

Sempre `text-wrap: balance` em títulos e `text-wrap: pretty` em parágrafos longos.

### Layout

```
--maxw:   1240px;                    /* largura de conteúdo */
--gutter: clamp(20px,4vw,40px);      /* respiro lateral — o header usa o MESMO valor */
```

Padding vertical de seção: `clamp(88px,11vw,150px)` nas seções grandes, `clamp(72px,9vw,120px)` nas médias.

### Raios

`9px` `10px` `11px` (controles) · `12px` `13px` `14px` (inputs, blocos internos) · `16px` `18px` `20px` (cards e grids) · `22px` `24px` (painéis) · `28px` (bloco do CTA) · `999px` (pílulas e botões).

### Sombras

```
0 14px 34px rgba(37,211,102,.32)   botão flutuante do WhatsApp
0 18px 44px rgba(0,0,0,.55)        botão primário em hover
0 20px 54px rgba(0,0,0,.60)        header condensado
0 30px 70px rgba(0,0,0,.60)        card de navegador do mockup
0 0 0 5px rgba(233,184,114,.12)    halo de nó ativo (accent com alpha)
```

### Movimento

Um easing domina o site inteiro: **`cubic-bezier(.16,1,.3,1)`**. Transições de cor usam `ease`.

Durações: micro-hover `.25`–`.35s` · elementos `.45`–`.6s` · reveals `.95s` · escala de painel `1.1s` · condensar header `.6s`.

### Breakpoints

Todo o responsivo do protótipo é feito em JS (limitação do runtime). **Em produção, use media queries de CSS.** Os pontos de corte são:

| Largura | O que muda |
|---|---|
| `<420px` | abas da galeria com tipografia e padding reduzidos |
| `<640px` | grid de 4 colunas → 1; timeline vira vertical |
| `<700px` | grid do rodapé → 1 coluna |
| `<760px` | galeria 3D desligada (usa imagens + swipe); dica de arraste visível |
| `<900px` | nav → menu mobile; hero 3D desligado; layouts de 2 colunas → 1; holofote desligado |
| `<1024px` | grids de 4 → 2 colunas; trilho horizontal da timeline oculto |
| `<1080px` | câmera 3D recua |
| `<1180px` | relógio do header oculto |

---

## Estrutura da página

Ordem das seções: **Header · Hero · Faixa da stack · 01 Trabalho · 02 O custo de não ter · 03 Como funciona · 04 Sobre · CTA · 05 Contato · Rodapé**, mais um botão flutuante de WhatsApp.

As seções são numeradas na interface por eyebrows mono (`01 — Trabalho selecionado`, etc.).

---

### Header

`position: fixed`, `z-index: 80`. Tem dois estados e a transição entre eles é a assinatura do header.

**Expandido (`scrollY ≤ 40`)** — invisível: sem fundo, sem borda, sem sombra. O header não tem padding externo e a cápsula interna carrega exatamente `--gutter`, de forma que a logo alinhe na mesma coluna do H1 e das eyebrows de seção (verificado: 37,8px vs 36,97px).

**Condensado (`scrollY > 40`)** — a cápsula se desprende da borda e vira uma ilha de vidro:

```
max-width:        1240px → 1060px
padding:          20px var(--gutter) → 11px clamp(14px,1.8vw,22px)
padding do header: 0 → clamp(10px,1.5vw,16px) clamp(12px,2.4vw,28px) 0
border-radius:    0 → 999px
background:       transparent → rgba(13,13,17,.7)
backdrop-filter:  none → blur(22px) saturate(1.6)
border-color:     transparent → rgba(255,255,255,.09)
box-shadow:       none → 0 20px 54px rgba(0,0,0,.6)
transição:        .6s cubic-bezier(.16,1,.3,1)
```

Conteúdo, da esquerda para a direita:

1. **Logo** — quadrado de 32px, borda `rgba(255,255,255,.16)`, raio 10px, com o glifo `</>` em mono 12px; ao lado, "DevSites" em 16px/800/`-.02em`. Em hover o quadrado **gira −90°** e vira cor de acento.
2. **Nav** (≥900px) — quatro links mono 11px/`.16em`/uppercase, `padding: 9px 15px`, cor `--muted` → `--text` em hover.
3. **Indicador de seção** — pílula translúcida (`rgba(255,255,255,.055)` + borda `.07`, altura 31px, raio 999px) que **desliza atrás do link da seção atual**. Scrollspy via IntersectionObserver com `rootMargin: -45% 0px -45% 0px`; a pílula anima `transform` e `width` em `.6s`. Reposicionar após a cápsula condensar (aguardar 620ms) e em resize.
4. **Relógio ao vivo** (≥1180px) — ponto verde pulsante de 5px + `São Paulo · HH:MM` em mono 10px, fuso `America/Sao_Paulo`, atualizando a cada 15s.
5. **CTA "Começar um projeto"** — pílula de acento vazado: borda `rgba(accent,.42)`, fundo `rgba(accent,.055)`, texto de acento 12,5px/700. Em hover **preenche sólido** (fundo de acento, texto `#08080A`). É deliberadamente **secundário** — o botão branco do hero é o primário.
6. **CTA magnético** — ao mover o cursor sobre o CTA, ele desloca `(cursor − centro) × 0,22` em X e Y, com `transform .2s ease-out`; volta a `translate(0,0)` no `pointerleave`. Desligado com `prefers-reduced-motion`.
7. **Botão de menu** (<900px) — 44×44px, borda `.12`, raio 11px.

**Barra de progresso de leitura** — hairline de 1,5px ancorada **dentro** da cápsula (`left/right: clamp(20px,2.6vw,34px)`, `bottom: 7px`), trilho `rgba(255,255,255,.04)`, preenchimento de acento com `opacity .75`, largura = `scrollY / (scrollHeight − innerHeight)`.

### Menu mobile (<900px)

Overlay em tela cheia, `z-index: 120`, fundo `#08080A` opaco, `animation: menuIn .35s`, com rolagem própria e `padding-bottom: calc(40px + env(safe-area-inset-bottom))`.

Topo: wordmark + botão fechar 44×44px, separados por borda inferior. Quatro links em lista, cada um `padding: 22px 0` com borda inferior, número mono 11px + label 30px/700/`-.03em`, **entrando em cascata** (`menuItem .5s`, delay `0.06 + i × 0.07s`). No pé: botão sólido de WhatsApp (`padding 17px`, raio 999px, fundo `#FAFAFA`, texto `#08080A`) e o e-mail com `min-height: 46px`.

### Hero

`min-height: 100svh`, `padding: 132px 0 72px`, coluna de texto com `max-width: 720px`.

Fundos empilhados (todos `pointer-events: none`):
- Brilho radial: `radial-gradient(120% 80% at 78% 42%, rgba(255,255,255,.055), transparent 60%)`.
- Grade técnica: linhas de `rgba(255,255,255,.028)` a cada `88px`, com máscara `radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 78%)`.

**H1 em três linhas, revelação por máscara.** Cada linha vive num `<span>` com `overflow: hidden` e `padding-bottom: .06em`; a linha interna começa em `translateY(112%)` e sobe a `0` em `1.05s cubic-bezier(.16,1,.3,1)`, com delay `0.12 + i × 0.11s`.

```
Todo dia alguém
procura o que você faz
e acha outro.            ← esta linha em --muted (#8B8B94)
```

Subtítulo (`max-width: 530px`, `clamp(16px,1.6vw,19px)`, `--text-5`, `line-height 1.65`):

> Quem vive de indicação e de Instagram depende da sorte para ser encontrado. Um site próprio coloca seu nome na frente de quem já está decidido a comprar — e joga a conversa direto no seu WhatsApp.

Dois botões (`gap: 13px`, `margin-bottom: 88px`):
- **Primário** "Ver o que já fizemos" → `#trabalho`. Pílula branca (`#FAFAFA`, texto `#08080A`), `padding: 16px 28px`, 15px/700. Hover: `translateY(-3px)` + `box-shadow 0 18px 44px rgba(0,0,0,.55)`.
- **Secundário** "Falar no WhatsApp" → link `wa.me`. Borda `.15`, fundo `rgba(255,255,255,.02)`, com o ícone oficial do WhatsApp em `#25D366`.

**Estatísticas** (linha superior `.08`, `padding-top: 34px`, `gap: clamp(28px,6vw,72px)`): três blocos com número `clamp(30px,3.6vw,42px)`/800/`-.04em` e sufixo em cor de acento, sobre label mono 10,5px/`.16em`.

```
20+   Projetos entregues     (conta de 0 a 20 em 1500ms, ease-out cúbico, ao entrar em tela)
100%  Clientes satisfeitos   (idem, até 100)
24h   No ar, todo dia        (estático)
```

Estes números foram confirmados como reais pelo cliente. **Não altere e não acrescente estatísticas novas.**

**Dica de scroll** — `position: fixed`, `bottom: 26px`, `z-index: 60`: traço vertical de 1px/32px com um ponto de acento percorrendo (`scrollCue 2.2s infinite`) + "Role para ver" em mono 9,5px. Some (`opacity 0` + `translateY(14px)`) quando `scrollY > 90`.
**Regra importante:** a dica só é exibida **se o hero couber na viewport** (`altura do hero ≤ innerHeight − 8`). Se o hero transborda, a página já está visivelmente cortada e a dica cairia sobre o texto. Medir no load, em resize, e novamente 900ms depois (fontes e 3D mudam a altura no primeiro paint).

### Objeto 3D do hero (≥900px)

`<canvas>` posicionado à direita (`right: -3%`, `top: 50%`, `translateY(-50%)`, `width/height: min(760px, 60vw)`), aparecendo com `opacity` em `1.4s`.

Conteúdo: **um site explodido em camadas** — as quatro camadas que um navegador empilha, em metal escuro, construídas com `RoundedBoxGeometry`:

1. Cromo do navegador: barra + três pontos + campo de URL.
2. Faixa de hero: duas barras de título, uma linha de texto, um botão de acento e um secundário.
3. Fileira de três cards, o do meio mais claro.
4. Grade de rodapé 4×3, com a primeira célula em cor de acento.

Cada camada tem uma moldura de arame (`wire`) e está separada por `GAP = 0.92` no eixo Z. Materiais: `MeshPhysicalMaterial` metálico — `steel #2B2B33` (rough .15, clearcoat 1), `light #5C5C6A`, `wire #76767F`, `gold` = acento (rough .18, `envMapIntensity` 2.4). Ambiente: `RoomEnvironment` via `PMREMGenerator` (0.03). Luzes: direcional branca 3.4 em (4,6,5), preenchimento branco 1.5 em (−3,2,6), rim de acento 1.8 em (−6,−2,−4), ambiente 0.4.

Uma **linha de varredura** de acento (plano de 0,02 de altura, opacidade até .85) percorre a pilha de cima para baixo em ciclo de 1,6 — sugere carregamento.

Animação por frame:

```js
group.rotation.y = -0.62 + sin(t*0.55)*0.18 + pointer.x*0.38
group.rotation.x = 0.24 + pointer.y*0.20 + scrollProgress*0.34
group.rotation.z = 0.06 + pointer.x*0.05
group.position.y = sin(t)*0.09 - scrollProgress*0.50
// camadas se afastam com o mouse nas laterais e se juntam ao rolar:
spread = 1 + |pointer.x|*0.55 - scrollProgress*0.42   // mínimo 0.25
camera.position.x = pointer.x * 0.5
```

`pointer` é suavizado a 4,5% por frame (`pointer.x += (target - pointer.x) * 0.045`). `t += 0.006` por frame. Câmera: `PerspectiveCamera(34)` em `z = 11`.

**Loop pausado quando o canvas sai da tela** (IntersectionObserver). Não montar abaixo de 900px, nem com `prefers-reduced-motion`.

### Faixa da stack

Faixa de `padding: 22px 0` em `--bg-alt`, com bordas em cima e embaixo, `overflow: hidden`. Marquee infinito: duas listas idênticas lado a lado (a segunda `aria-hidden`), `animation: marquee 38s linear infinite` de `0` a `translate3d(-50%,0,0)`.

Itens em mono 11,5px/`.2em`/uppercase/`--muted`, separados por `·` e `gap: 46px`:

`HTML5 · CSS3 · JavaScript · SEO local · Core Web Vitals · Mobile first · Acessibilidade · WhatsApp API · Google Business · Analytics`

### 01 — Trabalho (galeria 3D interativa)

Eyebrow `01 — Trabalho selecionado`. H2: **"Três negócios que pararam de esperar a indicação chegar."** À direita, instrução em 15px/`--muted`/`max-width: 290px`: "Clique numa tela ao lado para trazê-la à frente. Clique na da frente para abrir o site."

Esta seção é **uma coisa só**: a cena 3D É a navegação. Não existe grade de cards separada — a versão antiga repetia os mesmos três projetos duas vezes.

#### Palco (`#workStage`)

`height: clamp(320px,42vw,520px)`, `cursor: grab`, `touch-action: pan-y`, `user-select: none`.

**Camada de fallback (`#workFallback`) — é o estado padrão e contém conteúdo real.** Um card de navegador (`height: 100%`, `aspect-ratio: 16/10`, `max-width: min(640px,88%)`, raio 14px, borda `.12`, fundo `#101014`, sombra `0 30px 70px rgba(0,0,0,.6)`) com barra de título de 28px (fundo `#16161B`, três pontos coloridos de 7px) e os **três screenshots como `<img>` reais**, com `object-fit: cover`, `object-position: top center` e cross-fade de `.6s`. O card inteiro é um `<a>` que aponta para o projeto ativo, com selo "Abrir site" no canto inferior direito.

Isso cobre: `prefers-reduced-motion`, ausência de WebGL, telas <760px, e o intervalo entre o primeiro paint e o three.js carregar. **Em todos os casos o visitante vê o trabalho** — e os `<img>` contam para SEO, com `alt` descritivo.

O canvas 3D assume só **depois de realmente pintar** (220ms após o primeiro frame): o canvas vai a `opacity 1` e o fallback recebe `opacity 0`, `pointer-events: none` e, 700ms depois, `visibility: hidden`.

#### Cena 3D (≥760px)

Três "telas" em arco tipo coverflow. Cada uma é um grupo com: corpo em `RoundedBoxGeometry(3.35, 2.5, 0.13, 5, 0.085)` (`#1A1A20`, metalness .95, rough .24, clearcoat .7), barra de título, três pontos, campo de URL, o screenshot como plano de `3.15 × 2.0`, e um **reflexo no chão** (mesmo plano, `scale.y = -1`, `opacity .22`, `alphaMap` de gradiente vertical, `depthWrite: false`).

Posições (`d` = distância até o índice ativo, com wrap circular):

```js
d === 0 → { x: 0,              z:  1.15, ry: 0,      scale: 1    }
d !== 0 → { x: 3.35 * d,       z: -1.25, ry: -0.6*d, scale: 0.86 }
```

Todos os valores são interpolados a **8,5% por frame** (hover a 12%, escala a 10%). Detalhes de fluidez:

- Os cards **inclinam na direção do movimento**: `rotation.y += velocidadeX * 0.045`, `rotation.z = d*0.012 − velocidadeX*0.02`.
- Cada card flutua: `position.y = sin(t*1.1 + fase)*0.07`, fase `i × 1.7`.
- Em hover o card sobe `0.1` e escala `+0.035`; uma moldura de brilho (`edgeMat`) fica visível.
- **O site da frente rola sozinho** dentro da moldura: a textura tem `repeat/offset` recortando no aspecto da tela (cover, começando pelo topo) e o `offset.y` percorre a página em `sin(t*0.35)`; os laterais voltam ao topo. Isso também melhora a nitidez — o screenshot é recortado, não espremido.
- `renderer.setPixelRatio(min(devicePixelRatio, 2.5))` e `anisotropy` máximo.
- Câmera `PerspectiveCamera(30)` em `z = 11.2` (<1080px) ou `9.4`.
- Loop pausado fora da tela.

#### Interação (três caminhos para a mesma ação)

Risco maior de galeria 3D: parecer bonita e ninguém perceber que dá para mexer. Por isso:

1. **Clique na tela lateral** → ela vem para a frente (raycasting sobre os corpos).
2. **Clique na tela da frente** → abre o site em nova aba. Um selo "Clique para abrir o site" (mono 9,5px, borda de acento) aparece **só** quando o cursor está sobre a tela ativa.
3. **Arrastar** (>55px) → troca de projeto. `<45px` sem hover não faz nada.
4. **Setas laterais** — círculos de 46px, `rgba(10,10,12,.55)` + `blur(10px)`, hover `scale(1.08)`.
5. **Abas numeradas** 01/02/03 abaixo do palco.
6. **Setas do teclado** ← → quando a seção está no centro da viewport.
7. **Swipe por toque** no fallback (>45px, horizontal predominante); um swipe **não** dispara o link.

**Autoplay:** troca a cada 6500ms, começando só quando a seção entra em tela (threshold .25). A aba ativa mostra uma barrinha de acento preenchendo em `width 6500ms linear`. **Para de vez no primeiro clique** — nunca retoma.

#### Abas e painéis

Abas: `flex: 1`, `border-top: 2px solid transparent` (ativa: `#FAFAFA`), número mono 10px + nome 16px/700 (`--muted` → `--text`).

Painéis de detalhe empilhados em `grid-area: 1/1` (altura estável entre trocas), `1.3fr 1fr` (1 coluna <900px), cross-fade `.6s` + `translateY(14px)`. Cada painel tem: pílula de categoria, tipo do negócio, título `clamp(28px,3.4vw,42px)`, descrição, bloco "Resultado" (`--surface`, raio 18px, label em acento), pílulas de tecnologia, e um **bloco "Ver ao vivo"** com o domínio real (borda de acento `.3`, fundo `.045`, hover `translateY(-2px)`).

Conteúdo dos três projetos:

**01 · SaaS · Chatbots de IA — NeuralBot** → `https://neural-bots.vercel.app/`
> Tinham um produto bom e nenhum lugar para explicá-lo. Montamos o site institucional e a página de captura que qualifica o lead antes de virar conversa.
> **Resultado:** Base pronta para escalar campanhas sem refazer o site.
> Tags: HTML · CSS · JavaScript · Conversão

**02 · Local · Assistência técnica — OutletEletro** → `https://outleteletro.com/`
> Vivia de indicação e sumia da busca. Estruturamos as páginas por serviço e por bairro, com o WhatsApp a um toque de qualquer ponto da tela.
> **Resultado:** Passou a ser encontrado no Google pela própria região.
> Tags: SEO local · Responsivo · WhatsApp · Maps

**03 · Premium · Estética automotiva — TrustDetail** → `https://trust-detail-three.vercel.app/`
> Serviço caro com cara de barato na internet. Refizemos a imagem digital em torno das fotos de antes e depois, e o orçamento virou um botão só.
> **Resultado:** Preço deixou de ser a primeira pergunta do cliente.
> Tags: Galeria · Agendamento · Branding

### 02 — O custo de não ter

Fundo `--bg-alt`, borda superior. Eyebrow `02 — O custo de não ter`. H2: **"O cliente não desistiu de comprar. Ele só comprou de quem ele achou."**

Quatro células num grid de `gap: 1px` sobre fundo `rgba(255,255,255,.08)` (as linhas de grade viram divisores), borda `.08`, raio 20px, `overflow: hidden`. Cada célula: `padding: 34px 26px 38px`, número mono 11px em acento com `margin-bottom: 44px`, H3 18px/700, parágrafo 14px/`--muted`. Hover troca o fundo para `--surface-hover`.

```
01  Você não aparece na busca
    Quem digita o seu serviço na sua cidade vê uma lista. Sem site, você não está nela.

02  Você repete preço o dia todo
    Sem uma página que explique o serviço, cada cliente começa a conversa do zero com você.

03  Parece menor do que é
    Só com perfil no Instagram, o cliente te compara com amador — e pechincha o seu preço.

04  Perde quem decide de noite
    Quem resolve às 23h não manda DM esperando resposta. Ele procura e fecha com quem já está lá.
```

**Holofote do cursor (≥900px):** camada absoluta sobre o grid, `pointer-events: none`, com `background: radial-gradient(260px circle at Xpx Ypx, rgba(accent,.09), transparent 70%)` seguindo o ponteiro via `requestAnimationFrame`; `opacity` 0→1 no `pointerenter`. Desligado no mobile e com `prefers-reduced-motion`.

**Reveal:** as quatro células entram com `wipe` (ver "Reveals" adiante) em cascata.

### 03 — Como funciona (timeline dirigida pelo scroll)

Eyebrow `03 — Como funciona`. H2: **"Do primeiro 'oi' ao site no ar em cerca de duas semanas."**

Acima do grid: label "Linha do tempo" à esquerda e **"Dia `01` de 11"** à direita, com o número em acento e `font-variant-numeric: tabular-nums`. O total 11 é a soma real das durações (1+2+7+1).

**Desktop (≥1024px):** trilho horizontal de 2px (`rgba(255,255,255,.1)`) com preenchimento de acento e quatro nós de 11px em 12,5% / 37,5% / 62,5% / 87,5%.

Quatro etapas em grid de 4 colunas, cada uma: `border-top` `.14`, `padding: 28px 24px 30px 0`, cabeçalho (`ETAPA 01` mono + régua + duração em acento), H3 19px/700, parágrafo 14px/`max-width: 250px`.

```
ETAPA 01 · 1 dia  — Conversa
  Meia hora no WhatsApp ou na chamada para entender o negócio, o cliente e o que trava hoje.
ETAPA 02 · 2 dias — Estrutura
  Definimos as seções, o texto e o caminho até o botão. Você aprova antes de existir design.
ETAPA 03 · 7 dias — Construção
  Código escrito à mão, link de prévia atualizado todo dia. Você acompanha e comenta.
ETAPA 04 · 1 dia  — No ar
  Domínio, Google, Analytics e WhatsApp configurados. Depois, suporte quando precisar.
```

**Progresso pelo scroll:**

```js
p = clamp((innerHeight*0.78 - rect.top) / (rect.height*0.72), 0, 1)
preenchimento = p * 100%
dia = 1 + round(p * 10)
etapa i ativa quando  p >= (i + 0.5)/4 - 0.12
```

Etapa inativa: `opacity .42`, H3 em `#B9B9C2`, nó com fundo `#08080A` e borda `.22`. Ativa: `opacity 1`, H3 `#FAFAFA`, nó preenchido de acento com halo `0 0 0 5px rgba(accent,.12)`. Transições `.45`–`.6s`.

**Mobile (<640px): o trilho gira para vertical.** Rail de 1px em `left: 6px` (de `top: 36px` a `bottom: 36px`), preenchimento crescendo em `height`, e um nó de 13px ancorado em **cada etapa** (`position: relative` na etapa; nó em `left: 0; top: 30px`). As etapas ganham `padding-left: 34px` e perdem a borda superior. Progresso com `innerHeight*0.62` e ativação em `(i + 0.35)/4 - 0.1`.

**Entre 640px e 1024px** (duas colunas): nenhum trilho; todas as etapas exibidas ativas.

Com `prefers-reduced-motion`: tudo ativo, preenchimento em 100%, "Dia 11".

### 04 — Sobre

Fundo `--bg-alt`, duas colunas `1fr 1fr` com `gap: clamp(40px,6vw,86px)`, alinhadas ao centro.

**Não há foto.** O cliente pediu posicionamento de empresa, não de pessoa. A prova de confiança é o painel à direita.

Coluna esquerda — eyebrow `04 — Sobre`, H2 **"Um estúdio de código, não uma fábrica de sites."**, dois parágrafos em voz "nós":

> A DevSites trabalha direto com quem decide. Sem intermediário, sem gerente de conta, sem reunião que podia ser mensagem — quem escreve o código é quem entendeu o seu negócio.

> Aceitamos poucos projetos por mês de propósito. Preferimos entregar três sites que funcionam a dez que apenas existem.

Botão vazado "Falar com a gente" e, abaixo, ponto verde pulsante + "Resposta em minutos" em mono 10,5px.

#### Painel "padrão-de-entrega" (checklist animado)

Uma janela de terminal (borda `.10`, raio 22px, `--surface`): barra de título em `--surface-hover` com três pontos coloridos, caminho `devsites / padrão-de-entrega` em mono 10px, e um contador `0/6` em pílula à direita.

Seis linhas ligadas por uma linha vertical, cada uma com um nó circular de 26px contendo o número, e label + valor:

```
01 Velocidade  — Abre em menos de 1,5s no 4G. Medimos antes de publicar.
02 Código      — Escrito do zero. Sem tema, sem construtor, sem plugin pago.
03 Teste       — Aparelho real na mão — não só a janelinha do navegador.
04 Propriedade — Código e domínio no nome da sua empresa, sempre.
05 Busca       — Estrutura de SEO e Google Business configurados na entrega.
06 Suporte     — 30 dias inclusos. Depois, sem contrato amarrado.
```

**Ao entrar em tela (threshold .3), os itens são aprovados um a um**, a cada `220 + i × 260ms`:

- o número desaparece (`opacity 0`, `scale .7`) e um **check verde** aparece (`opacity 1`, `scale 1` em `.45s`);
- o nó ganha borda `rgba(37,211,102,.45)`, fundo `rgba(37,211,102,.1)` e halo `0 0 0 4px rgba(37,211,102,.06)`;
- o valor acende de `--muted` para `--text-2`;
- o conector vertical fica `rgba(37,211,102,.3)`;
- o contador sobe até `6/6`, ficando verde.

Ao final, um rodapé de painel aparece (`opacity 0→1`, `translateY(8px)→0` em `.7s`): check verde + "Aprovado — pronto para publicar", sobre `rgba(37,211,102,.035)`.

A ideia: transformar afirmações em algo que parece **verificado** — é o que um estúdio faz antes de publicar. Com `prefers-reduced-motion`, tudo já aparece aprovado.

### CTA

Bloco centralizado, borda `.10`, raio 28px, `--surface`, `padding: clamp(46px,7vw,96px) clamp(24px,5vw,72px)`, com brilho radial no topo e grade de 56px mascarada.

Eyebrow "Diagnóstico gratuito" (sem mês fixo — datas envelhecem). H2 `clamp(34px,5.6vw,66px)`:

> **Em 10 minutos você descobre quanto cliente está passando batido.**

> Conta o que seu negócio faz e a gente aponta onde está o vazamento — de graça, sem proposta genérica. Se você não precisar de site agora, falamos isso na cara.

Botão branco grande com ícone do WhatsApp: "Falar no WhatsApp agora" (`padding: 19px 34px`, 16px/700).

### 05 — Contato (formulário wizard)

Duas colunas. À esquerda: eyebrow, H2 **"Prefere escrever? Também funciona."**, texto, e dois cartões de canal (WhatsApp e e-mail) com ícone em quadrado de 44px e hover `translateX(5px)`.

À direita, um **wizard conversacional de 4 passos** — uma pergunta por vez, no lugar do formulário em caixinhas.

Cabeçalho: "Conta rápido o seu projeto" + "Passo X/4". Abaixo, barra de progresso de 3px com preenchimento `linear-gradient(90deg, #25D366, var(--accent))` animando em `.5s`.

**Prévia ao vivo da mensagem** (borda `rgba(37,211,102,.16)`, `--bg`, `min-height: 96px`): ícone do WhatsApp + "Prévia da mensagem", e a mensagem se montando linha a linha conforme o usuário digita, com **cursor piscando** (`blink 1s step-end infinite`). Vazio: "Vai aparecer aqui conforme você preenche…" em itálico.

Os quatro campos vivem num trilho de `width: 400%` que desliza `translateX(-25% × passo)` em `.5s cubic-bezier(.16,1,.3,1)`. Cada painel: label de acento mono 9,5px, pergunta `clamp(17px,2vw,21px)`/700, e input **só com linha inferior** de 2px (`rgba(255,255,255,.14)` → `#25D366` no foco), fonte 18px, fundo transparente.

```
1. Nome              — "Como podemos te chamar?"   · obrigatório
2. WhatsApp          — "Qual seu número?"          · obrigatório, máscara (11) 99999-9999
3. Negócio           — "O que você vende ou faz?"  · opcional, com botão "Pular"
4. O que você precisa— "Me conta rapidinho"        · obrigatório, textarea
```

Validação:
- passo 1 vazio → "Me conta seu nome antes de continuar."
- passo 2 com <10 dígitos → "Falta um número válido de WhatsApp."
- passo 4 vazio → "Escreve rapidinho o que você precisa."

Erro dispara **micro-shake** (`shake .42s`) no trilho + mensagem em `#F08A8A`. Sem `alert()`.

Teclado: **Enter avança**; `Shift+Enter` quebra linha no textarea.

Botões: círculo de voltar 46px (a partir do passo 2), "Pular" (só passo 3, `min-height: 46px`), e o primário em pílula branca — "Continuar" com seta, ou "Enviar pelo WhatsApp" com o ícone no último passo.

**Envio:** monta a mensagem e abre `https://wa.me/5511999038780?text=...` em nova aba:

```
Olá! Vim pelo site.

*Nome:* {nome}
*WhatsApp:* {telefone}
*Negócio:* {negócio}        ← só se preenchido

*Mensagem:*
{mensagem}
```

Depois, **tela de sucesso** (`popIn .5s`): círculo verde de 64px com check, "Mensagem pronta", "Abrimos o WhatsApp em outra aba com tudo preenchido. É só apertar enviar." e botão "Preencher de novo" que reseta o estado.

Nota de rodapé: "Abre o WhatsApp com a mensagem já escrita. Nada é armazenado aqui." **Nada é enviado a servidor** — não há backend.

### Rodapé

Compacto, duas linhas, ~150px de altura. Fundo `--bg-alt`, borda superior.

**Linha 1** (`padding: clamp(26px,3vw,34px) 0`): logo + wordmark; quatro links mono 10px/`.16em` (cada um com `min-height: 44px`); e, à direita (`margin-left: auto`), botão vazado de acento "Falar no WhatsApp".

**Linha 2** (borda superior `.07`): a assinatura da visita, em mono 10,5px — **medições reais do navegador do visitante**, com os números em cor de acento:

```
● abriu em 0,9s / você está aqui há 2:14 / leu 4 de 5 seções
```

- **abriu em** — Navigation Timing (`domContentLoadedEventEnd − startTime`), em segundos com uma decimal e vírgula decimal. Se não houver medida, exibir `<1` — **nunca inventar**.
- **você está aqui há** — contador `M:SS` desde o carregamento, tick de 1s.
- **leu N de 5** — seções vistas (`topo`, `trabalho`, `processo`, `sobre`, `contato`) via IntersectionObserver com threshold .3.

As barras `/` são decorativas e ficam em `#6E6E78` (um passo mais escuras que o texto, para a linha ler como três medições agrupadas).

À direita: `© {ano} DEVSITES · SÃO PAULO` e um botão redondo de 44px "Voltar ao topo".

O conceito: a página é sobre sites que funcionam, então termina mostrando as métricas dela mesma.

### Botão flutuante de WhatsApp

`position: fixed`, `right: 22px`, `bottom: calc(22px + env(safe-area-inset-bottom, 0px))`, `z-index: 70`. Círculo de 54px em `#25D366`, ícone `#08080A`, sombra `0 14px 34px rgba(37,211,102,.32)`, hover `scale(1.08)`.

**Recolhe quando o CTA do rodapé entra em tela** (threshold .12): `scale(.6)`, `opacity 0`, `pointer-events: none`, `aria-hidden="true"`. Ali embaixo já existe um botão de WhatsApp — o flutuante seria redundância competindo com o CTA (e sobrepunha o link "Voltar ao topo").

---

## Reveals de entrada

Um IntersectionObserver com `threshold: [0, 0.12]` e `rootMargin: '0px 0px -70px 0px'`; cascata de `70ms` por elemento; `transition` de `.95s` (`1.1s` para `scale`) em `cubic-bezier(.16,1,.3,1)`.

Estados iniciais por variante:

| Variante | Transform inicial | Onde |
|---|---|---|
| padrão | `translateY(26px)` | blocos gerais |
| `rise` | `translateY(40px)` | cabeçalho de Trabalho |
| `left` | `translateX(-34px)` | títulos de seção, coluna do Sobre, coluna do Contato |
| `right` | `translateX(34px)` | formulário |
| `scale` | `scale(.965)` | painel do Sobre, bloco do CTA |
| `wipe` | `translateY(30px)` + `clip-path: inset(0 0 100% 0)` | as quatro células do custo |

**Duas salvaguardas obrigatórias** (foram bugs reais):

1. Se o elemento **já passou** pela viewport (`!isIntersecting && boundingClientRect.top < 0`), revelar **imediatamente**, sem delay.
2. Uma varredura no `scroll` revela qualquer elemento que tenha ficado acima da viewport sem nunca gerar entrada de interseção (acontece em pulos rápidos de scroll ou navegação por âncora).

Sem essas duas, blocos ficam invisíveis para sempre ao pular de scroll.

---

## Peça 3D exclusiva do mobile (<900px)

Como o WebGL não roda no celular por decisão de performance, o hero mobile tem sua **própria peça em CSS 3D** — o mesmo conceito do site explodido, sem custo de bateria:

Container de `max-width: 340px`, `margin: 44px auto 0`, `perspective: 900px`, `perspective-origin: 50% 40%`. Dentro, um plano `aspect-ratio: 4/3` com `transform-style: preserve-3d` e `rotateX(11deg) rotateY(-13deg)`.

Quatro camadas absolutas (borda `.13`, raio 12px, `rgba(12,12,16,.86)`, `backdrop-filter: blur(2px)`), cada uma em `translateZ(i × -46px) translateY(i × 15px)`:

1. barra de navegador com três pontos coloridos e campo de URL;
2. faixa de hero com barras de texto e um botão de acento;
3. três cards lado a lado;
4. grade 3×2, primeira célula em acento.

Cada camada flutua (`stackFloat 5–7s`, delays escalonados) e uma linha de acento varre por cima (`stackScan 4.2s`, `translateZ(30px)`).

**Ao rolar**, o plano inclina e as camadas se juntam:

```js
p = clamp(((rect.top + rect.height/2) / innerHeight - 0.5) * 2, -1, 1)
plane.rotateX = 11 + p*6      plane.rotateY = -13 + p*5
pull = 1 - min(|p|,1) * 0.45   // camadas: translateZ(i*-46*pull) translateY(i*15*pull)
```

Legenda abaixo: "Cada camada escrita à mão" em mono 9px. Desligado com `prefers-reduced-motion`.

---

## Acessibilidade

Requisitos verificados no protótipo — mantenha todos:

- **Contraste AA em todo texto.** Mínimo medido: 5,78:1. `--muted` (`#8B8B94`) é o limite inferior para texto; cinzas mais escuros só em decoração.
- **Alvos de toque ≥44px** em todos os links e botões, incluindo os links mono de 10px do rodapé e o e-mail do menu (usar `min-height` + `padding`, sem alterar o layout).
- **`prefers-reduced-motion: reduce`** zera durações via CSS (`animation-duration: .01ms !important; transition-duration: .01ms !important`) **e** desliga em JS: three.js, holofote, peça mobile, cascata do checklist e mapeamento de scroll da timeline — cada um mostrando seu **estado final** em vez de nada.
- **`scroll-margin-top: 88px`** em todas as seções com `id`, para as âncoras não caírem sob o header fixo.
- Elementos decorativos com `aria-hidden="true"`; botões de ícone com `aria-label`; painéis inativos com `aria-hidden`.
- `alt` descritivo nos três screenshots.
- Navegação por teclado: Enter no formulário, setas na galeria, foco visível nos inputs (borda inferior verde).
- `-webkit-tap-highlight-color` com o acento em alpha baixo.

## Performance

- three.js **só via `<script type="importmap">`** e `import()` dinâmico, versão fixada (`three@0.170.0`), com `RoomEnvironment` e `RoundedBoxGeometry` de `three/addons/`.
- **Não montar 3D** abaixo de 900px (hero) e 760px (galeria).
- Todo loop de render **pausa quando sai da tela** (IntersectionObserver).
- `requestAnimationFrame` com throttle em todos os handlers de scroll; `will-change` apenas durante a animação, removido depois.
- Imagens com `loading="lazy"`; `preconnect` para as fontes.
- Meta de LCP: abaixo de 1,5s no 4G — o rodapé exibe esse número ao visitante, então o site precisa cumpri-lo.

## Assets

Em `assets/` — screenshots dos três projetos, fornecidos pelo cliente:

| Arquivo | Projeto |
|---|---|
| `neural-bots.png` | NeuralBot |
| `outleteletro.png` | OutletEletro |
| `site-trust.png` | TrustDetail |

São usados **duas vezes**: como `<img>` no card de fallback e como textura nos planos 3D. Vale gerar versões maiores/otimizadas (WebP + `srcset`) — a nitidez da textura 3D depende da resolução da origem.

Ícones são **SVG inline** (WhatsApp, setas, check, e-mail, menu). Não há biblioteca de ícones e não há emoji.

## Pendências conhecidas (não implementadas)

Combinadas com o cliente e ainda em aberto:

1. **Favicon e imagem de preview (Open Graph)** — hoje o link compartilhado no WhatsApp chega cru. Crítico para um site que vive de WhatsApp. Precisa de `favicon.svg`/`.ico`, `og:image` (1200×630), `og:title`, `og:description`, `twitter:card`.
2. **Seção "O custo de não ter" como busca simulada do Google** — o cliente escolheu essa direção: uma SERP falsa onde o negócio dele **não aparece**. Ainda não construída; as quatro células atuais são a versão intermediária.
3. **Prova de cliente** — o cliente não tem depoimentos hoje. Quando tiver, entra entre Trabalho e "O custo de não ter".
4. **Analytics** — não há nenhum instalado.
5. **Página de case study** por projeto — sugerida, não aprovada.

## Dados de contato (usar exatamente estes)

- WhatsApp: `+55 11 99903-8780` → `https://wa.me/5511999038780`
- E-mail: `isklikma@gmail.com`
- Localização exibida: São Paulo

Texto padrão dos links diretos de WhatsApp: `?text=Olá, quero um site para meu negócio` (URL-encoded).

## Voz da copy

- **Primeira pessoa do plural** ("nós", "montamos", "a gente"). O site fala como estúdio, não como pessoa.
- Direta e concreta; sem jargão de marketing, sem "soluções inovadoras", sem emoji.
- O eixo é a **perda** que o cliente já tem hoje, não a lista de features.
- **Nada de escassez inventada.** Datas fixas ("agenda de agosto") e contagens de vaga foram removidas de propósito.
- **Nenhum número sem origem real.** As três estatísticas do hero foram confirmadas pelo cliente; as medições do rodapé vêm do navegador. Não acrescente outras.

## Arquivos deste pacote

```
PROMPT.md                      → cole no Claude Code para começar
README.md                      → este documento
DevSites.dc.html               → protótipo, acento dourado (REFERÊNCIA)
DevSites Roxo.dc.html          → protótipo, acento roxo (REFERÊNCIA)
support.js                     → runtime do protótipo (NÃO usar em produção)
assets/                        → screenshots dos três projetos
referencia-site-atual/         → site atual no ar (HTML/CSS/JS puro) — stack alvo
  index.html
  css/style.css
  js/script.js
```

Para ver os protótipos: abra os `.dc.html` num navegador (precisam de `support.js` ao lado e de internet para fontes e three.js).
