import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Routers from './routers/Routers'; // Routers onde você deve configurar a navegação
import AppBar from './shared/components/appBar/AppBar';
import { Box } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      <AppBar />
      <Routers />
    </Box>
  </React.StrictMode>
);

reportWebVitals();
