'use strict';

var Cluster = require('../../lib/index.js'),
	util = require('util'),
	express = require('express'),
	app = express();

app.get('/', function(req, res){

	require('../../lib/cache-usr.js').user()
		.then(function(usr){

			var key = req.query.key,
				val = req.query.value;

			if(!key){
				usr.get('key', function(){
						return 'value';
					}, 
					{
						'persist': true,
						'expire': null
					})
					.then(function(value){
						res.send(util.format('hello from:%d whose cached value is:%j', process.pid, value), 200);
					});
			}
			else{
				console.log('user set:' + key + '=' + val);
				usr.set(key, val)
					.then(function(){
						res.send(util.format('user set:%s to value:%j', key, val), 200);
					});
			}
		});
});

new Cluster({
	'noWorkers': 1,
	'createServer': require('http').createServer,
	'app': app,
	'port': 8080,
	'monPort': 8082,
	'debugPort': 8083
})
.listen();