'use strict';

const Wit = require('node-wit').Wit;
const radioTower = require('./radioTower')();

var contexts = {};

const witToken = process.env.WIT_TOKEN;

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

    radioTower.sendMessage(sessionId, message, (err, data) => {
      if (err) {
        app.log.error('Error sending a response to %s: %s', fbUserId, err.message)
      }
      console.log('calling wit callback after say')
      cb()
    })
  },
  merge: (sessionId, context, entities, message, cb) => {
    // console.log('init context: ' + util.inspect(context, { colors: true, depth: null }));
    // console.log('entities: ' + util.inspect(entities, { colors: true, depth: null }));
   
    const sentiment = firstEntityValue(entities, 'sentiment');
    if (sentiment) {
      context.sentiment = sentiment;
    }
    
    const longEntryResponse = firstEntityValue(entities, 'longEntryResponse');
    if (longEntryResponse) {
      context.longEntryResponse = longEntryResponse;
    }
    
    // console.log('end context: ' + util.inspect(context, { colors: true, depth: null }));
    contexts[sessionId] = context;
    cb(context);
  },
  error: (sessionId, context, error) => {
    console.log(err.message);
  },
  respondToGreetings: (sessionId, context, cb) => {
    context.greeting = 'Hello to you too! How was your day?';
    contexts[sessionId] = context;
    cb(context);
  },
  storeDiaryEntry: (sessionId, context, cb) => {
    
    var savedEntryResponse = 'Not sure I understand...';
    if (context.longEntryResponse === 'negative') {
      savedEntryResponse = 'No problem, I\'m here if you want to talk.';
    } else if (context.longEntryResponse === 'positive') {
      savedEntryResponse = 'Thanks for sharing!';
    }
    context.savedEntryResponse = savedEntryResponse;
    
    contexts[sessionId] = context;
    cb(context);
  }  
};

// Setting up our bot
const wit = new Wit(witToken, actions);

function WitAi () {
  var self = this
  
  self.process = function (sessionId, message) {
      
    // Let's forward the message to the Wit.ai Bot Engine
    // This will run all actions until our bot has nothing left to do
    
    const context = (contexts[sessionId]) ? contexts[sessionId] : {}; 
    
    wit.runActions(
        sessionId, // the user's current session
        message, // the user's message 
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