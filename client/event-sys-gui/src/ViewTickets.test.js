import React from 'react';
import ViewTickets from './ViewTickets.js';
import ReactDOM from 'react-dom';

describe('ViewTickets', () => {

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ViewTickets />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
