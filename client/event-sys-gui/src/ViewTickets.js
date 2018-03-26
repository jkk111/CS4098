import React from 'react';
import Ticket from './Ticket'

let ViewTickets = ({ tickets = [], event_id }) => {
  tickets = tickets.map((ticket, i) => <Ticket event_id = {event_id} {...ticket} key={i} />)
  return <div>
    {tickets}
  </div>
}

export default ViewTickets
