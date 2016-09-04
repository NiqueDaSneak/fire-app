x"use strict"

var express = require('express');
var request = require('request');
var db = require('diskdb');
db.connect('db', ['videos', 'users'])

var logger = require('morgan');
var bodyParser = require('body-parser');

// variable to have a persistent user object throughout
// set in userAuth function
var user;

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.engine('jsx', require('express-react-views').createEngine());



// MIDDLEWARE
app.use(logger('short'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));







// LANDING PAGE
app.get('/', function (req, res) {
    res.render('index-jade');
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


// DELETE VIDEO
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
            sendWelcomeMessage(sender);
        } else if (event.postback) {
            var postback = JSON.stringify(event.postback.payload);
            postbackHandler(sender, event);

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

function postbackHandler(sender, event){
    var allVideoCats = [];
    db.videos.find().forEach(function(video){
        allVideoCats.push(video.category);
    });

    allVideoCats = allVideoCats.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });

    for (var i = 0; i < allVideoCats.length; i++) {
        switch (event.postback.payload){
            case 'START':
            // userAuth(sender);
            // console.log(db.users.find({id: sender}));
            // console.log(user);
            sendWelcomeMessage(sender);
            break;

            case 'LEARN_MORE':
            sendTextMessage(sender, "This is the learn more text!")
            break;

            case 'SHOW_CAT':
            sendCategories(sender);
            break;

            case 'PREFS':
            sendPrefsMessage(sender);
            break;

            case 'SCHEDULE':

            break;

            // to make videos favorite
            // default:
            // saveFav(sender, event);
            // break;

            case allVideoCats[i]:
            sendVideoList(sender, allVideoCats[i]);
            break;
        }
    }
}




// function saveFav(sender, event){
//     switch (db.users.find({id: sender}).favorites){
//         case undefined:
//         {
//             var query = {
//                 id: db.users.find({id: sender})
//             }

//             var dataToBeUpdated = {
//                 favorites: []
//             }

//             var options = {
//              multi: false,
//              upsert: true
//          };

//          db.users.update(query, dataToBeUpdated, options);
//      }

//      {
//          var savedFavs = db.users.find({id: sender}).favorites;
//          var newFav = event.postback.payload;

//          var dataToBeUpdated = savedFavs.push(newFav);

//          var options = {
//              multi: false,
//              upsert: false
//          };
//          user = db.users.update(query, dataToBeUpdated, options);
//      }
//      break;

//      default:
//      var savedFavs = db.users.find({id: sender}).favorites;
//      var newFav = event.postback.payload;

//      var dataToBeUpdated = savedFavs.push(newFav);

//      var options = {
//          multi: false,
//          upsert: false
//      };
//      user = db.users.update(query, dataToBeUpdated, options);
//      sendTextMessage(sender, 'Favorite saved (not new)');
//      console.log(db.users.find({id: sender}).favorites);
//      break;

//     }
// }




// function userAuth(sender){

//     if (db.users.find({id: sender}) === []) {
//         var query = {
//             id: sender
//         };

//         var dataToBeUpdated = {
//             id: sender,
//             favorites: []
//         }

//         var options = {
//             multi: false,
//             upsert: true
//         }

//         db.users.update(query, dataToBeUpdated, options);
//         user = db.users.find({id: sender});
//         console.log('sender:');
//         console.log(sender);
//         console.log('created user:');
//         console.log(user);
//     } else {
//         user = db.users.find({id: sender});
//         console.log('found user:');
//         console.log(user);
//     }
// }



function sendVideoList(sender, category){
   var allVideosInCat = db.videos.find({ category: category });
   var elements = [];

   allVideosInCat.forEach(function(video){
    elements.push(
    {
        "title":video.videoTitle,
        "image_url":"http://img.youtube.com/vi/" + video.id + "/0.jpg",
        "subtitle":video.videoDescription,
        "buttons":[
        {
            "type":"web_url",
            "title":"Watch Video",
            "url": video.url
        },
        // {
        //     "type":"postback",
        //     "title":"Add to Favorites",
        //     "payload": video.id 
        // },
        {
            "type":"web_url",
            "title":"Share on Facebook",
            "url":"https://www.facebook.com/sharer/sharer.php?u=https%3A//www.youtube.com/watch?v=" + video.id
        }                
        ]
    }
    )
});


   var messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": elements
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




function sendCategories(sender){
    var allVideoCats = [];
    var buttons = [];


    db.videos.find().forEach(function(video){
        allVideoCats.push(video.category);
    });

    allVideoCats = allVideoCats.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });

    allVideoCats.forEach(function(category){
        buttons.push(
        {
            "type":"postback",
            "title": category.toUpperCase(),
            "payload": category 
        }
        )
    });

    var messageData = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":"Welcome to Fire! What would you like to watch?",
                "buttons": buttons
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
                "text":"Welcome to Fire! How can we be of service?",
                "buttons":[
                {
                    "type":"postback",
                    "title":"Learn More About Us",
                    "payload":"LEARN_MORE"
                },
                {
                    "type":"postback",
                    "title":"Show video categories",
                    "payload":"SHOW_CAT"
                },
                // {
                //     "type":"postback",
                //     "title":"Manage my settings",
                //     "payload":"PREFS"
                // }
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






function sendPrefsMessage(sender){
    var user = null;
    if (db.users.find({id: sender})) {
        user = db.users.find({id: sender})
    } else {
        var newUser = {
            id: sender,
            favorites: []
        }
        db.users.save(newUser);
        user = newUser;
    }



    var messageData = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":"Would you like me to start sending you videos regularly, or would you rather just see all of your favorite videos?",
                "buttons":[
                // {
                //     "type":"postback",
                //     "title":"Schedule videos",
                //     "payload":"SCHEDULE"
                // },
                // {
                //     "type":"postback",
                //     "title":"Show favorites",
                //     "payload":"FAV"
                // },
                {
                    "type":"postback",
                    "title":"Show video categories",
                    "payload":"SHOW_CAT"
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