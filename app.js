// Import modules
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var bodyParser = require('body-parser');

// Get all files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Listen on port 4200
http.listen(4200, function() {
	console.log('listening on port 4200');
});