import React from 'react';
import MultiDropdown from './MultiDropdown.js';
import ReactDOM from 'react-dom';

describe('MultiDropdown', () => {
  it('should be defined', () => {
    expect(MultiDropdown).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MultiDropdown children={[]}/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
