/*
	Author: shuchengc
	Date: 27-March-2016
	Description: topic APIs functions
 */
var http = require('http');
var Map = require('../../../public/js/map');
var Twitter = require('twitter');
var fs = require('fs');
var Log = require('log');
var log = new Log('error',fs.createWriteStream('./log/error.log'));

// Gets the list of topic categories
exports.getAllTopics = function(req,res){
	var protocol ="http:";
	var host = req.app.locals.couchdb.couchdb_url;
	var port = req.app.locals.couchdb.couchdb_port;
	var viewUrl = protocol + "//" + host + ":" + port + "/tweets/_design/tweets/_view/topicCategory?group_level=1&d";
	http.get(viewUrl,function(response){
		var body ='';
		response.on('data',function(chunk){
			body += chunk;
		});
		response.on('error',function(error){
			log.error('getAllTopics:'+error);
			res.json({error:error});
		})
		response.on('end',function(){
			var topics = JSON.parse(body);
			res.json(topics);
		});
	});
};

