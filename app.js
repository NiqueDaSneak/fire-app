var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

var app = express()

app.set('port', (process.env.PORT || 3000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

var token = "EAAPDMUuxFGcBACRaCUr9iZAVNL0FJtpnZBtJqrHU8jnGgoSdl2JbkDlQVpeBTZBsniEJZAw7Clxod0C17lb6bGNl6ssjQNp3sj4iuZBLFMeH5JhJbPe5Q8flLpLNx9FLZAzBCjS1xTiSd6WEkVgrN54eUpmfnTR0JpnE55wgppJgZDZD"

curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=EAAPDMUuxFGcBACRaCUr9iZAVNL0FJtpnZBtJqrHU8jnGgoSdl2JbkDlQVpeBTZBsniEJZAw7Clxod0C17lb6bGNl6ssjQNp3sj4iuZBLFMeH5JhJbPe5Q8flLpLNx9FLZAzBCjS1xTiSd6WEkVgrN54eUpmfnTR0JpnE55wgppJgZDZD"

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})



app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})




// Spin up the server
app.listen(process.env.PORT || 3000, function() {
    console.log('running on port', app.get('port'))
})



function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}