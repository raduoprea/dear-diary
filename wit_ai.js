'use strict';

const Wit = require('node-wit').Wit;

const WIT_TOKEN = process.env.WIT_TOKEN;

module.exports = function () {
  return new WitAi()
}

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
  say: (sessionId, context, message, cb) => {
    console.log(message);
    cb();
  },
  merge: (sessionId, context, entities, message, cb) => {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc;
    }
    cb(context);
  },
  error: (sessionId, context, error) => {
    console.log(error.message);
  },
  'fetch-weather': (sessionId, context, cb) => {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.forecast = 'sunny';
    cb(context);
  },
};

// Setting up our bot
const wit = new Wit(WIT_TOKEN, actions);

function WitAi () {
  var self = this
  
  self.process = function (msg) {
      
    // Let's forward the message to the Wit.ai Bot Engine
    // This will run all actions until our bot has nothing left to do
    
    const sessionId = "testSession";
    const context = {}; 
    
    wit.runActions(
        sessionId, // the user's current session
        msg, // the user's message 
        context, // the user's current session state
        (error, context) => {
        if (error) {
            console.log('Oops! Got an error from Wit:', error);
        } else {
            // Our bot did everything it has to do.
            // Now it's waiting for further messages to proceed.
            console.log('Waiting for futher messages.');

            // Based on the session state, you might want to reset the session.
            // This depends heavily on the business logic of your bot.
            // Example:
            // if (context['done']) {
            //   delete sessions[sessionId];
            // }

            // Updating the user's current session state
            // sessions[sessionId].context = context;
        }
     });
      
  }
  
}