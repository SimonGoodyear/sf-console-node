var connect = require('connect');
var xml = require('fs').readFileSync('server.wsdl', 'utf8');
var server = connect.createServer( connect.profiler(), connect.cookieParser(), connect.static( __dirname ), HttpHandler);

var soap = require('soap');

var io = require('socket.io').listen(server);
io.configure('production', function(){

	io.enable('browser client minification');  
	io.enable('browser client etag');          
	io.set('log level', 1); 
  	io.set('transports', [
   		'flashsocket'
  		, 'htmlfile'
  		, 'xhr-polling'
  		, 'jsonp-polling'
  	]);
});

server.listen(process.env.PORT);

soap.listen(server, '/notificationservice.asmx2', notificationService, xml);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

function HttpHandler(req,res){


	res.writeHead( 200, {
    	'Content-Type': 'text/plain'
  	});

	console.log(req.body);	
	res.end();
}

var notificationService = {
	NotificationService: {
		Notification: {
			notifications: function(args){
				console.log('in function');
				return 'ack: true';
			}
		}
	}
}