import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#F7CBA4',
          color: '#8E1C3B',
          fontSize: '15px',
          fontWeight: '500',
          borderRadius: '8px',
        },
      }}
    />
  </React.StrictMode>
);
