import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeAuth } from './services/auth/initAuth';
import App from './App';
import './index.css';

// Initialize auth before rendering
initializeAuth().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);