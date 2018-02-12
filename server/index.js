let express = require('express')
let app = express();
let fs = require('fs')
let path = require('path')
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser')
let user_modules = require('./user_modules');
let admin_modules = require('./admin_modules');

const Database = require('./database');
const Sessions = Database.Get('session');
const Users = Database.Get('user');
const { verify_password } = require('./util')
const config = require('./config.json')
const crypto = require('crypto')

app.use(express.static('static'));
app.listen(80);
app.use(cookieParser());

let generate_session_id = () => crypto.randomBytes(8).toString('base64');

const test_path = path.join(__dirname, '..', 'client', 'event-sys-gui', 'test-results.json')

app.get('/tests', (req, res) => {
  let data = fs.readFileSync(test_path);
  data = JSON.parse(data);

  let results = [];

  for(var test of data.testResults) {
    for(var result of test.testResults) {
      results.push({
        name: result.title,
        success: result.status === 'passed'
      })
    }
  }

  res.send(results)
})

app.post('/exists', bodyParser.json(), async(req, res) => {
  let { username, email } = req.body;
  let username_lookup = await Users.get('user', { username }, 'id');
  let email_lookup = await Users.get('user', { email }, 'id');

  res.json({
    username: username_lookup.length > 0,
    email: email_lookup.length > 0
  })
})

app.post('/register', bodyParser.json(), async(req, res, next) => {
  let { username, password, email, f_name, l_name } = req.body;

  let user = await Users.get('user', { username }, 'id');
  let user_email = await Users.get('user', { email }, 'id');
  if(user.length > 0) {
    res.json({ success: false, error: 'USER_EXISTS' });
  } else if(user_email.length) {
    res.json({ success: false, error: 'EMAIL_EXISTS' });
  } else {
    await Users.add('user', { username, password, email, f_name, l_name });
    user = await Users.get('user', { username }, 'id');

    let user_id = user[0].id;
    let id = generate_session_id();
    let expires = new Date();
    expires.setDate(expires.getDate(), + 30);
    await Sessions.add('session', { id, user_id, expires });
    res.cookie('id', id, { expires });
    res.json({ success: true })
  }
})

app.post('/login', bodyParser.json(), async(req, res) => {
  let { username, password } = req.body;
  let user = await Users.get('user', { username }, [ 'id', 'password' ])
  if(user.length > 0) {
    let user_id = user[0].id
    let hash = user[0].password;
    let success = verify_password(pass, hash);
    if(success) {
      let id = generate_session_id();
      let expires = new Date();
      expires.setDate(expires.getDate() + 30);
      await Sessions.add('session', { id, user_id, expires })
      res.cookie('id', id, { expires })
      res.json({ success: true });
    } else {
      res.json({ error: 'INVALID_AUTH' })
    }
  }
})

let get_auth_level = (session_id) => {
  return new Promise(async(resolve) => {
    let session = Sessions.get('session', { id: session_id }, ['user_id'])
    if(session.length > 0) {
      let user_id = session[0].user_id;
      let user = await Users.get('user', { id: user_id }, [ 'is_admin' ]);
      if(user.length > 0) {
        let is_admin = user[0].is_admin;
        resolve(is_admin ? 2 : 1);
      } else {
        resolve(0);
      }
    } else {
      resolve(0);
    }
  })
}

let verify_auth = async(id, required = 2) => {
  let level = await get_auth_level(id);
  if(level >= required) {
    next();
  } else {
    next(new Error('Unauthenticated'));
  }
}

let test_auth = async(req, res, next) => {
  let err = await verify_auth((req.cookie || {}).id, 2, next);
}

let test_admin_auth = async(req, res, next) => {
  let err = await verify_auth((req.cookie || {}).id, 2, next);
}

app.use('/user', test_auth, user_modules);
app.use('/admin', test_admin_auth, admin_modules);