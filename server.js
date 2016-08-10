"use strict"

var express = require('express');
var request = require('request');
var db = require('diskdb');
db.connect('db', ['videos'])
// var JsonDB = require('node-json-db');
// var db = new JsonDB("db.json", true, false);
var logger = require('morgan');
var bodyParser = require('body-parser');



var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.engine('jsx', require('express-react-views').createEngine());



// MIDDLEWARE
app.use(logger('short'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());






// LANDING PAGE
app.get('/', function (req, res) {
	// res.render('index');
	res.send('Hello World! This is the bot\'s root endpoint!');
});





















// ADMIN APP



// LOAD ADMIN PAGE
app.get('/admin', function (req, res) {
	res.render('admin-jade', ({options: db.videos.find()}));
});


// SAVE VIDEO TO DB
app.post('/admin/', function (req, res) {
	submitVideo(req.body);
	res.redirect('/admin');

});

app.get('/admin/:videoID', function (req, res) {
	var videoID = req.params.videoID;
	if (db.videos.find({id: videoID})) {
		db.videos.remove({id: videoID});
		console.log('successfully deleted');
		res.redirect('/admin');
	} else {
		console.log('video not found');
		res.redirect('/admin');

	}
});


// Helper Methods for admin route

function makeID() {

	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}

function extractYoutubeID(link) { 

	if( link.match(/(youtube.com)/) ){
		var split_c = "v=";
		var split_n = 1;
	}

	if( link.match(/(youtu.be)/) ){
		var split_c = "/";
		var split_n = 3;
	}

	var getYouTubeVideoID = link.split(split_c)[split_n];

	return getYouTubeVideoID.replace(/(&)+(.*)/, "");
}

function submitVideo(event) {
	var eventCat;

	if (Array.isArray(event.category) === true) {
		eventCat = event.category[0].toLowerCase()
	} else {
		eventCat = event.category.toLowerCase()
	}

	var newVideo = {
		id: extractYoutubeID(event.videoURL),
		url: event.videoURL,
		videoTitle: event.videoTitle,
		videoDescription: event.videoDescription,
		category: eventCat
	}
	db.videos.save(newVideo);
}






















// MESSENGER BOT


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
			// var text = event.message.text;
			sendWelcomeMessage(sender);
		} else if (event.postback) {
			var postback = JSON.stringify(event.postback);
			if (postback === {"payload":"learn more"}) {
				console.log('they clicked learn more!!!');
				// sendTextMessage(sender, "This is the learn more text!")
			} else if (postback === {"payload":"show categories"}) {
				sendCategories(sender);
			}
		}
	}

	res.sendStatus(200);

});


















// SET UP SERVER ENVIRONMENT


var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('Server running on port ' + port);

});

app.on('error', function(){
	console.log(error);
});

module.exports = app;
















// MODULES FOR SENDING MESSAGES




function sendCategories(sender){
	var allVideoCats = [];

	db.videos.find().forEach(function(video){
		allVideoCats.push(video.category);
	});

	allVideoCats = allVideoCats.filter(function(elem, index, self) {
		return index == self.indexOf(elem);
	});

	function buttonGenerator(){
		allVideoCats.forEach(function(category){
			return {
				"type":"postback",
				"title": category,
				"payload": category 
			}
		});
	}

	var messageData = {
		"attachment":{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":"Welcome to Fire! What would you like to do?",
				"buttons":[buttonGenerator()]
			}
		}
	};

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



function sendWelcomeMessage(sender) {
	var messageData = {
		"attachment":{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":"Welcome to Fire! What would you like to do?",
				"buttons":[
				{
					"type":"postback",
					"title":"Learn More About Us",
					"payload": "learn more"
				},
				{
					"type":"postback",
					"title":"I Need A Video",
					"payload":"show categories"
				}
				]
			}
		}
	};

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