"use strict"
var React = require('react');
var db = require('diskdb');
db.connect('db', ['videos']);

var adminApp = React.createClass({
	render: function() {
		return (
			<div>
				<inputForm/>
			</div>
			);
	}
});

var inputForm = React.createClass({
	getInitialState: function() {
		return {
			videoURL: "",
			videoTitle: "",
			videoDescription: "",
			category: "",
		};
	},
	
	submitVideo: function(event) {
		var newVideo = {
			id: makeID(),
			url: this.state.videoURL,
			youtubeID: extractYoutubeID(this.state.videoURL),
			videoTitle: this.state.videoTitle,
			videoDescription: this.state.videoDescription,
			category: this.state.category
		}
		db.videos.save(newVideo);
	},

	makeID: function() {
		function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		  .toString(16)
		  .substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
},


	handleInputChange: function(event) {
		if (event.target.name === videoURL) {
			this.setState({videoURL: event.target.value});
		}
		if (event.target.name === videoTitle) {
			this.setState({videoURL: event.target.value});
		}
		if (event.target.name === videoDescription) {
			this.setState({videoTitle: event.target.value});
		}
		if (event.target.name === category) {
			this.setState({videoDescription: event.target.value});
		}
	},

	extractYoutubeID: function(link) { 
		if( link.match(/(youtube.com)/) ){
		    var split_c = "v=";
		    var split_n = 1;
		}
		 
		if( link.match(/(youtu.be)/) ){
		    var split_c = "/";
		    var split_n = 3;
		}
		 
		var getYouTubeVideoID = youtubeLink.split(split_c)[split_n];
		 
		return getYouTubeVideoID.replace(/(&)+(.*)/, "");
	},

	// handleChange: function(event) {
 //    	this.setState({
 //    		value: event.target.inputValue,
 //    	});

 //  	},


	render: function() {
		return (
			<div>
				<form id="videoSubmitForm" onSubmit={this.submitVideo} method="post" action="/admin">
					<label>Past Link Here: </label>
					<input type="text" name="videoURL" onChange={this.handleInputChange}/>
					<label>Video Title: </label>
					<input type="text" name="videoTitle" onChange={this.handleInputChange}/>
					<label>Video Description: </label>
					<input type="text" name="videoDescription" onChange={this.handleInputChange}/>
					<label>Choose a Category:</label>
					<select name="category" form="videoSubmitForm" onChange={this.handleInputChange}>
					</select>
					<label>or add a new one: </label>
					<input type="text" name="category" onChange={this.handleInputChange}/>
					<input type="submit" value="Create New Video" onClick={this.submitVideo}/>
				</form>
			</div>
			);
	}
});


module.exports = inputForm;