let bcrypt = require('bcrypt');

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

module.exports = {
  hash_password,
  verify_password
}