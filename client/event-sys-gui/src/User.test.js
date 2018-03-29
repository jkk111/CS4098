import React from 'react';
import User from './User.js';
import ReactDOM from 'react-dom';

describe('User', () => {
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<User />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
