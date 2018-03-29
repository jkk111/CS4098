import React from 'react';
import CreateAuction from './CreateAuction.js';
import ReactDOM from 'react-dom';

describe('CreateAuction', () => {

  it('Renders App Without Crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <CreateAuction/>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
