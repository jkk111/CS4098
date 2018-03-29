import React from 'react';
import AuctionItem from './AuctionItem.js';
import ReactDOM from 'react-dom';

describe('AuctionItem', () => {

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <AuctionItem
        name=''
        description=''
        price=''
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
