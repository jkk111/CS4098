let sql = require('sqlite3').verbose();
let db = new sql.Database('./user.db');

let query = (q, params) => {
  return new Promise((resolve) => {
    db.all(q, params, (_, result) => {
      resolve(result);
    })
  })
}

class User {
  static highest_doners(date, count = 1) {

  }

  static highest_on_night_doners(date, range = 30, count = 1) {

  }

  static highest_before_night_doner(date, range = 30, count = 1) {

  }

  static highest_after_night_doner(count = 1) {

  }

  constructor(id) {
    this.id = id;
  }

  add_donation() {

  }

  remove_donation() {

  }

  donations() {

  }
}