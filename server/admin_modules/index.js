let express = require('express')
let app = express.Router();
const bodyParser = require('body-parser')
const crypto = require('crypto');
const { encode } = require('urlsafe-base64')
let Database = require('../database');
let Users = Database.Get('user')
let Events = Database.Get('event');
let Menus = Database.Get('menu');
let Raffle = Database.Get('raffle')
let Auction = Database.Get('auction');
let Payments = Database.Get('payment')
let Payment = require('../auth_modules/payments')
let { sendTemplate } = require('../email')
let eventbrite = require('../eventbrite')

const user_info_keys = [ 'id', 'username', 'f_name', 'l_name', 'registered', 'email', 'phone', 'email_verified', 'subscribed', 'is_admin' ]

let create_registration_token = () => {
  return encode(crypto.randomBytes(32));
}

let user_info = async(id) => {
  let [ user_data ] = await Users.get('user', { id }, user_info_keys);
  let allergens = await Users.get('allergens', { user_id: id }, 'allergen_id');
  allergens = allergens.map(allergen => allergen.allergen_id);
  user_data.allergens = allergens;
  return user_data;
}

app.post('/event_income_breakdown', bodyParser.json(), async(req, res) => {
  let event_id = req.body.event_id;

  let event_tickets = await Events.get('event_tickets', { event_id }, 'ticket_id, available, amount');
  let ticket_txs = [];
  for(var ticket of event_tickets) {
    let ticket_info = await Events.get('user_tickets', { event_id, ticket_id: ticket.ticket_id }, 'id');
    console.log(ticket_info)
    for(var ticket2 of ticket_info) {
      let id = ticket2.id;
      console.log(id);
      let [ tx ] = await Payments.get('transactions', { finished: 1, type: Payment.TICKET, data_id: id }, 'id, user_id, amount, type')
      if(!tx) {
        continue;
      }
      console.log(tx)
      ticket_txs.push(tx);
    }
  }

  console.log(ticket_txs)

  event_tickets = event_tickets.reduce((cur, item) => cur + ((item.amount - item.available) * item.price), 0);
  let donations = await Payments.get('transactions', { finished: 1, type: Payment.DONATION, data_id: event_id }, 'id, user_id, amount, type');

  let event = await Events.get('event', { id: event_id }, '*');
  let { auction_id } = event[0];
  let auction_item_txs = [];
  if(auction_id) {
    let auction_items = Auction.get('auction_item', { auction_id }, 'id');
    auction_items = auction_items.map(item => item.id).join(', ');
    auction_items = `(${auction_items})`

    let data_id = {
      value: auction_items,
      comparator: ' IN '
    }

    auction_item_txs = await Payment.get('transactions', { finished: 1, type: Payment.AUCTION, data_id }, 'id, user_id, amount, type');
  }

  let all_income = [
    ...donations,
    ...auction_item_txs,
    ...ticket_txs
  ].sort((a, b) => a.id - b.id);

  res.send(all_income)
});

app.post('/big_spenders', bodyParser.json(), async(req, res) => {
  let { minimum } = req.body;

  let amount = {
    value: minimum,
    comparator: ' >= '
  }

  let users = await Payments.get('transactions', { finished: true, amount }, 'user_id, SUM(amount) as amount', 'GROUP BY user_id')

  for(var user of users) {
    let user_data = await user_info(user.user_id);
    Object.assign(user, user_data);
  }

  res.send(users);
});

app.post('/regular_spenders', bodyParser.json(), async(req, res) => {
  let { minimum } = req.body;

  let query = `SELECT user_id, SUM(amount) as amount, COUNT(id) as count FROM transactions WHERE finished = 1 GROUP BY user_id HAVING count >= ?`;

  let users = await Payments.query(query, [ minimum ])

  for(var user of users) {
    let user_data = await user_info(user.user_id);
    Object.assign(user, user_data);
  }

  res.send(users);
});

app.get('/info', async(req, res) => {
  res.json({ success: false, error: 'UNIMPL' })
})

app.post('/create_menu', bodyParser.json(), async(req, res) => {
  let menu = req.body;
  let menu_data = { name: menu.name };
  let result = await Menus.add('menu', menu_data);
  let id = result.lastID;

  for(var main of menu.mains) {
    await Menus.add('mains', { menu_id: id, ...main })
  }

  for(var starter of menu.starters) {
    await Menus.add('starters', { menu_id: id, ...starter })
  }

  for(var dessert of menu.desserts) {
    await Menus.add('desserts', { menu_id: id, ...dessert })
  }

  for(var drink of menu.drinks) {
    await Menus.add('drinks', { menu_id: id, ...drink })
  }
  res.send({id, success: true})
});

app.get('/users', async(req, res) => {
  let users = await Users.get('user', {}, [ 'id' ]);

  for(var user of users) {
    let user_data = await user_info(user.id);
    Object.assign(user, user_data)
  }

  res.json(users);
});

app.post('/create_user', bodyParser.json(), async(req, res) => {
  let token = create_registration_token();
  let { f_name, l_name, email } = req.body;
  let result = await Users.add('user', { username: token, f_name, l_name, email, password: '', registered: 0 });
  let id = result.lastID;
  Users.add('pending', { id, f_name, l_name, email, token });
  sendTemplate('user_created', { subject: 'Account Created', to: email, f_name, l_name, email, token })
  res.send({ token })
});

app.post('/promote', bodyParser.json(), async(req, res) => {
  let { id } = req.body;
  let users = await Users.update('user', { is_admin: 1 }, { id });
  res.json({ success: true })
})

