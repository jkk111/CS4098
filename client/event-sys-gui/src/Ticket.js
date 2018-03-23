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
    Payment.CreateEvent(event_id, id);
  }

  render() {
    let { name, id, event_id, price } = this.props;
    console.log(name, id, event_id);
    let content = null;
    content = <div>
      <p>{name}: {price}</p>
      <button onClick={this.buy}>Buy</button>
    </div>

    return <div className='ticket'>
      {content}
    </div>
  }
}

export default Ticket;
