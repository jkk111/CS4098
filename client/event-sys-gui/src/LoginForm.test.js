import React from 'react';
import LoginForm from './LoginForm.js';
import ReactDOM from 'react-dom';

describe('LoginForm', () => {
  it('should be defined', () => {
    expect(LoginForm).toBeDefined();
  });
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LoginForm />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
