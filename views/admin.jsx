var React = require('react');
var db = require('diskdb');
db.connect('db', ['videos']);

var adminApp = React.createClass({
	render: function() {
		return (
			<div>
				<inputForm/>
			</div>
			)
	}
});

var inputForm = React.createClass({
	getInitialState: function() {
		return {
		};
	},
	
	submitVideo(event) {
		event.preventDefault();
		var newVideo = {
			url: this.refs.videoURL.value,
			youtubeID: extractYoutubeID(this.refs.videoURL.value),
			videoTitle: this.refs.videoTitle,
			videoDescription: this.refs.videoDescription,
		}
		db.videos.save(newVideo)
	},

	extractYoutubeID(link) { 
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
				<form id="videoSubmitForm" onSubmit={this.submitVideo}>
					<label>Past Link Here: </label>
					<input type="text" refs="videoURL"/>
					<label>Video Title: </label>
					<input type="text" refs="videoTitle"/>
					<label>Video Description: </label>
					<input type="text" refs="videoDescription"/>
					<label>Choose a Category:</label>
					<select refs="category" form="videoSubmitForm">
					</select>
					<label>or add a new one: </label>
					<input type="text" refs="category"/>
					<input type="submit" value="Create New Video" onClick={this.submitVideo} />
				</form>
			</div>
			)
	}
});


module.exports = inputForm;