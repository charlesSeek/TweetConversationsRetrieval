/*
	Author: shuchengc
	Date: 27-March-2016
	Description: twitter APIs functions
 */
var Map = require('../../../public/js/map');
var http = require('http');
var Twitter = require('twitter');
var async = require('async');
var moment = require('moment');
var fs = require('fs');
var Log = require('log');
var log = new Log('error',fs.createWriteStream('./log/error.log'));
//Gets a tweet by twitter rest api
exports.getTweetById = function(req,res){
	var id = req.params.id;
	var twitter_key = req.app.locals.twitter_key;
	var oAuthStreamsConnection = new Twitter(twitter_key);
	oAuthStreamsConnection.get('statuses/show/'+id,function(error,tweets,response){
		if (error){
			var message = error[0];
			log.error("getTweetById "+id+":"+message);
			res.json({error:error});
		} else {
			res.json(tweets);
		}
	});
};

//gets all replies tweets by conversationd id,stores all the replies
//into couchdb and updates the status of the original tweet
exports.getRepliesByConversationId = function(req,res){
	var conversationId = req.params.conversationId;
	var topic = req.query.topic;
	var fixedLoops = parseInt(req.app.locals.replies_loops);
	var searchFuncs = [];
	var allReplies = [];
	var since_id = conversationId;
	var max_id = conversationId;
	var screen_name = req.query.screen_name;
	console.log("screen_name:",screen_name);
	var paramsSinceId = {q:screen_name,count:100,since_id:since_id};
	var paramsMaxId = {q:screen_name,count:100,max_id:max_id};
	var twitter_key = req.app.locals.twitter_key;
	var oAuthRepliesConnection = new Twitter(twitter_key);
	var protocol = "http:";
	var host = req.app.locals.rest_api.rest_api_url;
	var port = req.app.locals.rest_api.rest_api_port;
	

	// function of twitter search api by since_id
	searchFuncs.push(function(callback){
		oAuthRepliesConnection.get('search/tweets',paramsSinceId,function(err,tweets,response){
			if (!err){
				var statuses = tweets.statuses;
				for (var j=0;j<statuses.length;j++){
						var tweet = statuses[j];
						paramsMaxId.max_id = tweet.id_str;
						if (tweet.in_reply_to_status_id_str==conversationId){
							tweet._id = tweet.id_str;
							tweet.topic = topic;
							tweet.doctype = 'replies';
							tweet.conversationId = conversationId;
							tweet.retrieved_at = moment().format('LLLL') ;
							allReplies.push(tweet);
						}
				}
			}else{
				log.error("search tweets by since_id "+paramsSinceId+":"+err);
			}
			callback(null,err);
		});
	});

	//functions of twitter search api by max_id according to parameter fixedLoops
	for (var i=0;i<fixedLoops-1;i++){
		searchFuncs.push(function(callback){
			oAuthRepliesConnection.get('search/tweets',paramsMaxId,function(err,tweets,response){
				console.log(paramsMaxId);
				if (!err){
					var statuses = tweets.statuses;
					for (var j=0;j<statuses.length;j++){
						var tweet = statuses[j];
						paramsMaxId.max_id = tweet.id_str;
						if (tweet.in_reply_to_status_id_str==conversationId){
							tweet._id = tweet.id_str;
							tweet.topic = topic;
							tweet.doctype = 'replies';
							tweet.conversationId = conversationId;
							tweet.retrieved_at = moment().format('LLLL') ;
							allReplies.push(tweet);
						}
					}
				}else {
					log.error("search tweets by max_id "+paramsMaxId+":"+err);
				}
				callback(null,err);
			});
		});
	}
	
	//function of insert all the replies tweets into couchdb
	searchFuncs.push(function(callback){
		console.log("large replies:",allReplies.length);
		if (allReplies.length!=0){
			
				var postData = JSON.stringify({"docs":allReplies});
				var options = {
					protocol: protocol,
					host: host,
					port: port,
					path: '/api/couchdb/doc/_bulk_docs',
					method: 'POST',
					headers:{
						'Content-Type': 'application/json'
					}
				};
				var request = http.request(options,function(response){
					var body = '';
					response.setEncoding('utf8');
					response.on('data',function(chunk){
						body += chunk;
					});
					response.on('error',function(error){
						log.err('bulk_doc response error '+conversationId+":"+error);
						callback(null,error);
					});
					response.on('end',function(){
						callback(null,'');
					});
				});
				request.on('error',function(error){
					log.error('bulk_doc request error'+conversationId+":"+error);
					callback(null,err);
				});
				request.write(postData);
				request.end();
			
		}else {
			log.error('there are no replies for '+conversationId);
			callback(null,'');
		}
	});

	//when gets all the replies to update the status of conversation tweet to completed
	searchFuncs.push(function(callback){
		var postData = JSON.stringify({"status":"completed"});
		var options = {
			protocol: protocol,
			host: host,
			port: port,
			path: '/api/couchdb/doc/update/'+conversationId,
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			}
		};
		var request = http.request(options,function(response){
			var body ='';
			response.on('error',function(error){
				log.error('update conversation tweet '+conversationId+":"+error);
			});
			response.on('data',function(chunk){
				body += chunk;
			});
			response.on('end',function(){
				res.json({"docs":allReplies});
			});
		});
		request.on('error',function(error){
			log.error('update conversation tweet '+conversationId+":"+error);
		})
		request.write(postData);
		request.end();
	});
	async.series(searchFuncs);
};

