// When any of the routes in this module are accessed, we can safely assume that the user is authenticated.
let express = require('express');
let app = express.Router();
let bodyParser = require('body-parser')
let Database = require('../database');
let Users = Database.Get('user');
let Events = Database.Get('events');
let config = require('../config.json');
let { hash_password, verify_password } = require('../util')

// Obtains user info
app.get('/info', async(req, res) => {
  let id = req.user_id
  let user = await Users.get('user', { id }, [ 'f_name', 'l_name', 'email', 'username', 'subscribed' ]);
  if(user.length > 0) {
    res.json(user[0])
  } else {
    res.json({ success: false, error: 'UNKNOWN_USER' })
  }
});

app.get('/events', async(req, res) => {
  let events = await Events.get('event', {}, [ 'id','name' ]);
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
  let { f_name, l_name, email, subscribed } = req.body;
  let id = req.user_id;
  let update = { f_name, l_name, email, subscribed };
  for(var key in update) {
    if(update[key] === undefined) {
      delete update[key]
    }
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

app.get('/resend_confirmation', (req, res) => {

})

app.get('/confirm', (req, res) => {

})

module.exports = app;
