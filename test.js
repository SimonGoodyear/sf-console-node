var parser = require('xml2json');
var connect = require('connect');
var server = connect.createServer( connect.profiler(), connect.cookieParser(), connect.static( __dirname ), HttpHandler);

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

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

function HttpHandler(req,res){

	if(req.url != '/notificationservice.asmx' )
		res.end('not today');


	if (req.method === 'GET') {
        var search = url.parse(req.url).search;
        if (search && search.toLowerCase() === '?wsdl') {
            //res.setHeader("Content-Type", "application/xml");
            //res.write(self.wsdl.toXML());
            res.write('hello GET');
        }
        res.end();
    }
    else if (req.method === 'POST') {
        var chunks = [];
        var obj;
        req.on('data', function(chunk) {
            chunks.push(chunk);
        })
        req.on('end', function() {
            var xml = chunks.join(''), result;
            try {
                result = parser.toJson(xml);
                obj = parser.toJson(xml, {object: true});
            }
            catch (err) {
                result = err.stack;
            }
            console.log(obj.soap:Envelope);
            res.write(result);
            res.end();
        });
    }
    else {
        res.end();
    }    
}

