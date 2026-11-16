import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/600.css';
import '@fontsource/roboto-condensed/500-italic.css';
import '@fontsource/roboto-condensed/600-italic.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
