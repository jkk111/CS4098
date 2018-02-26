let express = require('express')
let app = express.Router();
const bodyParser = require('body-parser')
const crypto = require('crypto');
const { encode } = require('urlsafe-base64')
let Database = require('../database');
let Users = Database.Get('user')
let Events = Database.Get('event');
let Menus = Database.Get('menu');
let { sendTemplate } = require('../email')
let eventbrite = require('../eventbrite')


let create_registration_token = () => {
  return encode(crypto.randomBytes(32));
}

app.get('/info', async(req, res) => {
  res.json({ success: false, error: 'UNIMPL' })
})

app.get('/users', async(req, res) => {
  let users = await Users.get('user', {}, [ 'id', 'f_name', 'l_name', 'email', 'email_verified', 'subscribed', 'is_admin' ]);
  res.json(users);
});

app.post('/create_user', bodyParser.json(), async(req, res) => {
  let token = create_registration_token();
  let { f_name, l_name, email } = req.body;
  let result = await Users.add('user', { username: token, f_name, l_name, email, password: '' });
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

app.get('/venues', async(req, res) => {
  res.json(await Events.get('venues', {}, '*'))
});

app.get('/tickets', async(req, res) => {
  res.json(await Events.get('tickets', {}, '*'))
});

module.exports = app;
