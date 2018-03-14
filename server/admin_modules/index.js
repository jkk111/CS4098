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
let { sendTemplate } = require('../email')
let eventbrite = require('../eventbrite')


let create_registration_token = () => {
  return encode(crypto.randomBytes(32));
}

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
  let users = await Users.get('user', {}, [ 'id', 'username', 'f_name', 'l_name', 'registered', 'email', 'phone', 'email_verified', 'subscribed', 'is_admin' ]);
  res.json(users);
});

app.post('/create_user', bodyParser.json(), async(req, res) => {
  let token = create_registration_token();
  let { f_name, l_name, email } = req.body;
  let result = await Users.add('user', { username: token, f_name, l_name, email, password: '', registered: 0 });
  let id = result.lastID;
  Users.add('pending', { id, f_name, l_name, email, token });
  sendTemplate('pending-user', { f_name, l_name, email, token })
  res.send({ token })
});

app.post('/promote', bodyParser.json(), async(req, res) => {
  let { id } = req.body;
  let users = await Users.update('user', { is_admin: 1 }, { id });
  res.json({ success: true })
})

app.post('/create_event', bodyParser.json(), async(req, res) => {
  let { tickets, name, description, venue_id, max_attendees, start_time, end_time, timezone } = req.body;
  let event = { name, description, venue_id, max_attendees, start_time, end_time, timezone };
  let result = await Events.add('event', event)
  let id = result.lastID;
  let event_tickets = [];

  for(var ticket of tickets) {
    await Events.add('event_tickets', { event_id: id, ticket_id: ticket.id, amount: ticket.count });

    let [ details ] = await Events.get('tickets', { id: ticket.id }, '*')
    event_tickets.push({
      name: details.name,
      description: details.description,
      cost: `${details.currency}:${(details.price * 1000)}`,
      currency: details.currency,
      quantity_total: ticket.count
    })
  }

  let [ venue ] = await Events.get('venues', { id: venue_id }, '*')

  console.log(event_tickets, venue)
  await eventbrite(event, event_tickets, venue)
  // Email All Users On Mailing List
  let users = await Users.get('user', { email_verified: true, subscribed: true }, 'email');
  users = users.map(user => user.email).join(', ');

  let link = `/events/${id}`
  console.log("If we had an active mail server, we would email all subscribed users")
  sendTemplate('new-event', { name, description, link, users });

  res.send({ id, success: true })
});

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

app.post('/create_venue', bodyParser.json(), async(req, res) => {
  let { name, description, address_1, address_2, city, country, capacity } = req.body;

  let row = {
    name,
    description,
    address_1,
    address_2,
    city,
    country,
    capacity
  };

  let venue = await Events.add('venues', row)
  let id = venue.lastID;

  res.json({ id, success: true })
})

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

app.get('/venues', async(req, res) => {
  res.json(await Events.get('venues', {}, '*'))
});

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
