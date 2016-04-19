const request = require('request')
const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN

module.exports = function () {
  return new RadioTower();
}

function RadioTower() {
  var self = this;
  
  self.sendMessage = function (sender, text, done) {
    request({
      method: 'POST',
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: accessToken
      },
      json: {
        recipient: {
          id: sender
        },
        message: {
          text: text
        }
      }
    }, function (error, response, body) {
      if (error) {
        return done(error)
      } else if (response.body && response.body.error) {
        return done(response.body.error)
      }

      console.log('Sent facebook text message')
      done(null)
    })
  }
}