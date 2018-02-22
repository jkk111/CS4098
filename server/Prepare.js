const readline = require('readline-sync');
const Database = require('./database');
const { hash_password } = require('./util');
const Users = Database.Get('user');
const nodemailer = require('nodemailer')
const fs = require('fs')
const { _send } = require('./email')

const bcrypt = require('bcrypt');
const salt_iterations = 10;
// Module to set up databases and stuff

let generate_salt = () => {
  return bcrypt.genSalt(salt_iterations);
}

let question = (q) => {
  return new Promise((resolve) => {
    resolve(readline.question(`${q}: `));
  })
}

let password = (q) => {
  return new Promise((resolve) => {
    let password = readline.question(`${q}: `, { hideEchoBack: true })
    let confirm = readline.question("Confirm: ", { hideEchoBack: true })
    resolve(password === confirm ? password : false)
  })
}

let init = async() => {
  await Users.prepare();
  let admins = await Users.get('user', { is_admin: 1 }, 'id');
  if(admins.length > 0) {
    console.log('Database Already Setup\nSkipping.')
    return;
  }
  let salt = await generate_salt();
  console.log("First we will create an admin user");
  let f_name = await question("First Name");
  let l_name = await question("Last Name");
  let user = await question("Username");
  let pass = false;

  while(!pass) {
    pass = await password("Password");
  }

  pass = await hash_password(pass, salt)
  let mail = await question("Email");

  console.log('Next we need to set up SMTP');
  let host = await question("SMTP Host");
  let port = await question("SMTP Port");
  let m_user = await question("Mail User");
  let m_pass = false;
  while(!m_pass) {
    m_pass = await password("Mail Password");
  }

  let options = {
    from: `Admin <${m_user}>`,
    to: mail,
    subject: 'Testing',
    text: 'If you see this that means setup was successful',
    html: `<div style="background:black; color: green;">
      <div>Welcome agent ${f_name} ${l_name}</div>
      <div>Your registration was successful</div>
      <div>You are now a member of an elite group of super villains</div>
    </div>`
  }

  await Users.add('user', { username: user, password: pass, f_name, l_name, email: mail, is_admin: 1 })
  let hash_test = await hash_password('test', salt)

  for(var i = 0; i < 5; i++) {
    let username = `test${i + 1}`;
    let password = hash_test;
    let f_name = `Test-${i + 1}`;
    let l_name = 'User';
    let email = `test-${i + 1}@user.abstact.domain.that.does.not.exist.tcd.ie`
    await Users.add('user', { username, password, f_name, l_name, email})
  }

  await Users.add('user', { username: 'test-admin', password: hash_test, f_name: 'test', l_name: 'admin', email: 'admin@user.abstact.domain.that.does.not.exist.tcd.ie', is_admin: 1 })

  let config = {
    smtp_host: host,
    smtp_port: port,
    smtp_user: m_user,
    smtp_pass: m_pass,
    salt: salt
  }

  _send(config, options, (err, info) => {
    if(!err) {
      fs.writeFileSync('./config.json', JSON.stringify(config, null, '  '));
    } else {
      config.noEmail = true;
      fs.writeFileSync('./config.json', JSON.stringify(config, null, '  '));
      console.log(err);
    }
  })
}

init();
