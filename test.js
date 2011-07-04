var connect = require('connect');
var server = connect.createServer( connect.cookieParser(), function(req,res){
res.writeHead( 200, {
    'Set-Cookie': 'mycookie=test',
    'Content-Type': 'text/plain'
  });
res.write('hello again');
res.end(JSON.stringify(req.cookies)); });
//var io = require('socket.io').listen(server);

server.listen(80);

/*io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

