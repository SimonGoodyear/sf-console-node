var fs = require('fs');
var login = '';
var main = '';

function getLogin(returnPage){
	if(login == ''){
		fs.readFile( __dirname + '/pages/login.html', 'UTF-8', function(err, data){
			login = data;
			returnPage(login);
		});
	} else{
		returnPage(login);
	}
}

function getMain(returnPage){
	if(main == ''){
		fs.readFile( __dirname + '/pages/console.html', 'UTF-8', function(err, data){
			main = data;
			returnPage(main);
		});
	} else{
		returnPage(main);
	}
}

exports.login = getLogin;
exports.main = getMain;