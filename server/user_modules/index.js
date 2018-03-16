// When any of the routes in this module are accessed, we can safely assume that the user is authenticated.
let express = require('express');
let app = express.Router();
let bodyParser = require('body-parser')
let Database = require('../database');
let Users = Database.Get('user');
let Events = Database.Get('event');
let config = require('../config.json');
let crypto = require('crypto')
let { hash_password, verify_password, send_confirmation_email } = require('../util')

const Allergens = [
  "Gluten",
  "Crustaceans",
  "Eggs",
  "Fish",
  "Peanuts",
  "Soybeans",
  "Milk",
  "Nuts",
  "Celery",
  "Mustard",
  "Sesame",
  "Sulphur Dioxide",
  "Lupin",
  "Molluscs"
]

// Obtains user info
app.get('/info', async(req, res) => {
  let id = req.user_id
  let user = await Users.get('user', { id }, [ 'f_name', 'l_name', 'email', 'username', 'phone', 'email_verified', 'subscribed' ]);
  if(user.length > 0) {

    let user_id = id;

    let allergens = await Users.get('allergens', { user_id }, 'allergen_id')
    allergens = allergens.map(allergen => allergen.allergen_id);
    user[0].allergens = allergens

    res.json(user[0])
  } else {
    res.json({ success: false, error: 'UNKNOWN_USER' })
  }
});

app.get('/events', async(req, res) => {
  let events = await Events.get('event', {}, [ 'id','name', 'venue_id', 'start_time', 'end_time', 'description', 'max_attendees' ]);
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

app.post('/update_info', bodyParser.json(), async(req, res) => {
  let { f_name, l_name, email, phone, subscribed, allergens = [] } = req.body;
  let id = req.user_id;
  let update = { f_name, l_name, email, phone, subscribed };

  for(var allergen of allergens) {
    let update_allergen = { user_id: id, allergen_id: allergen }
    await Users.add("allergens", update_allergen)
  }

  for(var key in update) {
    if(update[key] === undefined) {
      delete update[key]
    }
  }

  let current_email = await Users.get('user', { id }, 'email')

  current_email = current_email[0].email;
  if(current_email !== email) {
    update.email_verified = false;
    let verification_code = crypto.randomBytes(8).toString('hex');
    update.verification_code = verification_code;
    send_confirmation_email(email, verification_code);
  }

  await Users.update('user', update, { id })

  res.send({ success: true })
})

app.post('/change_password', bodyParser.json(), async(req, res) => {
  let existing = req.body.currentPassword;
  let newPass = req.body.newPassword;
  let id = req.user_id;
  let user = await Users.get('user', { id }, 'password');
  let match = await verify_password(existing, user[0].password);

  if(match) {
    let hashed = await hash_password(newPass, config.salt);
    await Users.update('user', { password: hashed }, { id })
    res.send({ success: true })
  } else {
    res.send({ success: false, error: 'INVALID_PASSWORD' })
  }
});

app.post('/verify', bodyParser.json(), async(req, res) => {
  let { code, email } = req.body;

  let user = await Users.get('user', { email, verification_code: code }, 'id');

  if(user.length > 0) {
    await Users.update('user', { email_verified: true }, { id: user[0].id })
    res.send({ success: true })
  } else {
    res.status(400).send({ success: false });
  }
});

app.get('/resend_confirmation', async(req, res) => {
  let user = await Users.get('user', { id: req.user_id }, '*');
  user = user[0];
  send_confirmation_email(user.email, user.verification_code);
  res.send({ success: true })
})

module.exports = app;
