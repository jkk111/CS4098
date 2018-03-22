import React from 'react';
import './Auction.css'
import AuctionItem from './AuctionItem'

class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    let { expanded } = this.state;
    let { name, description, start_time, end_time, items} = this.props;

    let content = null;

    items = items.map((item, i) => <AuctionItem {...item} key={i} />)

    if(expanded) {
      content = <div className='auction-content'>
        <span className='auction-content-key'>Name</span>
        <span className='auction-content-value'>{name}</span>
        <span className='auction-content-key'>Description</span>
        <span className='auction-content-value'>{description}</span>
        <span className='auction-content-key'>Start</span>
        <span className='auction-content-value'>{start_time}</span>
        <span className='auction-content-key'>End</span>
        <span className='auction-content-value'>{end_time}</span>
      </div>
    }

    let itemsContent = null;

    if(expanded){
      itemsContent = <div>
        {items}
      </div>
    }

    let auction_name_class = expanded ? 'auction-name-expanded' : 'auction-name-collapsed'

    return <div className='auction' >
      <div className={auction_name_class} onClick={this.toggle}>{name}</div>
      {content}
      {itemsContent}
    </div>
  }
}

export default Auction;
