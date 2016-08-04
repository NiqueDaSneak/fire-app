"use strict"

var express = require('express');
var router = express.Router();


var verify_token = 'my_voice_is_my_password_verify_me';
var token = "EAAPDMUuxFGcBACRaCUr9iZAVNL0FJtpnZBtJqrHU8jnGgoSdl2JbkDlQVpeBTZBsniEJZAw7Clxod0C17lb6bGNl6ssjQNp3sj4iuZBLFMeH5JhJbPe5Q8flLpLNx9FLZAzBCjS1xTiSd6WEkVgrN54eUpmfnTR0JpnE55wgppJgZDZD";

router.get('/webhook/', function (req, res) {

	if (req.query['hub.verify_token'] === verify_token) {
		res.send(req.query['hub.challenge']);
	}

	res.send('Error, wrong validation token');

});

router.post('/webhook/', function (req, res) {

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



module.exports = router;
