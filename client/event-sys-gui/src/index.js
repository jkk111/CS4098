import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux'

let _fetch = fetch;
window.fetch = (res = '', init = {}) => {
  return _fetch(res, {
    ...init,
    credentials: 'same-origin'
  })
}

let props = {
  test_view: window.location.search.indexOf("tests") > -1
}

let reducers = {
  logged_in: (state = 'UNAUTH', action) => {
    if(action.type === 'LOGIN_STATE_CHANGED') {
      return action.value;
    }
    return state;
  },

  info: (state = {}, action) => {
    if(action.type === 'USER_INFO_CHANGED') {
      return action.value
    } else if(action.type === 'LOGIN_STATE_CHANGED') {
      if(action.value === 'UNAUTH') {
        return {};
      }
    }
    return state;
  }
}

reducers = combineReducers(reducers);

let store = createStore(reducers);
let last = store.getState();

store.subscribe(async() => {
  let state = store.getState();

  console.log(state.logged_in, last.logged_in)

  if(state.logged_in !== 'UNAUTH' && state.logged_in !== last.logged_in) {
    last = state;
    let resp = await fetch('/user/info')
    resp = await resp.json();

    store.dispatch({
      type: 'USER_INFO_CHANGED',
      value: resp
    })
  }
  last = state;
})

window.store = store;

let resp = fetch('/status', {
  method: 'GET',
  credentials: 'same-origin'
}).then((body) => {
  body.json().then((json) => {
    store.dispatch({ type: 'LOGIN_STATE_CHANGED', value: json.auth_level })
    ReactDOM.render(<Provider store={store}>
      <App {...props}  />
    </Provider>, document.getElementById('root'));
  })
})
registerServiceWorker();
