import React from 'react';
import Home from './Home.js';
import ReactDOM from 'react-dom';

describe('Home', () => {
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Home />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
