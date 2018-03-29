import React from 'react';
import SignupForm from './SignupForm.js';
import ReactDOM from 'react-dom';

describe('SignupForm', () => {
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SignupForm />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

});
