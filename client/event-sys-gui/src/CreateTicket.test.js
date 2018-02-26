import React from 'react';
import CreateTicket from './CreateTicket.js';
import ReactDOM from 'react-dom';

describe('CreateTicket', () => {
  it('should be defined', () => {
    expect(CreateTicket).toBeDefined();
  });
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CreateTicket />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
