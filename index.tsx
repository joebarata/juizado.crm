
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("LexFlow: Sistema de bootstrapping ativado.");

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log("LexFlow: Elemento #root encontrado. Iniciando React...");
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (err) {
      console.error("LexFlow Critical Render Error:", err);
    }
  } else {
    console.warn("LexFlow: #root não detectado. Tentando novamente em 300ms...");
    setTimeout(startApp, 300);
  }
};

// Dispara a inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
