# Prompt inicial para o Claude Code

Copie e cole o texto abaixo na primeira mensagem do Claude Code, com esta pasta aberta.

---

Você vai implementar a versão de produção do site da **DevSites** (estúdio de código freelance, público brasileiro).

Nesta pasta existem dois arquivos HTML de **referência de design** — `DevSites.dc.html` (acento dourado) e `DevSites Roxo.dc.html` (acento roxo). Eles são protótipos: mostram o visual e o comportamento pretendidos, mas **não são o código para produção**. Eles rodam num runtime de protótipo (`support.js`, tags `<x-dc>`, `<sc-if>`, `<sc-for>`, estilos inline) que **não deve ir para produção**.

Sua tarefa: **recriar esses designs como um site estático real**, fiel ao pixel, seguindo o `README.md` desta pasta — que traz medidas, cores, tipografia, animações e comportamento de cada seção.

Comece assim:

1. Leia `README.md` inteiro antes de escrever código.
2. Abra os dois HTML de referência no navegador e navegue por eles (desktop e mobile) para sentir o movimento — a documentação descreve, mas ver ajuda.
3. Me pergunte **qual acento usar** (dourado `#E9B872` ou roxo `#B89AD1`) antes de começar — eu ainda não decidi.
4. Proponha a estrutura de arquivos e espere meu OK antes de implementar.

Stack alvo: **HTML + CSS + JavaScript puro**, sem framework e sem build step (é a stack do site atual, em `referencia-site-atual/`). Use três.js apenas via CDN com import map, como no protótipo. Se você achar que outra stack serve melhor, argumente antes — não troque por conta própria.

Requisitos que não são negociáveis:

- Fiel ao design: mesmas cores, tipografia, espaçamentos e animações do protótipo.
- CSS em arquivo próprio com classes e custom properties — **não** replique os estilos inline do protótipo.
- Acessibilidade: contraste AA em todo texto, alvos de toque ≥44px, `prefers-reduced-motion` respeitado, navegação por teclado funcionando.
- Performance: LCP abaixo de 1,5s no 4G; three.js carregado sob demanda e nunca em telas <900px.
- Mobile primeiro em teste real, não só no devtools.

Não invente conteúdo: números, depoimentos, nomes de cliente ou datas que não estejam no README.
