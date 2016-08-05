"use strict"
var express = require('express');
// var router = express.Router();


// router.get('/', function (req, res) {

// 	res.render('admin', { name: 'World' });

// });


// module.exports = router;

exports.admin = function(req, res) {
	res.render('admin', { name: 'World' });
};
