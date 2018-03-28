import React from 'react';
import Payment from './Payment'
import { connect } from 'react-redux'

let mapStateToProps = (state) => {
  return {
    id: state.active_item
  }
}

class PayBid extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({

    });

    this.pay = this.pay.bind(this)
    this.refresh = this.refresh.bind(this);
    this.refresh();
  }

  async refresh() {
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
      paid: resp.finished,
      name: resp.name,
      price: resp.price
    })
  }

  pay() {
    let { item_id } = this.state;
    Payment.CreateAuction(item_id);
  }

  render() {
    let { paid, name, price } = this.state;
    let content = null;

    if (paid) {
      content = <div>
        <h3>{name}</h3>
        <div>This item has already been paid for</div>
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

export default connect(mapStateToProps)(PayBid)
