import React from 'react';
import Tracker from './Tracker.js';
import ReactDOM from 'react-dom';

describe('Tracker', () => {
  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Tracker />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
