import React from 'react';
import './AuctionItem.css'
import FloatNumber from './FloatText'

class AuctionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
    this.bid = this.bid.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  async bid(e){
    e.preventDefault();
    let form = e.target;

    let { id } = this.props;

    let body = {
      amount: form.price.value,
      auction_item_id: id,
    }
    console.log('creating ticket', body);
    let resp = await fetch('/bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    console.log(resp);
  }

  render() {
    let { expanded } = this.state;
    let { name, description, price} = this.props;
    let content = null

    if(expanded){
      content = <div>
        <p className="description">{description}</p>
        <p className="price">Current Bid: {price}</p>
        <form onSubmit={this.bid} autoComplete="off">
          <FloatNumber name="price" label="Enter Your Bid Here:" />
          <div className='bid-form-input'>
            <input type='submit' className='form-button' submit="bid" value='Bid!'/>
          </div>
        </form>
      </div>
    }

    let auction_item_name_class = expanded ? 'auction-item-name-expanded' : 'auction-item-name-collapsed'

    return <div className='auction-item' >
      <div className={auction_item_name_class} onClick={this.toggle}>{name}</div>
      {content}
    </div>
  }
}

export default AuctionItem;
