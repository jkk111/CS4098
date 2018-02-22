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