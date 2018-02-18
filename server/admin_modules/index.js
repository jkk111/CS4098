let express = require('express')
let app = express.Router();
const bodyParser = require('body-parser')
const crypto = require('crypto');
const { encode } = require('urlsafe-base64')
let Database = require('../database');
let Users = Database.Get('user')
let PendingUsers = Database.Get('pending_user');
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
  PendingUsers.add('pending_user', { id, f_name, l_name, email, token });
  sendTemplate('pending-user', { f_name, l_name, email, token })
  res.send({ token })
});

app.post('/promote', bodyParser.json(), async(req, res) => {
  let { id } = req.body;
  let users = await Users.update('user', { is_admin: 1 }, { id });
  console.log(users);
  res.json({ success: true })
})

app.post('/create_event', bodyParser.json(), async(req, res) => {
  let { name, location, description, max_attendees, price, start_time, end_time } = req.body;
  let event = { name, location, description, max_attendees, price, start_time, end_time };
  let result = await Events.add('event', event)
  let id = result.lastID

  // Email All Users On Mailing List
  let users = await Users.get('user', { email_verified: true, subscribed: true }, 'email');
  users = users.map(user => user.email).join(', ');

  let link = `/events/${id}`
  sendTemplate('new-event', { name, description, link, users });

  res.send({ id, success: true })
});

module.exports = app;
