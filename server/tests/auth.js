require('colors')

console.log("Running Auth Test Suite".green)

let { fork } = require('child_process');
let srv = null;
let Database = require('../database');
let _rp = require('request-promise').defaults({ jar: true });
let bcrypt = require('bcrypt')
let create_admin_body = { username: 'admin', f_name: 'test', l_name: 'admin', email: "admin@127.0.0.1", is_admin: 1 }
const { hash_password } = require('../util')

const admin_pass = 'password'

let compare = (a, b) => {
  if(typeof a !== typeof b) {
    return false;
  }

  if(typeof a === 'object') {
    let checked = {};
    for(var key in a) {
      if(!compare(a[key], b[key])) {
        return false;
      }
      checked[key] = true;
    }

    for(var key in b) {
      if(key in checked) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  return a === b;
}

class Test {
  constructor(description, expected_result) {
    this.description = description;
    this.expected_result = expected_result;
  }

  pre() {
    console.log(`[${this.description}]`.blue)
  }

  post(result) {
    if(compare(result, this.expected_result)) {
      console.log("Success".green)
    } else {
      console.log("Fail".red);
      let exp = '\n' + JSON.stringify(this.expected_result) + '\n'
      exp += JSON.stringify(result)
      throw new Error("Test Result Invalid" + exp)
    }
  }
}

let rp = (req) => {
  if(!req.headers) {
    req.headers = {};
  }
  req.json = true;
  req.headers.api_request = true;
  return _rp(req);
}

let setup = async() => {
  return new Promise(async(resolve) => {
    await Database.Destroy('user')
    create_admin_body.password = await hash_password(admin_pass, await bcrypt.genSalt(10));
    srv = fork('index')
    setTimeout(resolve, 2000);
  })
}

let create_admin = async() => {
  let test_create_admin = new Test("Creating Admin Account", 1);
  test_create_admin.pre()
  let Users = Database.Get('user');
  await Users.prepare();
  let admin = await Users.add('user', create_admin_body)
  let id = admin.lastID;
  test_create_admin.post(id)
}

let login = async() => {
  let test_login = new Test('Admin Login', 'ADMIN')
  test_login.pre();
  let resp = await rp({
    url: 'http://localhost/login',
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      username: 'admin',
      password: admin_pass
    }
  })
  test_login.post(resp.auth_level);
}

let create_user = async() => {
  let test_create_user = new Test('User Registration', true)
  test_create_user.pre();

  let resp = await rp({
    url: 'http://localhost/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      email: 'test_user@127.0.0.1',
      f_name: 'test',
      l_name: 'test',
      password: 'test',
      username: 'test'
    }
  })

  test_create_user.post(resp.success)
}

let test_exists = async() => {
  let test_user_exists = new Test('User Exists', { username: true, email: false })
  let test_mail_exists = new Test('Email Exists', { username: false, email: true })
  let test_both_exists = new Test('User and Email Exists', { username: true, email: true })

  let req = (username, email) => {
    return rp({
      url: 'http://localhost/exists',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { username, email }
    })
  }

  test_user_exists.pre();
  let resp = await req('admin', 'fakeemail')
  test_user_exists.post(resp)

  test_mail_exists.pre();
  resp = await req('admain', 'admin@127.0.0.1')
  test_mail_exists.post(resp)

  test_both_exists.pre();
  resp = await req('admin', 'admin@127.0.0.1')
  test_both_exists.post(resp)
}

let logout = async() => {
  let test_logout = new Test('Logout', true);
  test_logout.pre();
  let resp = await rp({ url: 'http://localhost/logout' })
  test_logout.post(resp.success)
}

let test_status = async() => {
  let test_user_status = new Test("Expecting Admin", "ADMIN")
  test_user_status.pre();
  let resp = await rp({ url: 'http://localhost/status' });
  test_user_status.post(resp.auth_level);
}

let test = async() => {
  await create_admin();
  await login();
  await test_status();
  await create_user();
  await test_exists();
  await logout();
}

let teardown = async() => {
  srv.kill()
  await Database.Destroy('user')
}

module.exports = {
  setup,
  test,
  teardown
}