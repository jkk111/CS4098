let express = require('express')
let app = express.Router();
const bodyParser = require('body-parser')
const crypto = require('crypto');
const { encode } = require('urlsafe-base64')
let Database = require('../database');
let Users = Database.Get('user')
let PendingUsers = Database.Get('pending-user');
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
  let users = await Users.get('user', {}, [ 'id', 'f_name', 'l_name', 'email', 'is_admin' ]);
  res.json(users);
});

app.post('/create_user', bodyParser.json(), (req, res) => {
  let id = create_registration_token();
  let { f_name, l_name, email } = req.body;
  PendingUsers.add('pending-user', { f_name, l_name, email, id });
  sendTemplate('pending-user', { f_name, l_name, email, id })
  res.send({ id })
});

app.post('/promote', bodyParser.json(), async(req, res) => {
  let { id } = req.body;
  let users = await Users.update('user', { is_admin: 1 }, { id });
  res.json({ success: true })
})

module.exports = app;