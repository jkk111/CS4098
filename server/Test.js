const fs = require('fs');
const Database = require('./database');

let modules = fs.readdirSync('./tests');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason, Error.stack);
  // application specific logging, throwing an error, or other logic here
});


global.Promise = require('bluebird')
let Promise = require('bluebird')
Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});


let contains_index = (dir) => {
  let contents = fs.readdirSync(dir);
  if(contents.indexOf('index.js') > -1) {
    return true;
  }
  return false;
}

modules = modules.filter((module) => {
  let stat = fs.statSync('./tests/' + module);
  let ext = module.slice(module.lastIndexOf('.') + 1);
  let can_require = ext === 'js' || stat.isDirectory() && contains_index('./tests/' + module);
  if(can_require) {
    return true;
  }
  return false;
}, [])

let run = async() => {
  for(var module of modules) {
    let test = require(`./tests/${module}`);
    if(test.setup) {
      await test.setup();
    }

    if(test.test) {
      await test.test();
    }

    if(test.teardown) {
      await test.teardown();
    }
  }
}

run();