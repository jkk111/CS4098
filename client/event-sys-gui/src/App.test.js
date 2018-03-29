import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import jsdom from 'jsdom'
import Enzyme, { mount } from 'enzyme'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  window.StripeCheckout = {
    // We just need to mock the checkout API here so we don't crash
    configure: () => { return { open: () => {}, close: () => {} }}
  }
})

it('Renders App Without Crashing', () => {
  const div = document.createElement('div');

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

    active_view: (state = 'HOME', action) => {
      if(action.type === 'VIEW_CHANGED') {
        return action.value;
      } else if(action.type === 'LOGIN_STATE_CHANGED') {
        if(action.value === 'UNAUTH') {
          return 'HOME'
        }
      }
      return state;
    }
  }

  reducers = combineReducers(reducers);

  let store = createStore(reducers);

  ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
