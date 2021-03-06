require('colors')
console.log("Running Admin Test Suite".green)
let config = require('../config.json')
let util = require('../util')
let { fork } = require('child_process');
let srv = null;
let _rp = require('request-promise').defaults({ jar: true });
let Database = require('../database')

// let Post = (req) => {
//   req.headers = req.headers || {};
//   req.headers.api_request = true;
//   req.method = 'POST'
//   console.log(req)
//   return _rp(req);
// }

let get = (req) => {
  if(typeof req === 'string') {
    req = {
      url: req
    }
  }
  if(!req.headers) {
    req.headers = {};
  }
  req.json = true;
  req.headers.api_request = true;
  return _rp(req);
}

let post = (req) => {
  if(!req.headers) {
    req.headers = {};
  }
  req.method = 'POST';
  req.json = true;
  req.headers.api_request = true;
  req.headers['Content-Type'] = 'application/json'
  req.jar = true;
  return _rp(req);
}

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

let setup = async() => {
  return new Promise(async(resolve) => {
    await Database.Destroy('user');
    await Database.Destroy('event');
    await Database.Destroy('payment');
    await Database.Destroy('table');
    srv = fork('index')
    await Database.Get('user').prepare();
    await Database.Get('event').prepare();
    await Database.Get('payment').prepare();
    await Database.Get('table').prepare();
    setTimeout(resolve, 2000);
  })
}

let create_user = async(username, password, f_name, l_name, email) => {
  let resp = await post({
    url: 'http://localhost/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      username,
      password,
      f_name,
      l_name,
      email
    },
    jar: true
  });
  return resp;
}

let create_admin_user = async() => {
  let test = new Test('Testing creating an admin', 1);
  test.pre();
  let user = {
    username: "admin",
    password: await util.hash_password('admin', config.salt),
    f_name: 'admin',
    l_name: 'admin',
    email: 'admin',
    is_admin: 1
  }
  let User = await Database.Get('user')
  let u = await User.add('user', user)
  test.post(u.lastID);
}

let create_new_admin = async() => {
  let create_test = new Test("Creating User Account", true);
  create_test.pre()
  let user = await create_user('admin_2', 'admin_2', 'admin_2', 'admin_2', 'admin_2');
  create_test.post(user.success);

  let promote_test = new Test("Testing Promting User", "ADMIN");
  promote_test.pre();
  await post({
    url: 'http://localhost/login',
    body: {
      username: 'admin',
      password: 'admin'
    }
  })

  await post({
    url: 'http://localhost/admin/promote',
    body: {
      id: 2
    }
  })

  let promoted = await post({
    url: 'http://localhost/login',
    body: {
      username: 'admin_2',
      password: 'admin_2'
    }
  })
  promote_test.post(promoted.auth_level);
}

let test_create_ticket = async() => {
  let test = new Test("Testing Creating a ticket", { success: true, id: 1});
  test.pre();
  let ticket = await post({
    url: 'http://localhost/admin/create_ticket',
    body: {
      name: 'vip-ticket',
      description: 'ticket for vips',
      price: 1000,
      currency: 'EUR'
    }
  })

  test.post(ticket)
}

let create_event = async() => {
  let test = new Test("Creating Event", { success: true, id: 1});
  test.pre();
  let start = new Date();
  start.setHours(9);
  start.setDate(start.getDate() + 60);
  let end = new Date(start);
  end.setHours(18);

  let event = {
    name: "Test Event",
    description: "Test Description",
    location: 'Test Location',
    tickets: [
      { id: 1, count: 100 }
    ],
    start_time: start.getTime(),
    end_time: end.getTime()
  }

  let resp = await post({
    url: 'http://localhost/admin/create_event',
    body: event
  })

  test.post(resp)
}

let test_users = async() => {
  let test = new Test("Testing users", true)
  test.pre();

  let users = await get('http://localhost/admin/users');

  test.post(Array.isArray(users));
}

let admin_create_user = async() => {
  let test = new Test("Testing Creating User as admin", true)
  test.pre();
  let u = {
    f_name: 'user',
    l_name: 'user',
    email: 'user'
  }

  let resp = await post({
    url: 'http://localhost/admin/create_user',
    body: u
  })

  test.post(resp.token != null)
}

let event_income_breakdown_test = async() => {
  let test = new Test('Testing Event Income Breakdown Endpoint', [])
  let body = { event_id: 1 };
  test.pre();
  let resp = await post({
    url: 'http://localhost/admin/event_income_breakdown',
    body
  })

  test.post(resp);
}

let layouts_Test = async() => {
  let test = new Test('Testing Table Layouts Endpoint', [])
  test.pre();
  let resp = await get({
    url: 'http://localhost/admin/layouts'
  })

  test.post(resp);
}

let create_layouts_Test = async() => {
  let test = new Test('Testing Table Layouts Endpoint', { id: 1 })
  test.pre();

  let body = { description: "Test Layout", tables: [ { x: 1, y: 1} ]}

  let resp = await post({
    url: 'http://localhost/admin/create_layout',
    body
  })

  test.post(resp);
}

let update_layouts_Test = async() => {
  let test = new Test('Testing Table Layouts Endpoint', { id: 1 })
  test.pre();

  let body = { layout_id: 1, tables: [ { x: 1, y: 1} ]}

  let resp = await post({
    url: 'http://localhost/admin/update_layout',
    body
  })

  test.post(resp);
}

let test_spenders = async () => {
  let test = new Test('Testing Big Spenders', []);

  test.pre();

  let body = { minimum: 0 }

  let resp = await post({
    url: 'http://localhost/admin/big_spenders',
    body
  })

  test.post(resp);
  test = new Test('Testing Regular Spenders', []);

  test.pre();

  resp = await post({
    url: 'http://localhost/admin/regular_spenders',
    body
  })

  test.post(resp);
}

let test = async() => {
  await create_admin_user();
  await create_new_admin();
  await test_users();
  await test_create_ticket();
  await create_event();
  await admin_create_user();
  await event_income_breakdown_test();
  await layouts_Test();
  await create_layouts_Test();
}

let teardown = async() => {
  srv.kill();
  await Database.Destroy('user')
  await Database.Destroy('event')
}

module.exports = {
  setup,
  test,
  teardown
}
