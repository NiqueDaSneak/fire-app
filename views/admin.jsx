var React = require('react');
var JsonDB = require('node-json-db');
var db = require('./db.json');
var videos = db.getData("/");



var adminApp, videoList, videoBlock, addVideoForm, editVideoForm;



adminApp = React.createClass({
	render: function() {
		return {
			<addVideoForm></addVideoForm>
			<ul>
				
			</ul>
			// psuedocode
			// iterate through db
			// draw a new video component
			// each new video renders a li
			// videoList is a ul
			// videoList can sort video components
		
		}
	}
});



addVideoForm = React.createClass({
	render: function() {
		return {
			<div>
				<label>Insert Link Here:</label>
				<input type="text" name="video-url">
			</div>
		}
	}
});













// videoList = React.createClass({
// 	getInitialState() {
// 		return {
// 			this.state = {
// 				sortedTrait: viewCount,
// 				renderedList: [this.props.children]
// 			}		
// 		}
// 	}

// 	// function sort(trait) {
// 	// 	this.state.sortedTrait = trait;

// 	// 	if (this.state.sortedTrait === viewCount) {
// 	// 		var newRender;
			

// 	// 		}
// 	// 	}

// 	// 	if (this.state.sortedTrait === mostRecent) {

// 	// 	}
// 	// }

// 	render: function() {
// 		return {
// 			<div>
// 			<p>Sort By:</p>
// 			<input type="submit" onClick={this.sort(viewCount)}>View Count</input>
// 			<input type="submit" onClick={this.sort(mostRecent)}>Most Recent</input>
// 			<input type="submit" onClick={this.sort(mostRecent)}>Category</input>
// 			<ul>
// 				{this.state.renderedList}
// 			</ul>

// 			</div>	
// 		}
// 	}
// });


var array = [
{ id: "Ten", value: 10},
{ id: "Nine", value: 9},
{ id: "Eight", value: 8},
{ id: "Seven", value: 7},
{ id: "Six", value: 6},
{ id: "Five", value: 5},
]



// videoBlock = React.createClass({
// 	// should contain editVideoForm
// 	render: function() {
// 		return {
// 			<div>
// 			<p>
// 			{this.props.something}
// 			</p>
// 			</div>
// 		}
// 	}
// });


module.exports = adminApp;