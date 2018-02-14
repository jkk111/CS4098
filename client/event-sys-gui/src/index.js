import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux'

let props = {
  test_view: window.location.search.indexOf("tests") > -1
}

let reducers = {
  logged_in: (state = 'UNAUTH', action) => {
    if(action.type === 'LOGIN_STATE_CHANGED') {
      return action.value;
    }
    return state;
  }
}

reducers = combineReducers(reducers);

let store = createStore(reducers);

let resp = fetch('/status', {
  method: 'GET'
}).then((body) => {
  body.json().then(() => {
    ReactDOM.render(<Provider store={store}>
      <App {...props}  />
    </Provider>, document.getElementById('root'));
  })
})
registerServiceWorker();
