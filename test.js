var sys = require('sys');
var xml2js = require('./lib/xml2js');
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

var parser = new xml2js.Parser();

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
        var chunks = [], result, clean, obj;
        var obj;
        req.on('data', function(chunk) {
            chunks.push(chunk);
        })
        req.on('end', function() {
            var xml = chunks.join(''), result;
            try {
	            clean = xml.replace('<soapenv:Envelope ', '<soapenvEnvelope ')
							.replace('</soapenv:Envelope>', '</soapenvEnvelope>')
							.replace(' xmlns:soapenv="', ' xmlnssoapenv="')
	            			.replace(' xmlns:xsd="', ' xmlnsxsd="')
	            			.replace(' xmlns:xsi="', ' xmlnsxsi="')
	            			.replace(' xsi:type="', ' xsitype="') 
	            			.replace(' xmlns:sf="', ' xmlnssf="')
	            			.replace(' xsi:nil="', ' xsinil="')	            			
	            			.replace('<soapenv:Body>', '<soapenvBody>')
	            			.replace('<sf:Id>', '<sfId>')
	            			.replace('<sf:Message__c>', '<sfMessage__c>')
	            			.replace('<sf:Updated__c>', '<sfUpdated__c>')	            			.replace('</soapenv:Body>', '</soapenvBody>')
	            			.replace('</sf:Id>', '</sfId>')
	            			.replace('</sf:Message__c>', '</sfMessage__c>')
	            			.replace('</sf:Updated__c>', '</sfUpdated__c>')
	            			.replace('<?xml version="1.0" encoding="UTF-8"?>','');
	            			
                ///result = parser.toJson2(clean);
                parser.addListener('end', function(result){
                		//console.log(sys.inspect(result));
                		//console.log(result.soapenvBody);
                		//console.log(result.soapenvBody.notifications);
                		console.log(result.soapenvBody.notifications.OrganizationId);
                		console.log(result.soapenvBody.notifications);
                		
                		if(result.soapenvBody.notifications.Notification instanceof Array){
                			console.log(result.soapenvBody.notifications.Notification.length);
                			for( i = 0; i < result.soapenvBody.notifications.Notification.length; i++)
                				console.log(result.soapenvBody.notifications.Notification[i]);
                		} else{
                			console.log(result.soapenvBody.notifications.Notification.sObject.sfMessage__c);
                		}
                		
                		
                	});
                parser.parseString(clean);
                }
            catch (err) {
                result = err.stack;
                console.log('err:   ' + result);
            }
            //console.log('obj: ' + obj);
            //console.log('val1: ' + obj);
			//console.log(result);
            //res.write(result);
            res.end();
        });
    }
    else {
        res.end();
    }    
}

