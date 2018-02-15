// When any of the routes in this module are accessed, we can safely assume that the user is authenticated.
let express = require('express');
let app = express.Router();
let Database = require('../database');
let Users = Database.Get('user');

// Obtains user info
app.get('/info', async(req, res) => {
  let id = req.user_id
  let user = await Users.get('user', { id }, '*');
  if(user.length > 0) {
    res.json(user[0])
  } else {
    res.json({ success: false, error: 'UNKNOWN_USER' })
  }
})

module.exports = app;