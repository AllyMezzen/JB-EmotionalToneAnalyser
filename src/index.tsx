import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css'
import './styles/media.css';
import {App} from './components/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);