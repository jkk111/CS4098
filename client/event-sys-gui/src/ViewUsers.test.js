import React from 'react';
import ViewUsers from './ViewUsers.js';
import ReactDOM from 'react-dom';

describe('ViewUsers', () => {
  it('should be defined', () => {
    expect(ViewUsers).toBeDefined();
  });
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ViewUsers />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
