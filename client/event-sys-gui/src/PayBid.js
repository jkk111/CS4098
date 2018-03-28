import React from 'react';
import Payment from './Payment'

class PayBid extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({

    });

    this.pay = this.pay.bind(this)
  }

  async fetchItemDetails() {
    let { id } = this.props;

    let body = {
      item_id: id
    }

    let resp = await fetch('/item_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    resp = await resp.json();

    this.setState({
      payed: resp.finished,
      name: resp.name,
      price: resp.price
    })
  }

  pay() {
    let { item_id } = this.state;
    Payment.CreateAuction(item_id);
  }

  render() {
    let { payed, name, price } = this.state;
    price /= 100;
    let content = null;

    if (payed){
      content = <div>
        <h3>{name}</h3>
        <div>This item has already been payed for</div>
      </div>
    } else {
      content = <div>
        <h3>{name}</h3>
        <div onClick={this.pay} className="form-button">Pay bid of {price}</div>
      </div>
    }

    return <div>
      {content}
    </div>
  }
}

export default PayBid
