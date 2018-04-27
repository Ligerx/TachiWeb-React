import React from 'react';
import ReactDOM from 'react-dom';
import Library from 'containers/Library';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Library />, document.getElementById('root'));
registerServiceWorker();
