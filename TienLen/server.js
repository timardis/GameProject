var express = require('express');
var socket = require('socket.io');

var io = socket.listen(8080);



// Socket.IO stuff
io.sockets.on('connection', function(socket) {

});



// Express stuff
var app = express();

app.configure(function() {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
	res.render('index', {
		message: 'Hello World'
	});
});

app.listen(3000);