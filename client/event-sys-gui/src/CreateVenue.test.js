import React from 'react';
import CreateVenue from './CreateVenue.js';
import ReactDOM from 'react-dom';

describe('CreateVenue', () => {
  it('should be defined', () => {
    expect(CreateVenue).toBeDefined();
  });
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CreateVenue />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
