import React from 'react';
import Menu from './Menu.js';
import ReactDOM from 'react-dom';

describe('Menu', () => {
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Menu starters={[]} mains={[]} desserts={[]} drinks={[]}/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
