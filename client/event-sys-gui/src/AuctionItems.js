import React from 'react';
import { Logger } from './Util'
import AuctionItem from './AuctionItem'

class AuctionItems extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { auctionItems } = this.props;

    auctionItems = auctionItems.map((auctionItem, i) => <AuctionItem {...auctionItem} key={i} />)
    return auctionsItems
  }
}

export default AuctionItems
