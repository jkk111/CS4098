import React from 'react';
import Contact from './Contact.js';
import ReactDOM from 'react-dom';

describe('Contact', () => {
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Contact />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
