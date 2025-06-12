import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';  // ✅ ADD THIS
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>         {/* ✅ Wrap the App */}
      <App />
    </AppProvider>
  </React.StrictMode>
);

reportWebVitals();
