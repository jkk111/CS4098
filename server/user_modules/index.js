// When any of the routes in this module are accessed, we can safely assume that the user is authenticated.
let express = require('express');
let app = express.Router();
let bodyParser = require('body-parser')
let Database = require('../database');
let Users = Database.Get('user');
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
  console.log(req.body);
  let existing = req.body.currentPassword;
  let newPass = req.body.newPassword;
  let id = req.user_id;
  let user = await Users.get('user', { id }, 'password');
  let match = await verify_password(existing, user[0].password);

  console.log(id, user, match, existing);

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