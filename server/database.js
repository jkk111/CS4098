const fs = require('fs');
const sql = require('sqlite3').verbose();

let construct_update_query = (table, insert, select, extra = '') => {


  let where = ''
  let select_keys = Object.keys(select)
  if(select_keys && select_keys.length) {
    where = 'WHERE '
    let first = true;
    for(var key in params) {
      if(!first)
        where += ' AND '
      first = false;
      where += `${key} = ?`
    }
  }

  let SET = ''
  let set_keys = Object.keys(insert);
  if(set_keys && set_keys.length) {
    SET = 'SET '
    let first = true;
    for(var key in set) {
      if(!first)
        SET += ', '
      first = false;
      SET += `${key} = ?`
    }
  }

  return `UPDATE user ${SET} ${WHERE} ${extra}`
}

let construct_insert_query = (table, params, extra = '') => {
  let keys = [];
  for(var key in params) {
    keys.push(key);
  }
  let keys_mapped = keys.map(key => `$${key}`)

  return `INSERT INTO ${table} (${keys.join(', ')}) VALUES(${keys_mapped.join(', ')}) ${extra}`;
}

let construct_select_query = (table, keys = '*', params = {}, extra = '') => {
  if(Array.isArray(keys)) {
    keys = keys.join(', ');
  }

  let WHERE = ''

  let params_keys = Object.keys(params)
  if(params_keys && params_keys.length > 0) {
    WHERE = 'WHERE '
    let first = true;
    for(var key in params) {
      if(!first)
        WHERE += ' AND ';
      first = false;
      WHERE += `${key} = $${key}`
    }
  }

  return `SELECT ${keys} FROM ${table} ${WHERE} ${extra}`
}

let run_query = (db, q, params) => {
  return new Promise((resolve) => {
    db.all(q, params, (err, result) => {
      if(err) {
        console.log(err)
        throw err;
      }
      else {
        resolve(result);
      }
    })
  })
}

let instances = {};

let map_params = (params) => {
  let mapped = {};
  for(var param in params) {
    mapped[`$${param}`] = params[param]
  }
  return mapped
}

class Database {
  static Get(name) {
    if(instances[name]) {
      return name;
    }
    let db = new Database(name);
    instances[name] = db;
    return db;
  }

  constructor(name) {
    this.name = name;
    this.waiting = [];
  }

  prepare() {
    return new Promise(async(resolve) => {
      if(!this.ready) {

        if(this.preparing) {
          this.waiting.push(resolve)
          return;
        }

        this.preparing = true;

        let schema = JSON.parse(fs.readFileSync(`./${this.name}_schema.json`));
        let db = this.db = new sql.Database(`./${this.name}.db`);

        for(var table of schema) {
          await run_query(db, table, []);
        }

        resolve(this.db);
        this.preparing = false;
        this.ready = true;
        for(var cb of this.waiting) {
          cb(this.db);
        }
      }
      else {
        resolve(this.db);
      }
    })
  }

  async query(q, params) {
    if(!this.ready) {
      await this.prepare();
    }
    return run_query(this.db, q, params)
  }

  get(table, params, keys, extra) {
    let query = construct_select_query(table, keys, params, extra);
    return this.query(query, map_params(params));
  }

  add(table, params, extra) {
    let query = construct_insert_query(table, params, extra);

    let mapped_params = {};
    for(var param in params) {
      mapped_params[`$${param}`] = params[param];
    }

    return this.query(query, mapped_params);
  }

  update(table, params, select_params, extra) {
    let query = construct_update_query(table, insert, select, extra);

    let joined = [];
    for(var param in params) {
      joined.push(params[param]);
    }

    for(var param in select_params) {
      joined.push(select_params[param]);
    }
    return this.query(query, params);
  }
}


module.exports = Database;
