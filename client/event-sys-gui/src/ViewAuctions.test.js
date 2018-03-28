import React from 'react';
import ViewAuctions from './ViewAuctions.js';
import ReactDOM from 'react-dom';

describe('ViewAuctions', () => {
  it('should be defined', () => {
    expect(ViewAuctions).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ViewAuctions />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
