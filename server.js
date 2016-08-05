"use strict"

var express = require('express');
var request = require('request');
var JsonDB = require('node-json-db');
var db = new JsonDB("db.js", true, false);
var logger = require('morgan');


var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());





// SET UP ROUTES
var landingPage = require('./routes/landingPage');
app.use('/', landingPage);

// var admin = require('./routes/admin');
app.get('/admin', function (req, res) {
	res.render('admin', { name: 'World' });
});


var messenger = require('./routes/messenger');
app.use('bot', messenger);




// MIDDLEWARE
app.use(logger('short'));



var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('Server running on port ' + port);

});

app.on('error', function(){
	console.log(error);
});

module.exports = app;
module.exports = db


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