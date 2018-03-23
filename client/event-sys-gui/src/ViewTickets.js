import React from 'react';
import Ticket from './Ticket'

class ViewTickets extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { tickets } = this.props;
    tickets = tickets.map((ticket, i) => <Ticket refresh={this.refresh} {...ticket} key={i} />)
    return <div>
        {tickets}
    </div>
  }
}

export default ViewTickets
