let express = require('express')
let app = express.Router();
const bodyParser = require('body-parser')
const crypto = require('crypto');
const { encode } = require('urlsafe-base64')
let Database = require('../database');
let Users = Database.Get('user')
let Events = Database.Get('event');
let { sendTemplate } = require('../email')
/*
  User Struct {
    id: { integer }
    name: { f_name: string, l_name: string },
    email: { string: address, subscribed: bool },
  }
 */

/*
  TODO:
    Create User Accounts on user behalf
    Create/Promote Admin Accounts
    Create Events
 */

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
  let { name, description, venue_id, max_attendees, start_time, end_time } = req.body;
  let event = { name, description, venue_id, max_attendees, start_time, end_time };
  let result = await Events.add('event', event);
  let id = result.lastID;

  for(var ticket of req.body.tickets) {
    await Events.add('event_tickets', { event_id: id, ticket_id: ticket.id, amount: ticket.count });
  }

  // Email All Users On Mailing List
  let users = await Users.get('user', { email_verified: true, subscribed: true }, 'email');
  users = users.map(user => user.email).join(', ');

  let link = `/events/${id}`
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
  // let venues = [
  //   { "id": "1", "name": "venue 1",
  //     "description": "venue 1 description", "address_1": "address line 1",
  //     "address_2": "address line 2", "city": "city 1",
  //     "country": "country 1", "capacity": "100"
  //   },
  //   { "id": "2", "name": "venue 2",
  //     "description": "venue 2 description", "address_1": "address line 1",
  //     "address_2": "address line 2", "city": "city 2",
  //     "country": "country 2", "capacity": "200"
  //   },
  //   { "id": "3", "name": "venue 3",
  //     "description": "venue 3 description", "address_1": "address line 1",
  //     "address_2": "address line 2", "city": "city 3",
  //     "country": "country 3", "capacity": "300"
  //   }
  // ]
  // res.json(venues);
  res.json(await Events.get('venues', {}, '*'))
});

app.get('/tickets', async(req, res) => {
  res.json(await Events.get('tickets', {}, '*'))
});

module.exports = app;
