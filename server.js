var Botkit = require('botkit')

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
var verifyToken = process.env.FB_VERIFY_TOKEN
var port = process.env.PORT

if (!accessToken) throw new Error('FB_PAGE_ACCESS_TOKEN is required but missing.')
if (!verifyToken) throw new Error('FB_VERIFY_TOKEN is required but missing.')
if (!port) throw new Error('PORT is required but missing.')

var controller = Botkit.facebookbot({
    accessToken: accessToken,
    verifyToken: verifyToken
})

var bot = controller.spawn()

controller.setupWebserver(port, function (err, webserver) {
    if (err) return console.log(err)
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log('Webserver Ready')
    })
})

controller.hears(['hello', 'hi'], 'message_received', function (bot, message) {
    bot.reply(message, 'Hello to you too!')
})