import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from 'material-ui/CssBaseline';
import Router from './routes';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div>
    <CssBaseline />
    <Router />
  </div>,
  document.getElementById('root'),
);
registerServiceWorker();

// TODO: turn hot reloading on again, even if it doesn't preserve state
