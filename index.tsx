import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * LexFlow 360 - Bootstrap de Produção
 * Este arquivo é transpilado pelo Babel Standalone no navegador.
 */

const init = () => {
  console.log("LexFlow 360: Inicializando motor...");
  const rootElement = document.getElementById('root');

  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("LexFlow 360: Sistema Montado.");
    } catch (error) {
      console.error("LexFlow 360: Falha na montagem React ->", error);
      rootElement.innerHTML = `<div style="padding:40px; color:#f87171; text-align:center;">
        <h2 style="font-weight:900; margin-bottom:10px;">FALHA NA INICIALIZAÇÃO</h2>
        <p style="font-size:12px; opacity:0.8;">${error.message}</p>
      </div>`;
    }
  }
};

// Garante que o DOM está carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
