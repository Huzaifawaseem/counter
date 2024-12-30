
import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx'; // Ensure this path matches your file structure

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
