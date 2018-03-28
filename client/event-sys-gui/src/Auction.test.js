import React from 'react';
import Auction from './Auction.js';
import ReactDOM from 'react-dom';

describe('Auction', () => {
  it('should be defined', () => {
    expect(Auction).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Auction
        name=''
        description=''
        start_time=''
        end_time=''
        items={[]}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
