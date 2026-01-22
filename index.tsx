import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * LexFlow Bootstrap Engine v5
 * Projetado para contornar latência de renderização do WordPress
 */
const bootstrap = () => {
  console.log("LexFlow: Tentando montar aplicação...");
  const container = document.getElementById('root');

  if (!container) {
    console.warn("LexFlow: #root não encontrado no DOM. Tentando novamente...");
    setTimeout(bootstrap, 250);
    return;
  }

  // Previne múltiplas instâncias em temas com TurboLinks ou AJAX
  if ((window as any).__LEXFLOW_INITIALIZED__) return;
  (window as any).__LEXFLOW_INITIALIZED__ = true;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("LexFlow 360: Aplicação montada com sucesso.");
  } catch (error) {
    console.error("LexFlow 360: Falha crítica na inicialização:", error);
  }
};

// Inicia o processo de bootstrap
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
