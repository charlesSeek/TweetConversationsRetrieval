/*
	Author: shuchengc
	Date: 27-March-2016
	Description: topic APIs functions
 */
var http = require('http');
var async = require('async');
var fs = require('fs');
var Log = require('log');
var log = new Log('error',fs.createWriteStream('./log/error.log'));

//render topic search page
exports.topicSearch = function(req,res){
	res.render('topicsSearch',{
		topic:'',
		limits: ''
	});
};

//create coversation by topic
exports.createConversationsByTopic = function(req,res){
	var query = req.body.query;
	console.log(query);
	var topic = query.topic.trim();
	var limits = parseInt(query.limits.trim());
	var conversations;
	var createConversationFuncs = [];
	var protocol = "http:";
  	var host = req.app.locals.rest_api.rest_api_url;
  	var port = req.app.locals.rest_api.rest_api_port;
  	var url = protocol+"//"+host+":"+port;
	http.get(url+'/api/twitter/stream/'+topic+'?limits='+limits,function(response){
		var body ='';
		response.on('data',function(chunk){
			body += chunk;
		});
		response.on('error',function(error){
			log.error('create conversations by topic:'+topic+" "+error);
			callback(null,error);
		})
		response.on('end',function(){
			if (JSON.parse(body).message){
				res.render('conversationsList',{
		  					message: 'Can not find any conversations, please change new topic'
		  		});
			}else {
				conversations = JSON.parse(body).docs;
				http.get(url+'/api/conversations/list/schedule',function(response){
					var body = '';
			  		response.on('data', function(chunk) {
			    		body += chunk;
			  		});
			  		response.on('error',function(error){
			  			log.error('get schedule conversations list:'+error);
			  			res.render('conversationsList',{
			  				message: error
			  			});
			  		});
			  		response.on('end',function(){
			  			var conversations = JSON.parse(body).rows;
			  			if (conversations.length > 0){
			  				res.render('conversationsList',{
			  					conversations: conversations
			  				});
			  			}else {
			  				res.render('conversationsList',{
			  					message: 'Can not find any conversations, please change new topic'
			  				});
			  			}
			  		});

	  			});
	  		}
		});
	});
}