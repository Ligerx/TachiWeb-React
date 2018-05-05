import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from 'material-ui/CssBaseline';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import Router from './routes';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './redux-ducks';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, logger)));

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Provider store={store}>
      <Router />
    </Provider>
  </React.Fragment>,
  document.getElementById('root'),
);
registerServiceWorker();

// NOTE: this type of hot reload does not preserve state. Hopefully fix in the future?
// https://daveceddia.com/hot-reloading-create-react-app/
if (module.hot) {
  module.hot.accept();
}
