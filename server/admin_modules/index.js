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

  // await Menus.add('starter', { menu_id: id, name: starter_name, description: starter_desc, allergen: starter_allg });
  // await Menus.add('main', { menu_id: id, name: main_name, description: main_desc, allergen: main_allg });
  // await Menus.add('desserts', { menu_id: id, name: desserts_name, description: desserts_desc, allergen: desserts_allg });
  // await Menus.add('drinks', { menu_id: id, name: drinks_name, description: drinks_desc, allergen: drinks_allg });

  res.send({id, success: true})
});

app.post('/create_event', bodyParser.json(), async(req, res) => {
  let { name, description, venue_id, max_attendees, start_time, end_time } = req.body;
  let event = { name, description, venue_id, max_attendees, start_time, end_time };
  let result = await Events.add('event', event)
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
  res.json(await Events.get('venues', {}, '*'))
});

app.get('/tickets', async(req, res) => {
  res.json(await Events.get('tickets', {}, '*'))
});

module.exports = app;
