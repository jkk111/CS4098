let express = require('express')
let app = express.Router();
const bodyParser = require('body-parser')
let Database = require('../database')
let Users = Database.Get('user')
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

app.get('/users', async(req, res) => {
  let users = await Users.get('user', {}, [ 'id', 'f_name', 'l_name', 'email', 'is_admin' ]);
  res.json(users);
});

app.post('/create_user', bodyParser.json(), (req, res) => {

});

app.post('/promote', bodyParser.json(), async(req, res) => {
  let { id } = req.body;
  let users = await Users.update('user', { is_admin: 1 }, { id });
  res.json({ success: true })
})

module.exports = app;