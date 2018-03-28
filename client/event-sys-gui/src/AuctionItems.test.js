import React from 'react';
import AuctionItems from './AuctionItems.js';
import ReactDOM from 'react-dom';

describe('AuctionItems', () => {
  it('should be defined', () => {
    expect(AuctionItems).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <AuctionItems auctionItems={[]}/>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
