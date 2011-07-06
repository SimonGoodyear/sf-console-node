/*var http = require('https');
var res ='';
var req = http.request( {host: 'login.salesforce.com', port: 443, path: '/services/Soap/u/22.0', method: 'POST', headers: {'Content-Type': 'text/xml', 'SOAPAction': '/services/Soap/u/22.0'}}, function(response){
                        response.on('data', function (chunk){
                                                res += chunk;
                                            });
                        response.on('end', function(){
                                                console.log(res);
                                            });
                        });
                        
req.end('<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:partner.soap.sforce.com"><soapenv:Body><urn:login><urn:username>simon.goodyear@sgopus.com</urn:username><urn:password>futa8a129bTRohAw5kxhGu3KdMjsC1t66</urn:password></urn:login></soapenv:Body></soapenv:Envelope>');

*/