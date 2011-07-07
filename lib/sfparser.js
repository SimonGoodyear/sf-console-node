var xml2js = require('xml2js');

function parseAuth(input, onend){

	var clean = input.replace('<soapenv:Envelope ', '<soapenvEnvelope ')
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
	       			.replace('<?xml version="1.0" encoding="UTF-8"?>','')
	       			.trim();

	var parser = new xml2js.Parser();
	parser.addListener('end', onend);
	parser.parserString(clean);
}

exports.parseAuth = parserAuth;