import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Routers from './routers/Routers'; // Routers onde você deve configurar a navegação
import AppBar from './shared/components/appBar/AppBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppBar></AppBar>
    <Routers />
  </React.StrictMode>
);

reportWebVitals();
