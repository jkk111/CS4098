import React from 'react';
import './Auction.css'

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
    let { name, description, start_time, end_time/*, items*/} = this.props;

    let content = null;

    if(expanded) {
      content = <div className='user-content'>
        <span className='auction-content-key'>Name</span>
        <span className='auction-content-value'>{name}</span>
        <span className='auction-content-key'>Description</span>
        <span className='auction-content-value'>{description}</span>
        <span className='auction-content-key'>Start</span>
        <span className='user-content-value'>{start_time}</span>
        <span className='user-content-key'>End</span>
        <span className='user-content-value'>{end_time}</span>
      </div>
    }

    let auction_name_class = expanded ? 'auction-name-expanded' : 'auction-name-collapsed'

    return <div className='auction' >
      <div className={auction_name_class} onClick={this.toggle}>{name}</div>
      {content}
    </div>
  }
}

export default Auction;
