let bcrypt = require('bcrypt');
let Email = require('./email')

let hash_password = (pass, salt) => {
  return new Promise((resolve) => {
    bcrypt.hash(pass, salt, (_, hash) => resolve(hash))
  })
}

let verify_password = (pass, hashed) => {
  return new Promise((resolve) => {
    bcrypt.compare(pass, hashed, (_, match) => resolve(match));
  })
}

let verification_text = (email, code) => {
  return `Hello
    Please follow the below link to confirm your email
    https://localhost:3000/verify?code=${code}&email=${email}
  `
}

let send_confirmation_email = (email, code) => {
  Email.sendTemplate('confirm_email', {
    from: 'no-reply@john-kevin.me',
    to: email,
    subject: 'verify your email',
    text: verification_text(email, code),
    code
  })
}

module.exports = {
  hash_password,
  verify_password,
  send_confirmation_email
}