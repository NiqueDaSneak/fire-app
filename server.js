"use strict"

var express = require('express');
var request = require('request');
var db = require('diskdb');
// db.connect('db', ['videos'])
// var JsonDB = require('node-json-db');
// var db = new JsonDB("db.json", true, false);
var logger = require('morgan');
var bodyParser = require('body-parser');



var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());



// MIDDLEWARE
app.use(logger('short'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());






// SET UP ROUTES
app.get('/', function (req, res) {
	// res.render('index');
	res.send('Hello World! This is the bot\'s root endpoint!');
});



app.get('/admin', function (req, res) {
	res.render('admin');
});


var verify_token = 'my_voice_is_my_password_verify_me';
var token = "EAAPDMUuxFGcBAFkMpPAnuHYAdJHSiptRCnFCYMlJQQFNZCLGhwupktFPHtkSjCPr3NexjFYZALNgPFzsUnEF35L06xHbYHPzgtZBirJm8ZAu0GKgh2OpvZBRlDeORfET6RussZApD5E96VEm7sN09Hsg4PFTCy5S6OZBFVGL8DKnAZDZD";

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







var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('Server running on port ' + port);

});

app.on('error', function(){
	console.log(error);
});

module.exports = app;
// module.exports = db


// MODULES FOR SENDING MESSAGES

function sendGenericMessage(sender) {
	var messageData = {
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