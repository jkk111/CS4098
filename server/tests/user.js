require('colors')
console.log("Running User Test Suite".green)

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

let create_user = async() => {
  let test_create_user = new Test("Creating User", true)
  test_create_user.pre();
  let resp = await post({
    url: 'http://localhost/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      username: 'test',
      password: 'test',
      f_name: 'test',
      l_name: 'test',
      email: 'test'
    },
    jar: true
  })

  test_create_user.post(resp.success)
}

let get_user_info = async() => {
  let user_info_test = new Test('Getting User Info', {"f_name":"test","l_name":"test","email":"test","username":"test","phone":"","email_verified":0,"subscribed":0,"accessibility":"","allergens":[]});
  user_info_test.pre();

  let resp = await get({
    url: 'http://localhost/user/info',
    method: 'GET'
  })

  user_info_test.post(resp)
  return resp;
}

let get_user_info2 = async() => {
  let user_info_test = new Test('Getting Updated User Info', {"f_name":"test","l_name":"updated","email":"test","username":"test","phone":"","email_verified":0,"subscribed":0,"accessibility":"","allergens":[]});
  user_info_test.pre();

  let resp = await get({
    url: 'http://localhost/user/info',
    method: 'GET'
  })

  user_info_test.post(resp)
  return resp;
}

let update_user_info = async(info) => {
  info.l_name = 'updated';
  let user_info_test = new Test('Updating User Info', true);
  user_info_test.pre();

  let resp = await get({
    url: 'http://localhost/user/update_info',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: info
  })

  user_info_test.post(resp.success)
  return resp;
}

let change_password = async(info) => {
  let test_change_password = new Test('Updating Password', true);
  test_change_password.pre()
  let resp = await post({
    url: 'http://localhost/user/change_password',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      newPassword: 'updated',
      currentPasswprd: 'test'
    }
  })
  test_change_password.post(resp.success)

  let test_new_password = new Test('Testing Updated Password', 'USER');
  test_new_password.pre();

  resp = await post({
    url: 'http://localhost/user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      username: 'test',
      password: 'updated'
    }
  })
  test_new_password.post(resp.auth_level)
}

let setup = async() => {
  return new Promise(async(resolve) => {
    await Database.Destroy('user');
    srv = fork('index')
    await Database.Get('user').prepare();
    setTimeout(resolve, 2000);
  })
}

let test = async() => {
  await create_user();
  await update_user_info(await get_user_info())
  await get_user_info2()
}

let teardown = async() => {
  srv.kill();
  await Database.Destroy('user')
}

module.exports = {
  setup,
  test,
  teardown
}
