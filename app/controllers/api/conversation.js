/*
  Author: shuchengc
  Date: 27-March-2016
  Description: conversation APIs functions
 */
var http = require('http');
var fs = require('fs');
var Log = require('log');
var log = new Log('error',fs.createWriteStream('./log/error.log'));

//Gets the list of all the conversations and descending by Date
exports.getAllConversations = function(req,res){
  var couchdb_url = 'http://'+req.app.locals.couchdb.couchdb_url+':'+req.app.locals.couchdb.couchdb_port;
	http.get(couchdb_url+'/tweets/_design/tweets/_view/allConversations?descending=true',function(response){
		var body = '';
  		response.on('data', function(chunk) {
    		body += chunk;
  		});
  		response.on('error',function(error){
        log.error('getAllConversations:'+error);
  			res.json({error:error});
  		});
  		response.on('end',function(){
  			var conversations = JSON.parse(body);
  			res.json(conversations);
  		});
	});
};

//Get the list of all the completed conversations(conversations have created and all the replies are retrieved)
// and descending by date
exports.getCompletedConversations = function(req,res){
  var couchdb_url = 'http://'+req.app.locals.couchdb.couchdb_url+':'+req.app.locals.couchdb.couchdb_port;
  http.get(couchdb_url+'/tweets/_design/tweets/_view/completedConversations?descending=true',function(response){
    var body = '';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('error',function(error){
        log.error('getCompletedConversations:'+error);
        res.json({error:error});
      });
      response.on('end',function(){
        var conversations = JSON.parse(body);
        res.json(conversations);
      });
  });
};

//Gets the list of all the schedule conversations(conversation have created and no replies are retrieved) 
//and descending by date
exports.getScheduleConversations = function(req,res){
   var couchdb_url = 'http://'+req.app.locals.couchdb.couchdb_url+':'+req.app.locals.couchdb.couchdb_port;
  http.get(couchdb_url+'/tweets/_design/tweets/_view/scheduleConversations?descending=true',function(response){
    var body = '';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('error',function(error){
        log.error('getScheduleConversations:'+error);
        res.json({error:error});
      });
      response.on('end',function(){
        var conversations = JSON.parse(body);
        res.json(conversations);
      });
  });
};

//Gets the list of conversations by one topic
exports.getConversationsByTopic = function(req,res){
	var topic = req.params.topic;
  var couchdb_url = 'http://'+req.app.locals.couchdb.couchdb_url+':'+req.app.locals.couchdb.couchdb_port;
	http.get(couchdb_url+'/tweets/_design/tweets/_view/topicConversation?key=\"'+topic+'\"',function(response){
		var body = '';
  		response.on('data', function(chunk) {
    		body += chunk;
  		});
  		response.on('end',function(){
  			var conversations = JSON.parse(body);
  			res.json(conversations);
  		});
  		response.on('error',function(error){
        log.error('getConversationsByTopic '+topic+':'+error);
  			res.json({error:error});
  		});
	});	
};

//Gets the list of all replies by one conversation
exports.getAllRepliesByConversationId = function(req,res){
  var conversationId = req.params.conversationId;
  var couchdb_url = 'http://'+req.app.locals.couchdb.couchdb_url+':'+req.app.locals.couchdb.couchdb_port;
  http.get(couchdb_url+'/tweets/_design/tweets/_view/allRepliesOfOneConversation?key=\"'+conversationId+'\"',function(response){
    var body = '';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('error',function(error){
        log.error('getAllRepliesByConversationId '+conversationId+':'+error);
        res.json({error:error});
      });
      response.on('end',function(){
        var replies = JSON.parse(body).rows;
        res.json(replies);
      });
  });
}