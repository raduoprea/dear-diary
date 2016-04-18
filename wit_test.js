'use strict';

// When not cloning the `node-wit` repo, replace the `require` like so:
const Wit = require('node-wit').Wit;
//const Wit = require('../').Wit;

const token = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/template.js <wit-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const actions = {
  say: (sessionId, context, msg, cb) => {
    console.log(msg);
    cb();
  },
  merge: (sessionId, context, entities, message, cb) => {
    cb(context);
  },
  error: (sessionId, context, error) => {
    console.log(err.message);
  },
};

const client = new Wit(token, actions);
client.interactive();