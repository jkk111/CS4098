import React from 'react';
import AuctionItems from './AuctionItems.js';
import ReactDOM from 'react-dom';

describe('AuctionItems', () => {

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <AuctionItems auctionItems={[]}/>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
