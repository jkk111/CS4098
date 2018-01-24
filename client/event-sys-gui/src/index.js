import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let props = {
  test_view: window.location.search.indexOf("tests") > -1
}

ReactDOM.render(<App {...props}  />, document.getElementById('root'));
registerServiceWorker();
