/**
 * This module provides an abstraction layer around a database allowing,
   construction and execution of queries on a database
 */
const fs = require('fs');
const sql = require('sqlite3').verbose();

/**
 * Builds a query to update rows in a table
 * @param { string } table - the target table name
 * @param { object } insert - the keys to update
 * @param { object } select - the keys to match
 * @param { string } extra - any additional query string
 * @returns { string }
 */
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



/**
 * Builds a query to insert rows into a table
 * @param { string } table - the target table name
 * @param { object } params - key value pairs for row columns
 * @param { string } extra - any additional query string
 * @returns { string }
 */
let construct_insert_query = (table, params, extra = '') => {
  let keys = [];
  for(var key in params) {
    keys.push(key);
  }
  let keys_mapped = keys.map(key => `$${key}`)

  return `INSERT INTO ${table} (${keys.join(', ')}) VALUES(${keys_mapped.join(', ')}) ${extra}`;
}


/**
 * Builds a query to select rows from a table
 * @param { string } table - the target table name
 * @param { array | string } keys - the keys to get
 * @param { object } params - the key value pairs to match
 * @param { string } extra - any additional query string
 * @returns { string }
 */
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

/**
 * Runs a specified query on a provided database
 * @param { Object } db - The database to run
 * @param { string } q - the sql query to run
 * @param { Object | Array } params - the params for the query
 */
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


// We can't have a static instances list on the database class so we scope a list locally
let instances = {};

/**
 * Maps from kv pair to sqlite friendly varient
 * @param { object } params - the params to convert
 * @returns { object }
 */
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
