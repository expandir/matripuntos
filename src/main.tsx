import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './lib/pushNotificationService';

const storedAuth = localStorage.getItem('matripuntos-auth');
if (storedAuth) {
  try {
    const authData = JSON.parse(storedAuth);
    if (!authData || !authData.refresh_token || !authData.access_token) {
      console.log('Cleaning invalid stored session');
      localStorage.removeItem('matripuntos-auth');
    }
  } catch {
    console.log('Cleaning corrupted stored session');
    localStorage.removeItem('matripuntos-auth');
  }
}

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);

    if (response.status === 422 && args[0]?.toString().includes('/auth/v1/token')) {
      localStorage.removeItem('matripuntos-auth');
      return response;
    }

    return response;
  } catch (error) {
    throw error;
  }
};

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('auth/v1/token') && message.includes('422')) {
    return;
  }
  if (message.includes('Failed to load resource') && message.includes('auth/v1/user') && message.includes('422')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

registerServiceWorker().catch((error) => {
  console.error('Failed to register service worker:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
