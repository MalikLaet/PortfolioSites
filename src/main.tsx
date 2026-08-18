import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';
import { App } from './App';

// O site é uma página só. Qualquer #âncora na URL de entrada vem de um clique
// antigo — o navegador guarda a #seção no histórico e depois autocompleta
// `/#trabalho` na barra de endereço, fazendo o site abrir no meio. Limpamos
// antes do primeiro render, enquanto #root ainda está vazio: sem o elemento
// alvo na página, o navegador nem chega a saltar.
//
// `scrollRestoration: manual` cobre o outro caso — F5 no meio da página, que
// por padrão volta na mesma altura.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

const container = document.getElementById('root');
if (!container) throw new Error('#root não encontrado no index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
