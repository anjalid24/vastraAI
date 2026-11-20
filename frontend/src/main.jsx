import { isDemo } from './services/demo.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

// Bootstrap CSS first, then our theme so our tokens win the cascade.
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
// Bootstrap's JS bundle (Popper included) powers the collapsible navbar,
// dropdowns and modals.
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const Router = isDemo ? HashRouter : BrowserRouter;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
