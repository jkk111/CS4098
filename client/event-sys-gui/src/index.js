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

  info: (state = { pending: true }, action) => {
    if(action.type === 'USER_INFO_CHANGED') {
      return action.value
    } else if(action.type === 'LOGIN_STATE_CHANGED') {
      if(action.value === 'UNAUTH') {
        return { pending: true };
      }
    }
    return state;
  }
}

reducers = combineReducers(reducers);

let store = createStore(reducers);
let last = store.getState();

let update_user_data = async() => {
  let resp = await fetch('/status');
  let status = await resp.json();

  if(resp.auth_level !== 'UNAUTH') {
    let user_info = await fetch('/user/info');
    user_info = await user_info.json();
    store.dispatch({ type: 'USER_INFO_CHANGED', value: user_info })
  }

  if (resp.auth_level === 'ADMIN') {
    let admin_info = await fetch('/admin/info');
    admin_info = await admin_info.json();
    store.dispatch({ type: 'ADMIN_INFO_CHANGED', value: admin_info })
  }

  // Do this last so our info isn't still pending, preventing a reload loop.
  store.dispatch({ type: 'LOGIN_STATE_CHANGED', value: status.auth_level });
}

store.subscribe(async() => {
  let state = store.getState();

  if(state.logged_in !== 'UNAUTH' && state.logged_in !== last.logged_in && state.info.pending) {
    last = state;
    await update_user_data();
  }

  last = state;
})

window.store = store;

update_user_data().then(() => {
  ReactDOM.render(<Provider store={store}>
    <App {...props}  />
  </Provider>, document.getElementById('root'));
})

registerServiceWorker();
