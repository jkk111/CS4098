import React from 'react';
import './Ticket.css'
import Payment from './Payment'

class Ticket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.buy = this.buy.bind(this);
  }

  buy(){
    let { event_id, id } = this.props;
    console.log("Event:", event_id, "Ticket: ", id);
    Payment.CreateTicket(event_id, id);
  }

  render() {
    let { name, price } = this.props;
    let content = null;
    content = <div>
      {name}
      <button className="buy-button" onClick={this.buy}>Buy for {price}</button>
    </div>

    return <div className='ticket'>
      {content}
    </div>
  }
}

export default Ticket;