//get the limited number of conversation tweets by twitter stream api
exports.getTweetsStreamByKeyword = function(req,res){
	var timeout = parseInt(req.app.locals.stream_timeout);
	var topic = req.params.keyword;
	var limits = parseInt(req.query.limits)||2;
	var count = 0;
	var streamTweets = [];
	var twitter_key = req.app.locals.twitter_key;
	var oAuthStreamsConnection = new Twitter(twitter_key);
	var protocol = "http:";
	var host = req.app.locals.rest_api.rest_api_url;
	var port = req.app.locals.rest_api.rest_api_port;
	res.setTimeout(timeout,function(){
		if (streamTweets.length !=0){
			var postData = JSON.stringify({"docs":streamTweets});
				var options = {
					protocol: protocol,
					host: host,
					port: port,
					path: '/api/couchdb/doc/_bulk_docs',
					method: 'POST',
					headers:{
						'Content-Type': 'application/json'
					}
				};
				var request = http.request(options,function(response){
					var body = '';
					response.setEncoding('utf8');
					response.on('data',function(chunk){
						body += chunk;
					});
					response.on('error',function(error){
						log.error('conversation bulkdocs response: '+error);
						res.json({message:"bulk docs insert error"});
					});
					response.on('end',function(){
						res.json({"docs":streamTweets});
					});
				});
				request.write(postData);
				request.end();
				request.on('error',function(error){
					log.error('conversation bulkdocs request: '+error);
					res.json({message:"bulk docs insert error"});
				});
		}else {
			res.json({message:"no conversations are founded,please change a new topic"});
		}
		
	});
	oAuthStreamsConnection.stream('statuses/filter',{track:topic},function(stream){
		oAuthStreamsConnection.currentTwitterStream = stream;
		var conversationMap = new Map();
		stream.on('data',function(tweet){
			if (tweet.in_reply_to_status_id_str!=null){
				var conversationId = tweet.in_reply_to_status_id_str;
				var screen_name = tweet.in_reply_to_screen_name;
			}
			if (!conversationMap.get(conversationId)){
				conversationMap.put(conversationId,tweet.id_str);
				var client = new Twitter(twitter_key);
				client.get('statuses/show/'+conversationId,function(error,tweet,response){
					if (error){
						log.error('get tweet '+conversationId+":"+error);
					} else {
						tweet._id = tweet.id_str;
						tweet.conversationId = conversationId;
						tweet.topic = topic;
						tweet.doctype = 'conversation'
						tweet.retrieved_at = moment().format('LLLL');
						tweet.status = 'schedule';
						streamTweets.push(tweet);
						count++;
					}
					if (count>=limits){
						oAuthStreamsConnection.currentTwitterStream.destroy();
					}
				});

			}
			
		});
		stream.on('error',function(error){
			log.error('stream api by '+ topic+":"+JSON.stringify(error));
		});
		stream.on('end',function(){
			if (streamTweets.length > 0){
				console.log('get tweets....');
				var postData = JSON.stringify({"docs":streamTweets});
				var options = {
					protocol: protocol,
					host: host,
					port: port,
					path: '/api/couchdb/doc/_bulk_docs',
					method: 'POST',
					headers:{
						'Content-Type': 'application/json'
					}
				};
				var request = http.request(options,function(response){
					var body = '';
					response.setEncoding('utf8');
					response.on('data',function(chunk){
						body += chunk;
					});
					response.on('error',function(error){
						log.error('conversation bulkdocs response: '+error);
						res.json({message:"bulk docs insert error"});
					});
					response.on('end',function(){
						res.json({"docs":streamTweets});
					});
				});
				request.write(postData);
				request.end();
				request.on('error',function(error){
					log.error('conversation bulkdocs request: '+error);
					res.json({message:"bulk docs insert error"});
				});
			}else {
				res.json({message:'no conversations are founded,please change new topic'})
			}
		})

	});
};

