import React from 'react';
import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import './styles/style.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
