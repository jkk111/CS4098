import React from 'react';
import ViewMenus from './ViewMenus.js';
import ReactDOM from 'react-dom';

describe('ViewMenus', () => {
  it('should be defined', () => {
    expect(ViewMenus).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ViewMenus />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
