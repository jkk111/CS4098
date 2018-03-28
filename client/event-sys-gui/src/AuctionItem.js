import React from 'react';
import './AuctionItem.css'
import { FloatNumber } from './FloatText'

class AuctionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      bid_error: null
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
      amount: form.price.value * 100,
      auction_item_id: id,
    }

    let resp = await fetch('/bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    resp = await resp.json();

    this.setState({
      bid_error: (resp.success) ? null : 'Bid too low, enter an amount higher than the current bid'
    })

    form.price.value = ''

    if(this.props.refresh) {
      this.props.refresh();
    }
  }

  render() {
    let { expanded, bid_error } = this.state;
    let { name, description, price} = this.props;
    price = price / 100;
    let content = null
    let bidError = null;
    if (bid_error){
      bidError = <div className="error">{bid_error}</div>
    }

    if(expanded){
      content = <div>
        <p className="description"> Description: {description}</p>
        <form onSubmit={this.bid} autoComplete="off" className="bid-form">
          <FloatNumber name="price" label="Enter Your Bid Here:" />
          <p className="price"> Current Bid: {price} Euro</p>
        {bidError}
          <div className='bid-form-input'>
            <input type='submit' className='form-button' submit="bid" value='Bid!'/>
          </div>
        </form>
      </div>
    }

    //let auction_item_name_class = expanded ? 'auction-item-name-expanded' : 'auction-item-name-collapsed'

    return <div className='auction-item' >
      <button className="form-button" onClick={this.toggle}>{name}</button>
      {content}
    </div>
  }
}

export default AuctionItem;
