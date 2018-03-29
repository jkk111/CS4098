import React from 'react';
import CreateMenu from './CreateMenu.js';
import ReactDOM from 'react-dom';

describe('CreateMenu', () => {

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CreateMenu />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
