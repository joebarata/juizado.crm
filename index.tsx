
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Verifica se existe a configuração global do WordPress
const wpConfig = (window as any).lexflowConfig || {};
if (wpConfig.apiKey) {
  (process.env as any).API_KEY = wpConfig.apiKey;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <div className="lexflow-crm-container">
        <App />
      </div>
    </React.StrictMode>
  );
}
