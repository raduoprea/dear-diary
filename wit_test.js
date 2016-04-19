'use strict';
var util = require('util');

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

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  say: (sessionId, context, msg, cb) => {
    console.log(msg);
    cb();
  },
  merge: (sessionId, context, entities, message, cb) => {
    console.log('init context: ' + util.inspect(context, { colors: true, depth: null }));
    console.log('entities: ' + util.inspect(entities, { colors: true, depth: null }));
   
    const sentiment = firstEntityValue(entities, 'sentiment');
    if (sentiment) {
      context.sentiment = sentiment;
    }
    
    const name = firstEntityValue(entities, 'name');
    if (name) {
      context.name = name;
    }
    
    console.log('end context: ' + util.inspect(context, { colors: true, depth: null }));
    cb(context);
  },
  error: (sessionId, context, error) => {
    console.log(err.message);
  },
};

const client = new Wit(token, actions);
client.interactive();