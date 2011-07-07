var connect = require('connect');
var sfParser = require('./lib/sfparser');
var server = connect.createServer( connect.profiler(), HttpHandler);

var io = require('socket.io').listen(server);
io.configure('production', function(){

	io.enable('browser client minification');  
	io.enable('browser client etag');          
	io.set('log level', 1); 
  	io.set('transports', [
   		 'htmlfile'
  		, 'xhr-polling'
  		, 'jsonp-polling'
  	]);
});

//server.listen(process.env.PORT);
server.listen(8080);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

function HttpHandler(req,res){
	if(req.url == '/notificationservice.asmx' ){

		if (req.method === 'GET') {
  	  		var search = url.parse(req.url).search;
   	    	if (search && search.toLowerCase() === '?wsdl') {
    	        //res.setHeader("Content-Type", "application/xml");
       	     	//res.write(self.wsdl.toXML());
        	    res.write('hello GET');
        	}
			res.end();
    	} else if (req.method === 'POST') {
        	var chunks = [];
        	req.on('data', function(chunk) {
            	chunks.push(chunk);
        	})
        	req.on('end', function() {
            	var xml = chunks.join('');
            	sfParser.parseAuth(xml, function(result){
            		//do something magical with the output							
            	});
            	// send ack
            	res.end();
        	});
    	}
    	else {
        	res.end();
    	}  
    }
}

