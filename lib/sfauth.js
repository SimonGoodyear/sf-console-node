var http = require('https');

var prdHost = 'login.salesforce.com';
var tstHost = 'test.salesforce.com';
var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:partner.soap.sforce.com"><soapenv:Body><urn:login><urn:username>%USER%</urn:username><urn:password>%PASSWORD%</urn:password></urn:login></soapenv:Body></soapenv:Envelope>'


function login(username, password, env, onsuccess, onerror){
	var res ='';
	console.log(env);
	var req = http.request( {host: (env=='Production' ? prdHost : tstHost), port: 443, path: '/services/Soap/u/22.0', method: 'POST', headers: {'Content-Type': 'text/xml', 'SOAPAction': '/'}}, 
		function(response){console.log(req.url);
            response.on('data', 
            	function (chunk){
                	res += chunk;
                });
            response.on('end', 
            	function(){
            	
            	console.log(res);
                    if(res.indexOf('soapenv:Fault') == -1)
                    	onsuccess(res);
                    else
                        onerror(res);
                });
        });
                        
	req.end(request.replace('%USER%', username).replace('%PASSWORD%', password));
}

exports.login = login;