"use strict";
var restify = require('restify');
const logger = require('./logger');

var server = restify.createServer({
  name: 'api',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

const SESSION_MINUTES = process.env.SESSION_MINUTES
let valid_token = process.env.TOKEN
let timer = undefined

let valid_users = {
	'virat':{
		'password': 'virat1234',
		'token': null,
		'valid_till': null,
		'email': 'virat@gmail.com'
	},
}

let valid_tokens = {}

function token_generator(){
	return 'token' + Date.now()
}

server.get('/login/:email/:password', function (req, res, next) {
  // res.send(req.params);
  let email = req.params.email
  let password = req.params.password
  if(valid_users[email]){
  	let user = valid_users[email]
  	if(password == user.password){
  		var token = token_generator()
  		user.token = token
  		valid_tokens[token] = email
  		user.valid_till = Date.now() + SESSION_MINUTES*60000;
  		res.send({'success': true, 'token': user.token});
  	}else
  		res.send({'success': false, 'msg': 'password not matching'})
  }else
  	res.send({'success': false, 'msg': 'invalid user'})
  return next();
});

server.get('/update/:token', function(req, res, next){
	let token = req.params.token
	if(valid_tokens[token]){
		let user = valid_users[valid_tokens[token]]
		if(Date.now() <= user.valid_till){
			user.valid_till = Date.now() + SESSION_MINUTES*60000;
			res.send({'success': true, 'msg': 'Data updated.'});
		}else{
			res.send({'success': false, 'msg': 'Outdated token'})
		}
	}else
		res.send({'success': false, 'msg': 'Outdated token'})
	return next();
});

server.listen(process.env.APP_PORT, function () {
  console.log('%s listening at %s', server.name, server.url)
  logger.info('%s listening at %s', server.name, server.url);
});
