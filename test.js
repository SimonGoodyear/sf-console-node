var connect = require('connect');
var sfParser = require('./lib/sfparser.js');
var sgutil = require('./lib/sgutil.js');
var pages = require('./lib/pages.js');
var auth = require('./lib/sfauth.js');
var sys = require('sys');

var cookieName = 'clientRef';

var server = connect.createServer(connect.profiler(), connect.cookieParser(), connect.favicon( __dirname + '/images/favicon.png'), connect.bodyParser(), HttpHandler);
server.use('/static', connect.static(__dirname + '/static'));

var connections = new Array();
var organizations = new Array();


var io = require('socket.io').listen(server);
io.configure('production', 
	function(){
		io.enable('browser client minification');  
		io.enable('browser client etag');          
		io.set('log level', 1); 
  		io.set('transports', ['htmlfile', 'xhr-polling', 'jsonp-polling']);
	});

server.listen(process.env.PORT);
//server.listen(8081);

io.sockets.on('connection', 
	function (socket){
		var obj = new Object();
		var orgId = getOrgId(socket.handshake.headers.cookie);
		if( orgId == null )
			return;
			
		obj['orgid'] =  orgId;
		obj['connection'] = socket;
		connections.push(obj);
	});

function sendMessage(orgId, message){console.log(connections.length);
	for( var i=0; i<connections.length; i++ ){
		if(connections[i].orgid == orgId){console.log(connections[i].orgid );
			connections[i].connection.emit('logupdate', message);
		}
	}
}

function HttpHandler(req,res,next){

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
        	req.on('data', 
        		function(chunk) {
            		chunks.push(chunk);
        		});
        	req.on('end', 
        		function() {
            		var xml = chunks.join('');
            		sfParser.parse(xml, 
            			function(result){
            				//do something magical with the output - like sending some messages		
            				
            				if(result.soapenvBody.notifications.Notification.length == null){
            					// send a message
            					sendMessage(result.soapenvBody.notifications.OrganizationId, result.soapenvBody.notifications.Notification.sObject.sfUpdated__c + ':' + result.soapenvBody.notifications.Notification.sObject.sfMessage__c);
            				} else{
            					for(var i=0; i<result.soapenvBody.notifications.Notification.length; i++){
            						sendMessage(result.soapenvBody.notifications.OrganizationId, result.soapenvBody.notifications.Notification[i].sObject.sfUpdated__c + ':' + result.soapenvBody.notifications.Notification[i].sObject.sfMessage__c);
            					}
            				}
            				
            				
            				//console.log(sys.inspect(result.soapenvBody.notifications.Notification.sObject.sfMessage__c));
            			}); 
            		// send ack
            		res.end('<?xml version = "1.0" encoding = "utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><notifications xmlns="http://soap.sforce.com/2005/09/outbound"><Ack>True</Ack></notifications></soapenv:Body></soapenv:Envelope>');
        		});
    	}
    	else {
        	res.end();
    	}  
    } else if(req.url == "/"){
	    if(req.method == 'GET'){
    		var orgId = getOrgId(req.headers.cookie);
    		if(orgId == null){
    			// some response going back to home page
    			pages.login(function(page){
					res.writeHead(200, {'Set-Cookie': cookieName + '=', 'Content-Type': 'text/html'});
    				res.end(page);
    			});
    		} else{
				// return with the main page
				pages.main(function(page){
    				res.writeHead(200, {'Set-Cookie': cookieName + '=', 'Content-Type': 'text/html'});
    				res.end(page);
    			});
    		}
    	}
    	
    	if(req.method == "POST"){
    	
    		auth.login(req.body.username, req.body.password + req.body.token, req.body.type,
    			function(loginRes){
    				//success
					var ret = sfParser.parse(loginRes, function(obj){

						// Save the orgid
						var organization = new Object();
						organization.orgId = obj.soapenvBody.loginResponse.result.userInfo.organizationId;
						organization.cookie = sgutil.guidGenerator() + '-' + new Date().getTime();
						organizations.push(organization);
					
						// Send them to the next page
						pages.main(function(page){
						console.log('hello');
							res.writeHead(200, {'Set-Cookie': cookieName + '=' + organization.cookie, 'Content-Type': 'text/html'});
    						res.end(page);
    					});
					
					});
    			},
    			function(loginRes){
    				//failure
    				pages.login(function(page){
						res.writeHead(200, {'Set-Cookie': cookieName + '=', 'Content-Type': 'text/html'});
    					res.end(page);
    				});
    			});
    			
    	
    	}
    } else{
	    next();
	}
}

function getOrgId(allCookies){

	if(allCookies == null)
		return null;
		
	var p = allCookies.split(';');
	var cookie = '';
	
	for( var i=0; i<p.length; i++ ){
		var s = p[i].split('=');
		if( s.length > 1 && s[0] == cookieName ){
			cookie = s[1];
			break;
		}
	}
	
	if( cookie == '' )
		return null;
	
	var orgId = null;
	for( var i=0; i<organizations.length; i++){
		if( organizations[i].cookie == cookie ){
			orgId = organizations[i].orgId;
			break;
		}
	}
	
	return orgId;
}
