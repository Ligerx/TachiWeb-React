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

// NOTE: this type of hot reload does not preserve state. Hopefully fix in the future?
// https://daveceddia.com/hot-reloading-create-react-app/
if (module.hot) {
  module.hot.accept();
}
