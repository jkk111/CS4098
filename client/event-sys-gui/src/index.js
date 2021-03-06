import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './react-datetime.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux'

let _fetch = fetch;
window.fetch = (res = '', init = {}) => {
  let headers = init.headers || {};
  init.headers = headers;
  headers.api_request = true
  return _fetch(res, {
    ...init,
    credentials: 'same-origin'
  })
}

let loading = true;

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
  },

  admin_info: (state = { pending: true }, action) => {
    if(action.type === 'ADMIN_INFO_CHANGED') {
      return action.value
    } else if(action.type === 'LOGIN_STATE_CHANGED') {
      if(action.value !== 'ADMIN') {
        return { pending: true }
      }
    }
    return state;
  },

  active_view: (state = {}, action) => {
    let { past = [], current = 'HOME' } = state;
    if(action.type === 'VIEW_CHANGED') {
      let next = action.value;
      past = [ ...past, current ];
      return { past, current: next }
    } else if(action.type === 'LOGIN_STATE_CHANGED') {
      if(action.value === 'UNAUTH') {
        return { past: [], current: 'HOME' }
      }
    } else if(action.type === 'BACK') {
      let next_past = past.slice();
      let prev = next_past.pop();
      return { past: next_past, current: prev || 'HOME' }
    }

    return state;
  },

  active_event: (state = {}, action) => {
    let { past = [], current = null } = state;
    if(action.type === 'TRACK_EVENT') {
      let next = action.value
      past = [ ...past, current ];
      return { past, current: next }
    } else if(action.type === 'BACK') {
      let next_past = past.slice();
      let prev = next_past.pop();
      return { past: next_past, current: prev }
    }
    return state;
  },

  event_data: (state = null, action) => {
    if(action.type === 'SET_EVENT_DATA') {
      return action.value;
    } else if(action.type === 'VIEW_CHANGED') {
      if(action.value !== 'CREATE_EVENT') {
        return null;
      }
    }
    return state;
  },

  active_item: (state = null, action) => {
    if(action.type === 'VIEW_BID') {
      return action.value;
    }
    return state;
  }
}

reducers = combineReducers(reducers);

let store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
let last = null

let update_user_data = async() => {
  let resp = await fetch('/status');
  let status = await resp.json();

  if(status.auth_level !== 'UNAUTH') {
    let user_info = await fetch('/user/info');
    user_info = await user_info.json();
    store.dispatch({ type: 'USER_INFO_CHANGED', value: user_info })
  }

  if(status.auth_level === 'ADMIN') {
    let admin_info = await fetch('/admin/info');
    admin_info = await admin_info.json();
    store.dispatch({ type: 'ADMIN_INFO_CHANGED', value: admin_info })
  }

  // Do this last so our info isn't still pending, preventing a reload loop.
  store.dispatch({ type: 'LOGIN_STATE_CHANGED', value: status.auth_level });
}

let state_whitelist = [ 'active_view', 'active_event' ]

let update_state = (currentState) => {
  if(!currentState) {
    return
  }
  let state = {};

  for(var key of state_whitelist) {
    state[key] = currentState[key].current;
  }
  let state_obj = state;
  state = btoa(JSON.stringify(state));

  window.history.pushState(state_obj, 'Current State', `/?state=${state}`);
}

window.addEventListener('popstate', (pop) => {
  console.log(pop);
  let { state } = pop;
  console.log(state);
  store.dispatch({ type: 'BACK' })
})

store.subscribe(async() => {
  if(loading) {
    return
  }

  let state = store.getState();
  update_state(state);
  let due_update = false;
  if(last !== null) {
    due_update = state.logged_in !== 'UNAUTH' && state.logged_in !== last.logged_in && state.info.pending;
  }
  if(last === null || due_update) {
    last = state;
    await update_user_data();
  }
  last = state;
})

window.store = store;

let parse_query = () => {
  let query = window.location.search.slice(1);
  let pairs = query.split('&')
  let result = {};
  pairs.forEach(pair => {
    let [key, value = '' ] = pair.split('=');
    result[key] = value;
  })
  return result
}

let check_verify = async() => {
  if(window.location.pathname === '/verify') {
    let { code, email } = parse_query();

    if(code && email) {
      let resp = await fetch('/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, email })
      })

      console.log(resp);
    }
  }
}

let check_view_event = () => {
  if(window.location.pathname === '/event') {
    let { id } = parse_query();
    if(id) {
      store.dispatch({ type: 'TRACK_EVENT', value: id })
      store.dispatch({ type: 'VIEW_CHANGED', value: 'SINGLE_EVENT_VIEW' })
    }
  }
}

let check_view_item = () => {
  if(window.location.pathname === '/auction_pay') {
    let { id } = parse_query();
    if(id) {
      store.dispatch({ type: 'VIEW_CHANGED', value: 'PAY_BID' });
      store.dispatch({ type: 'VIEW_BID', value: id })
    }
  }
}

update_user_data().then(async() => {
  await check_verify();
  await check_view_event();
  await check_view_item();
  loading = false;
  if(store.getState().logged_in !== 'UNAUTH') {
    let qs = parse_query();
    let { state = '' } = qs;
    state = atob(state);
    console.log(store.getState().logged_in, state)

    if(state.trim() !== '') {
      state = JSON.parse(state)
      console.log(state)
      if(state.active_view) {
        store.dispatch({ type: 'VIEW_CHANGED', value: state.active_view })
      }

      if(state.active_event) {
        store.dispatch({ type: 'TRACK_EVENT', value: state.active_event })
      }
    }
  }

  ReactDOM.render(<Provider store={store}>
    <App {...props}  />
  </Provider>, document.getElementById('root'));
})

registerServiceWorker();

console.clear = () => {}
