import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router basename="/react-mesto-auth">
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
