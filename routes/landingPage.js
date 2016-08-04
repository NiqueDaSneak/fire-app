"use strict"

var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {

	res.send('Hello World! This is the bot\'s root endpoint!');

});

module.exports = router;
