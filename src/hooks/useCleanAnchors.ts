import { useEffect } from 'react';

/**
 * Mantém a URL sem #âncora.
 *
 * Os links de navegação são âncoras de verdade — é o que dá rolagem suave e
 * `scroll-margin-top` de graça, sem interceptar clique. O efeito colateral é a
 * #seção ficar grudada na URL e no histórico: o navegador passa a sugerir
 * `/#trabalho` na barra de endereço e a próxima visita abre no meio da página.
 *
 * Deixamos o salto acontecer e limpamos a URL logo depois. `replaceState` não
 * cria entrada no histórico nem dispara `hashchange` de novo, então clicar duas
 * vezes no mesmo link continua rolando.
 */
export function useCleanAnchors(): void {
  useEffect(() => {
    const clean = () => {
      if (!window.location.hash) return;
      history.replaceState(null, '', window.location.pathname + window.location.search);
    };
    window.addEventListener('hashchange', clean);
    return () => window.removeEventListener('hashchange', clean);
  }, []);
}
