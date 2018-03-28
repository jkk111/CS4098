const express = require('express');
const app = express.Router();
const Database = require('../database')
const Events = Database.Get('event')
const Payment = require('./payments')
const Users = Database.Get('user')
const Menus = Database.Get('menu')
// const raffle = require('./raffle')
const bodyParser = require('body-parser')
const Auction = Database.Get('auction')
const Payments = Database.Get('payment')

app.use('/payments', Payment.router)
// app.use('/raffle', raffle)

app.get('/events', async(req, res) => {
  let events = await Events.get('event', {}, [ 'id','name', 'description', 'location', 'menu_id', 'start_time', 'end_time' ]);
  let ticket_cache = {};

  for(var event of events) {
    let { id } = event;
    let tickets = await Events.get('event_tickets', { event_id: id }, 'ticket_id, available, amount');
    let updates = await Events.get('event_updates', { event_id: id }, '*');
    for(var ticket of tickets) {
      let { ticket_id } = ticket;
      if(ticket_cache[ticket_id]) {
        Object.assign(ticket, ticket_cache[ticket_id]);
      } else {
        let ticket_data = await Events.get('tickets', { id: ticket_id }, '*')
        ticket_cache[ticket_id] = ticket_data[0];
        Object.assign(ticket, ticket_cache[ticket_id])
      }
    }

    if(req.is_admin) {
      let attendees = await Events.get('user_tickets', { event_id: id }, 'user_id');
      for(var attendee of attendees) {
        let user_data = await Users.get('user', { id: attendee.user_id }, ['f_name', 'l_name', 'email', 'accessibility']);
        let user_allergens = await Users.get('allergens', { user_id: attendee.id }, 'allergen_id');
        Object.assign(attendee, user_data);
        attendee.allergens = user_allergens.map(allergen => allergen.allergen_id);
      }
    }

    if(event.menu_id != null) {
      let menu = {};
      menu.starters = await Menus.get('starters', { menu_id: event.menu_id })
      menu.mains = await Menus.get('mains', { menu_id: event.menu_id })
      menu.desserts = await Menus.get('desserts', { menu_id: event.menu_id })
      menu.drinks = await Menus.get('drinks', { menu_id: event.menu_id })
      event.menu = menu;
    }

    event.tickets = tickets;
    event.updates = updates;
  }

  res.json(events);
});

app.post('/counter', bodyParser.json(), async(req, res) => {
  let event_id = req.body.event_id;

  if(!event_id) {
    return res.send({ total: 0 })
  }

  let event_tickets = await Events.get('event_tickets', { event_id }, 'ticket_id, available, amount');
  for(var ticket of event_tickets) {
    let ticket_info = await Events.get('tickets', { id: ticket.ticket_id }, 'price');
    Object.assign(ticket, ticket_info[0]);
  }

  event_tickets = event_tickets.reduce((cur, item) => cur + ((item.amount - item.available) * item.price), 0);
  let donations = await Payments.get('transactions', { finished: 1, type: Payment.DONATION, data_id: event_id }, 'amount');
  donations = donations.reduce((cur, item) =>  cur + item.amount, 0);

  let event = await Events.get('event', { id: event_id }, '*');
  let { auction_id } = event[0];
  let auction_item_txs_total = 0;
  if(auction_id) {
    let auction_items = Auction.get('auction_item', { auction_id }, 'id');
    auction_items = auction_items.map(item => item.id).join(', ');
    auction_items = `(${auction_items})`

    let data_id = {
      value: auction_items,
      comparator: ' IN '
    }

    let auction_item_txs = await Payment.get('transactions', { finished: 1, type: Payment.AUCTION, data_id }, 'amount');
    auction_item_txs_total = auction_item_txs.reduce((cur, item) => cur + item.amount, 0)
  }


  let total = donations + event_tickets + auction_item_txs_total;
  res.send({ total })
});

app.post('/bid', bodyParser.json(), async(req, res) => {
  let user_id = req.user_id;
  let { amount, auction_item_id } = req.body;
  let base_price = await Auction.get('auction_item', { id: auction_item_id });
  base_price = base_price[0].starting_price;
  let high_bid = await Auction.get('bid', { auction_item_id }, 'amount', 'ORDER BY amount DESC LIMIT 1');

  console.log(base_price, high_bid, amount)

  if(high_bid.length > 0) {
    base_price = high_bid[0].amount;
  }

  if(amount > base_price) {
    await Auction.add('bid', { auction_item_id, user_id, amount });
    res.send({ success: true });
  } else {
    res.send({ success: false, error: 'TOO_LOW' })
  }
});

app.post('/item_info', bodyParser.json(), async(req, res) => {
  let { item_id } = req.body;

  let [ item ] = await Auction.get('auction', { id: item_id });
  let price = await Auction.get('bid', { auction_item_bid: id }, '*', 'ORDER BY amount desc LIMIT 1');
  let [ transaction ] = await Payment.get('transactions', { data_id: id, type: AUCTION }, 'id, finished');
  let { transaction_id, finished } = transaction || {};

  if(!transaction_id) {
    res.send({ success: false, error: 'TRANSACTION_NOT_EXIST' });
  }

  let resp = {};
  Object.assign(resp, item)

  resp.transaction_id = transaction_id;
  resp.finished = finished
  res.send(resp);
})

app.get('/auctions', async(req, res) => {
  let auctions = await Auction.get('auction', {});

  for(var auction of auctions) {
    let { id } = auction;
    let items = await Auction.get('auction_item', { auction_id: id });

    for(var item of items) {
      let price = item.starting_price;
      let high_bid = await Auction.get('bid', { auction_item_id: item.id }, 'amount', 'ORDER BY amount DESC LIMIT 1');

      if(high_bid[0] && high_bid[0].amount > price) {
        price = high_bid[0].amount
      }

      item.price = price;
    }

    auction.items = items;
  }

  res.send(auctions)
})

module.exports = app;
