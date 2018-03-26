const express = require('express')
const app = express();
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const user_modules = require('./user_modules');
const auth_modules = require('./auth_modules');
const admin_modules = require('./admin_modules');
const Database = require('./database');
const Users = Database.Get('user');
const Event = Database.Get('event')
const { hash_password, verify_password } = require('./util')
const config = require('./config.json')
const crypto = require('crypto')
const { sendMail, sendTemplate, Email, render_template } = require('./email');
const AUTH_LEVELS = [ 'UNAUTH', 'USER', 'ADMIN' ]
const pug = require('pug')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason, Error.stack);
  // application specific logging, throwing an error, or other logic here
});


global.Promise = require('bluebird')
let Promise = require('bluebird')
Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});
app.use(express.static('static'));

app.get('*', (req, res, next) => {
  if(req.headers.api_request) {
    next(); // Awesome we know this is a link/fetch request
  } else {
    res.sendFile(__dirname + '/static/index.html')
  }
})
app.use(cookieParser());

app.use((req, res, next) => {
  if(req.headers.verbose) {
    bodyParser.json()(req, res, () => {
      console.log(req.body, req.cookies, req.cookie);
      next();
    })
  } else {
    next();
  }
})

app.listen(80);
const test_path = path.join(__dirname, '..', 'client', 'event-sys-gui', 'test-results.json')

/**
 * Generates a session id for cookies
 */
let generate_session_id = () => crypto.randomBytes(8).toString('hex');

/**
 * Endpoint to get latest test run
 */
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


/**
 * Endpoint to check if a username/email is used.
 * @method POST
 * @name /exists
 * @body { Object } - the body of the request
 * @body.username { string } - the username to check for
 * @body.email { string } - the email to check for
 */
app.post('/exists', bodyParser.json(), async(req, res) => {
  let { username, email } = req.body;
  let username_lookup = await Users.get('user', { username }, 'id');
  let email_lookup = await Users.get('user', { email }, 'id');

  res.json({
    username: username_lookup.length > 0,
    email: email_lookup.length > 0
  })
})

/**
 * Endpoint to register a user.
 * @method POST
 * @name /register
 * @body { Object } - the body of the request
 * @body.username { string } - the username to register
 * @body.password { string } - the password for the user
 * @body.email { string } - the email for the user
 * @body.f_name { string } - the users first name
 * @body.l_name { string } - the users last name
 */
app.post('/register', bodyParser.json(), async(req, res, next) => {
  let { username, password, email, f_name, l_name } = req.body;
  password = await hash_password(password, config.salt);
  let user = await Users.get('user', { username }, 'id');
  let user_email = await Users.get('user', { email }, 'id');
  if(user.length > 0) {
    res.json({ success: false, error: 'USER_EXISTS' });
  } else if(user_email.length) {
    res.json({ success: false, error: 'EMAIL_EXISTS' });
  } else {
    let verification_code = crypto.randomBytes(8).toString('hex');
    await Users.add('user', { username, password, email, f_name, l_name, registered: true, email_verified: false, verification_code });
    user = await Users.get('user', { username }, 'id');

    let user_id = user[0].id;
    let id = generate_session_id();
    let expires = new Date();
    expires.setDate(expires.getDate() + 30);
    await Users.add('session', { id, user_id, expires });
    res.cookie('id', id, { expires });
    // res.cookie('id', id, { domain: null }); // Cookies don't work on localhost, so use a session cookie to bypass this
    res.json({ id, success: true })

    try {
      let email_data = { name: `${f_name} ${l_name}`, to: email, from: 'no-reply@john-kevin.me', code: verification_code };
      sendTemplate('registered', { subject: 'Registered', ...email_data })
      sendTemplate('confirm_email', { subject: 'Confirm Your Email', email_data })
    } catch(e) {  console.log(e); /* */ }
  }
})

/**
 * Endpoint to log a user in.
 * @method POST
 * @name /login
 * @body { Object } - the body of the request
 * @body.username { string } - the username for the user
 * @body.password { string } - the password for the user
 */
app.post('/login', bodyParser.json(), async(req, res) => {
  let { username, password } = req.body;
  let user = await Users.get('user', { username }, [ 'id', 'password', 'is_admin' ])
  if(user.length > 0) {
    let user_id = user[0].id
    let hash = user[0].password;
    let success = await verify_password(password, hash);
    if(success) {
      let id = generate_session_id();
      let expires = new Date();
      expires.setDate(expires.getDate() + 30);
      await Users.add('session', { id, user_id, expires })
      res.cookie('id', id, { expires })
      res.json({ id, success: true, auth_level: user[0].is_admin ? 'ADMIN' : 'USER' });
    } else {
      res.json({ success: false, error: 'INVALID_AUTH', auth_level: 'UNAUTH' });
    }
  } else {
    res.json({ success: false, error: 'INVALID_AUTH', auth_level: 'UNAUTH' });
  }
})

app.get('/logout', (req, res) => {
  res.clearCookie('id');
  res.json({ success: true });
});

/**
 * Gets the login level of the user [ 0 = Unauthenticated, 1 = Logged-In, 2 = Admin ]
 * @name get_auth_level
 * @param { string } session_id - the users session id from cookie.
 * @returns (<Promise> => Number)
 */
let get_auth_level = (session_id) => {
  return new Promise(async(resolve) => {
    let session = await Users.get('session', { id: session_id }, ['user_id'])
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

/**
 * Verifies a users authentication level is at least a minimum required level.
 * @name verify_auth
 * @param { string } id - the session id to test
 * @param { Number } required - the minimum required level (default: 2)
 */
let verify_auth = async(id, required = 2, req, res, next) => {
  let level = await get_auth_level(id);
  if(level >= required) {
    next();
  } else {
    res.json({ success: false, error: 'UNAUTH' });
  }
}

let test_auth = (level) => async(req, res, next) => {
  let err = await verify_auth((req.cookies || {}).id, level, req, res, next);
}

app.get('/status', async(req, res) => {
  let level = await get_auth_level(req.cookies.id);
  res.json({
    auth_level: AUTH_LEVELS[level]
  })
})

let identify = async(req, res, next) => {
  let id = req.cookies.id;
  let session = await Users.get('session', { id }, [ 'user_id' ]);
  if(session.length > 0) {
    let user = await Users.get('user', { id: session[0].user_id }, 'is_admin')
    req.user_id = session[0].user_id;
    req.is_admin = user[0].is_admin || false;
    next();
  } else {
    res.json({ success: false, error: "UNAUTH" });
  }
}

app.post('/preview/:template', bodyParser.json(), (req, res) => {
  let preview = render_template(req.params.template, { ...req.body })
  res.send(preview);
})

app.get('/event/:id', async(req, res) => {
  let { id } = req.params;

  let [ event ] = await Event.get('event', { id }, [ 'name', 'description', 'start_time', 'end_time' ])
  res.send(event)
})

/**
 * User Modules
 * @level 1
 */
app.use(test_auth(1), identify, auth_modules)
app.use('/user', test_auth(1), identify, user_modules);

/**
 * Admin Modules
 * @level 2
 */
app.use('/admin', test_auth(2), identify, admin_modules);