import React from 'react';
import Ticket from './Ticket.js';
import ReactDOM from 'react-dom';

describe('Ticket', () => {
  it('should be defined', () => {
    expect(Ticket).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Ticket />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
