var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();


// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

var verify_token = 'my_voice_is_my_password_verify_me';
var token = "EAAPDMUuxFGcBACRaCUr9iZAVNL0FJtpnZBtJqrHU8jnGgoSdl2JbkDlQVpeBTZBsniEJZAw7Clxod0C17lb6bGNl6ssjQNp3sj4iuZBLFMeH5JhJbPe5Q8flLpLNx9FLZAzBCjS1xTiSd6WEkVgrN54eUpmfnTR0JpnE55wgppJgZDZD";


app.use(bodyParser.json());

app.get('/', function (req, res) {

    res.send('Hello World! This is the bot\'s root endpoint!');

});

app.get('/webhook/', function (req, res) {

    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong validation token');

});

app.post('/webhook/', function (req, res) {

    var messaging_events = req.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            var text = event.message.text;

            sendTextMessage(sender, "Echo: " + text.substring(0, 200));
        }
    }

    res.sendStatus(200);

});

app.listen(process.env.PORT || 3000, function () {

    console.log('Facebook Messenger echoing bot started on port ' + process.env.PORT + '!');

});

function sendTextMessage(sender, text) {

    var messageData = {
        text: text
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response) {

        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

    });

}