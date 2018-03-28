import React from 'react';
import EventList from './EventList.js';
import ReactDOM from 'react-dom';

describe('EventList', () => {
  it('should be defined', () => {
    expect(EventList).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<EventList/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
