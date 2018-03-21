const express = require('express');
const app = express.Router();
const Database = require('../database')
const Events = Database.Get('event')
const payments = require('./payments')
const raffle = require('./raffle')
const bodyParser = require('body-parser')

app.use('/payments', payments.router)
app.use('/raffle', raffle)

app.get('/events', async(req, res) => {
  let events = await Events.get('event', {}, [ 'id','name', 'description', 'venue_id', 'start_time', 'end_time', 'timezone', 'max_attendees' ]);
  let venue_cache = {};
  let ticket_cache = {};

  events.forEach(async(event) => {
    let { id, venue_id } = event;
    let tickets = await Events.get('event_tickets', { event_id: id }, 'ticket_id');
    tickets = tickets.map(async({ ticket_id }) => {
      if(ticket_cache[ticket_id]) {
        return ticket_cache[ticket_id];
      } else {
        let ticket = await Events.get('tickets', { id: ticket_id }, '*')
        ticket_cache[ticket_id] = ticket;
        return ticket
      }
    })

    if(venue_cache[venue_id]) {
      event.venue = venue_cache[venue_id];
    } else {
      let venue = await Events.get('venues', { id: venue_id }, '*')
      venue_cache[venue_id] = venue;
      event.venue = venue;
    }
  })

  res.json(events);
});

app.post('/bid', bodyParser.json(), async(req, res) => {
  let user_id = req.user_id;
  let { amount, auction_item_id } = req.body;
  let base_price = await Auction.get('auction_item', { id: auction_item_id });
  base_price = base_price[0].amount;
  let high_bid = await Auction.get('bid', { auction_item_id }, 'amount', 'ORDER BY amount DESC LIMIT 1');

  if(high_bid.length > 0) {
    base_price = high_bid[0].amount;
  } else {
    base_price = base_price[0].amount
  }

  if(amount > base_price) {
    await Auction.add('bid', { auction_item_id, user_id, amount });
    res.send({ success: true });
  } else {
    res.send({ success: false, error: 'TOO_LOW' })
  }
});

module.exports = app;
