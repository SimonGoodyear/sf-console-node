var xml2js = require('xml2js');
var connect = require('connect');
var server = connect.createServer( connect.profiler(), connect.cookieParser(), HttpHandler);

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
parser.addListener('end', function(result){
                		console.log(result.soapenvBody.notifications.OrganizationId);
                		if(result.soapenvBody.notifications.Notification instanceof Array){
                			for( i = 0; i < result.soapenvBody.notifications.Notification.length; i++){
                				console.log(result.soapenvBody.notifications.Notification[i].sObject.sfMessage__c);
                				}
                		} else{
                			console.log(result.soapenvBody.notifications.Notification.sObject.sfMessage__c);
                		}
                		
                		
                	});
                	
function HttpHandler(req,res){

var count = 0;
	if(req.url != '/notificationservice.asmx' ){
		res.end(++count + '');
        return;
    }

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
							.replace(/ xmlns:soapenv="/g, ' xmlnssoapenv="')
	            			.replace(/ xmlns:xsd="/g, ' xmlnsxsd="')
	            			.replace(/ xmlns:xsi="/g, ' xmlnsxsi="')
	            			.replace(/ xsi:type="/g, ' xsitype="') 
	            			.replace(/ xmlns:sf="/g, ' xmlnssf="')
	            			.replace(/ xsi:nil="/g, ' xsinil="')	            			
	            			.replace('<soapenv:Body>', '<soapenvBody>')
	            			.replace(/<sf:Id>/g, '<sfId>')
	            			.replace(/<sf:Message__c>/g, '<sfMessage__c>')
	            			.replace(/<sf:Updated__c>/g, '<sfUpdated__c>')	            			.replace('</soapenv:Body>', '</soapenvBody>')
	            			.replace(/<\/sf:Id>/g, '</sfId>')
	            			.replace(/<\/sf:Message__c>/g, '</sfMessage__c>')
	            			.replace(/<\/sf:Updated__c>/g, '</sfUpdated__c>')
	            			.replace('<?xml version="1.0" encoding="UTF-8"?>','').trim();

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