app.post('/create_event', bodyParser.json(), async(req, res) => {
  let { tickets, name, description, location, menu_id, start_time, end_time } = req.body;
  let event = { name, description, location, menu_id, start_time, end_time };
  let result = await Events.add('event', event)
  let id = result.lastID;
  let event_tickets = [];

  for(var ticket of tickets) {
    await Events.add('event_tickets', { event_id: id, ticket_id: ticket.id, amount: ticket.count, available: ticket.count });

    let [ details ] = await Events.get('tickets', { id: ticket.id }, '*')
    event_tickets.push({
      name: details.name,
      description: details.description,
      cost: `${details.currency}:${(details.price * 1000)}`,
      currency: details.currency,
      quantity_total: ticket.count
    })
  }

  // Email All Users On Mailing List
  let users = await Users.get('user', { email_verified: true, subscribed: true }, 'f_name, l_name, email');

  for(var user of users) {
    user.name = `${user.f_name} ${user.l_name}`
    let email_data = {
      subject: 'Event Created',
      from: 'no-reply@john-kevin.me',
      to: user.email,
      event_name: name,
      event_description: description,
      event_id: id,
      name: `${user.f_name} ${user.l_name}`,
      ...user
    };

    sendTemplate('event_created', email_data);
  }

  res.send({ id, success: true })
});

app.post('/update_event', bodyParser.json(), async(req, res) => {
  let { event_id, tickets, description, location, start_time, end_time } = req.body;
  console.log(req.body)
  let event = { description, location, start_time, end_time };

  let event_name = await Events.get('event', { id: event_id }, 'name');
  event_name = event_name[0].name;
  await Events.update('event', event, { id: event_id });

  for(var ticket of tickets) {
    await Events.add('event_tickets', { event_id: event_id, ticket_id: ticket.id, amount: ticket.count, available: ticket.count });
  }

  let attendees = await Events.get('user_tickets', { event_id }, 'user_id');
  attendees = attendees.map(attendee => attendee.user_id).join(', ');

  let user_emails = await Users.get('user', { email_verified: true }, 'f_name, l_name, email', `AND id IN (${attendees})`);

  for(var user of user_emails) {
    let email_data = {
      subject: 'Event Updated',
      from: 'no-reply@john-kevin.me',
      to: user.email,
      name: `${user.f_name} ${user.l_name}`,
      event_name: event_name,
      event_id: event_id,
      ...user
    }

    sendTemplate('event_update', email_data)
  }

  res.send({ success: true })
})

app.post('/message_event', bodyParser.json(), async(req, res) => {
  let { event_id, message } = req.body;

  let event_name = await Events.get('event', { id: event_id }, 'name');
  event_name = event_name[0].name;

  let attendees = await Events.get('user_tickets', { event_id }, 'user_id');
  attendees = attendees.map(attendee => attendee.user_id).join(', ');

  let user_emails = await Users.get('user', { email_verified: true }, 'f_name, l_name, email', `AND user_id IN (${attendees})`);

  await Events.add('event_updates', { event_id, message });

  for(var user of user_emails) {
    let email_data = {
      subject: 'Event Message',
      from: 'no-reply@john-kevin.me',
      to: user.email,
      name: `${user.f_name} ${user.l_name}`,
      event_name: event_name,
      event_id: event_id,
      message,
      ...user
    }

    sendTemplate('event_message', email_data)
  }

  res.send({ success: true })
})

app.post('/create_ticket', bodyParser.json(), async(req, res) => {
  let { name, description, price, currency } = req.body;

  let row = {
    name,
    description,
    price,
    currency
  }

  let ticket = await Events.add('tickets', row);
  let id = ticket.lastID;

  res.json({ id, success: true });
});

app.post('/create_auction', bodyParser.json(), async(req, res) => {
  let { name, description, start_time, end_time } = req.body;

    let id = await Auction.add('auction', { name, description, start_time, end_time })
    id = id.lastID;
    res.send({ id });
});

app.post('/create_auction_item', bodyParser.json(), async(req, res) => {
  let { name, description, auction_id, starting_price } = req.body;

  let id = await Auction.add('auction_item', { name, description, starting_price, auction_id });
  id = id.lastID;
  res.send({ id })
});

app.post('/create_raffle', bodyParser.json(), async(req, res) => {
  let { description, ticket_count, ticket_price, end_date, prizes = [] } = req.body;
  let raffle = { description, ticket_count, ticket_price, end_date };
  let insert = await Raffle.add('raffles', raffle);
  let raffle_id = insert.lastID;

  for(var prize of prizes) {
    let winning_value = crypto.randomBytes(4).readUInt32LE(0);
    prize.winning_value = winning_value;
    prize.raffle_id = raffle_id;
    await Raffle.add('prizes', prize, '*')
  }

  res.send({ id: raffle_id });
});

app.post('/add_prize', bodyParser.json(), async(req, res) => {
  let { raffle_id, prize } = req.body;
  let winning_value = crypto.randomBytes(4).readUInt32LE(0);
  prize.winning_value = winning_value;
  prize.raffle_id = raffle_id;
  await Raffle.add('prizes', prize, '*')
  res.send('OK')
})

app.get('/tickets', async(req, res) => {
  res.json(await Events.get('tickets', {}, '*'))
});

app.get('/menus', async(req, res) => {
  let menus = await Menus.get('menu', {}, '*');
  for(var menu of menus) {
    menu.starters = await Menus.get('starters', { menu_id: menu.id }, '*');
    menu.mains = await Menus.get('mains', { menu_id: menu.id }, '*');
    menu.desserts = await Menus.get('desserts', { menu_id: menu.id }, '*');
    menu.drinks = await Menus.get('drinks', { menu_id: menu.id }, '*');
  }
  res.json(menus);
})

module.exports = app;
