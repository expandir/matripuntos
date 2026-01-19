import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

try {
  import('./lib/pushNotificationService').then(({ registerServiceWorker }) => {
    registerServiceWorker().catch((error) => {
      console.error('Failed to register service worker:', error);
    });
  }).catch(error => {
    console.error('Failed to load push notification service:', error);
  });
} catch (error) {
  console.error('Error importing push notification service:', error);
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
