var Couchdb = require('../app/controllers/api/couchdb');
var Topic = require('../app/controllers/api/topic');
var Conversation = require('../app/controllers/api/conversation');
var TwitterAPI = require('../app/controllers/api/twitter-api');
module.exports = function(app){
	// couchdb api
	app.get('/api/couchdb/doc/:docid',Couchdb.getDocById);
	app.post('/api/couchdb/doc/new/:docid',Couchdb.newOneDoc);
	app.post('/api/couchdb/doc/update/:docid',Couchdb.updateById);
	app.delete('/api/couchdb/doc/:docid',Couchdb.deleteById);
	app.post('/api/couchdb/doc/_bulk_docs',Couchdb.saveBulkDocs);

	// twitter api
	app.get('/api/twitter/tweet/:id',TwitterAPI.getTweetById);
	app.get('/api/twitter/replies/:conversationId',TwitterAPI.getRepliesByConversationId);
	app.get('/api/twitter/stream/:keyword',TwitterAPI.getTweetsStreamByKeyword);

	//topic 
	app.get('/api/topics/list',Topic.getAllTopics);

	//conversation
	app.get('/api/conversations/list/all', Conversation.getAllConversations);
	app.get('/api/conversations/list/schedule',Conversation.getScheduleConversations);
	app.get('/api/conversations/list/completion',Conversation.getCompletedConversations);
	app.get('/api/conversations/show/:topic',Conversation.getConversationsByTopic);
	app.get('/api/conversations/allReplies/:conversationId',Conversation.getAllRepliesByConversationId)
};