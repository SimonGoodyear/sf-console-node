var connect = require('connect');
var server = connect.createServer( connect.profiler(), connect.cookieParser(), connect.static( __dirname ), function(req,res){
res.writeHead( 200, {
    'Set-Cookie': 'mycookie=test',
    'Content-Type': 'text/plain'
  });
res.write('hello again ' + process.env.PORT);
res.end(JSON.stringify(req.cookies)); });
var io = require('socket.io').listen(server);
io.configure('production', function(){

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

