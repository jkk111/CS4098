import React from 'react';
import CreateAuctionItem from './CreateAuctionItem.js';
import ReactDOM from 'react-dom';

describe('CreateAuctionItem', () => {
  it('should be defined', () => {
    expect(CreateAuctionItem).toBeDefined();
  });

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <CreateAuctionItem/>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
