var Index = require('../app/controllers/web/index');
var Conversation = require('../app/controllers/web/conversation');
var Topic = require('../app/controllers/web/topic');
var Configure = require('../app/controllers/web/configure');
module.exports = function(app){
	// index page route
	app.get('/', Index.index);

	//conversation list page route
	app.get('/conversations/list/all', Conversation.getAllConversations);
	app.get('/conversations/list/schedule',Conversation.getScheduleConversations);
	app.get('/conversations/list/completion',Conversation.getCompletedConversations);
	app.get('/conversations/list/:topic',Conversation.getConversationsByTopic);
	app.get('/conversations/show/:id', Conversation.getAllRepliesByConversation);
	app.get('/topics/search',Topic.topicSearch);
	app.post('/topics/search/new', Topic.createConversationsByTopic);
	app.get('/configure',Configure.show);
};