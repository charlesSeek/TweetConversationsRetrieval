/*
  Author: shuchengc
  Date: 27-March-2016
  Description: conversation APIs for web functions
 */
var http = require('http');
var fs = require('fs');
var Log = require('log');
var log = new Log('error',fs.createWriteStream('./log/error.log'));

//Gets conversations by topic
exports.getConversationsByTopic = function(req,res){
	var topic = req.params.topic;
  var protocol = "http:";
  var host = req.app.locals.rest_api.rest_api_url;
  var port = req.app.locals.rest_api.rest_api_port;
  var url = protocol+"//"+host+":"+port;
	http.get(url + '/api/conversations/show/'+topic,function(response){
		var body = '';
  		response.on('data', function(chunk) {
    		body += chunk;
  		});
  		response.on('end',function(){
  			var conversations = JSON.parse(body).rows;
  			if (conversations.length >0){
  				res.render('conversationsListByTopic',{
  					conversations: conversations
  				});
  			} 
  		});
  		response.on('error',function(error){
  			log.error('getConversationsByTopic by '+topic+":"+error);
  			res.render('conversationsListByTopic',{
  				message: message
  			});
  		});
	});
};

//Gets the list of all conversations
exports.getAllConversations = function(req,res){
  var protocol = "http:";
  var host = req.app.locals.rest_api.rest_api_url;
  var port = req.app.locals.rest_api.rest_api_port;
  var url = protocol+"//"+host+":"+port;
	http.get(url+'/api/conversations/list/all',function(response){
		var body = '';
  		response.on('data', function(chunk) {
    		body += chunk;
  		});
  		response.on('error',function(error){
  			log.error('getAllConversations:'+error);
  			res.render('conversationsList',{
  				message: message
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
  					message: 'There are no any conversations, please create new conversations'
  				});
  			}
  		});
	});
};

//Gets the list of schedule conversations
exports.getScheduleConversations = function(req,res){
  var protocol = "http:";
  var host = req.app.locals.rest_api.rest_api_url;
  var port = req.app.locals.rest_api.rest_api_port;
  var url = protocol+"//"+host+":"+port;
  http.get(url+'/api/conversations/list/schedule',function(response){
    var body = '';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('error',function(error){
        log.error('getScheduleConversations:'+error);
        res.render('conversationsList',{
          message: message
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
            message: 'There are no any schedule conversations, please create new conversations'
          });
        }
      });
  });
};

//Gets the list of completed convesations
exports.getCompletedConversations = function(req,res){
  var protocol = "http:";
  var host = req.app.locals.rest_api.rest_api_url;
  var port = req.app.locals.rest_api.rest_api_port;
  var url = protocol+"//"+host+":"+port;
  http.get(url+'/api/conversations/list/completion',function(response){
    var body = '';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('error',function(error){
        log.error('getCompletedConversations:'+error);
        res.render('conversationsList',{
          message: message
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
            message: 'There are no any completed conversations, please create new conversations'
          });
        }
      });
  });
};

//Get all replies by conversation 
exports.getAllRepliesByConversation = function(req,res){
  var conversationId = req.params.id;
  var protocol = "http:";
  var host = req.app.locals.rest_api.rest_api_url;
  var port = req.app.locals.rest_api.rest_api_port;
  var url = protocol+"//"+host+":"+port;
  http.get(url+'/api/conversations/allReplies/'+conversationId,function(response){
    var body = '';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('error',function(error){
        log.error('getAllRepliesByConversation by '+conversationId+":"+error);
        res.render('repliesByOneConversation',{
          message: message
        });
      });
      response.on('end',function(){
        var replies = JSON.parse(body);
        if (replies.length > 0){
          res.render('repliesByOneConversation',{
            replies: replies
          });
        }else {
          res.render('repliesByOneConversation',{
            message: 'can not find related replies'
          });
        }
      });
  });
};