import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  // Verificação para evitar renderização múltipla
  if (!window.hasOwnProperty('__LEXFLOW_RENDERED__')) {
    (window as any).__LEXFLOW_RENDERED__ = true;
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("LexFlow 360: Motor ativo v5.4.0");
  }
} else {
  console.error("Erro Crítico: Container #root não encontrado no DOM.");
}
