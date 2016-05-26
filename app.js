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
			if (text.toLowerCase() === "hello" || "hey") {

				sendGenericMessage(sender);
				continue
			}
		}
		if (event.postback) {
			text = JSON.stringify(event.postback);
			sendTextMessage(sender, "Postback recieved:" + text, token)
			continue
		}
	}

	res.sendStatus(200);

});

app.listen(process.env.PORT || 3000, function () {

	console.log('Facebook Messenger echoing bot started on port ' + process.env.PORT + '!');

});

// MODULES FOR SENDING MESSAGES

function sendGenericMessage(sender) {
	messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
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

///////

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