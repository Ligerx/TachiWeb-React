import React from 'react';
import ReactDOM from 'react-dom';
import Library from 'containers/Library';
import CssBaseline from 'material-ui/CssBaseline';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div>
    <CssBaseline />
    <Library />
  </div>,
  document.getElementById('root'),
);
registerServiceWorker();
