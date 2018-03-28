import React from 'react';
import Dropdown from './Dropdown.js';
import ReactDOM from 'react-dom';

describe('Dropdown', () => {
  it('should be defined', () => {
    expect(Dropdown).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Dropdown/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
