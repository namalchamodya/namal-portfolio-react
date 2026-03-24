import React from 'react';
import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './components/Auth/AuthContext';
import { CartProvider } from './components/Store/CartContext';

import './styles/style.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AuthProvider>
    <CartProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </CartProvider>
  </AuthProvider>
);
