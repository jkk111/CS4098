import React from 'react';
import FloatText from './FloatText.js';
import ReactDOM from 'react-dom';

describe('FloatText', () => {
  it('should be defined', () => {
    expect(FloatText).toBeDefined();
  });
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<FloatText />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
