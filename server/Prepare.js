const readline = require('readline-sync');
const Database = require('./database');
const { hash_password } = require('./util');
const Users = new Database('user');
const nodemailer = require('nodemailer')
const fs = require('fs')

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

  let smtpTransport = nodemailer.createTransport({
    host,
    port,
    secure: pass == 465,
    auth: {
      user: m_user,
      pass: m_pass
    }
  });


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

  // Register User
  smtpTransport.sendMail(options, (err, info) => {
    if(!err) {
      let config = {
        smtp_host: host,
        smtp_port: port,
        smtp_user: m_user,
        smtp_pass: m_pass,
        salt: salt
      }
      fs.writeFileSync('./config.json', JSON.stringify(config, null, '  '));
    }
  })
}

init();