/*
	Author: Elyas khan, shucheng cui
	Date: 31-March-2016
	Description: user guide of twitter conversation retrieval web application
 */

1.Software Requirements
1.1	couchdb:
we use the couchdb as database to store all the twitter conversations data and the couchdb installation version is @1.6
1.2	node.js:
we use the node.js as the backend development framework and the node.js installation version is @4.4.2

2.Application Installation
2.1	clone source code from github repository: github.com/shuchengc/TweetConversationRetrieve
2.2	install all the depedencies packages: $npm install
2.3 create database "tweets" in couchdb, create couchdb views 
2.4 install all the packages: $npm install 
2.5 start the application: $grunt

3.Node.js package dependencies
All the package dependencies are list in the package.json file and you can use "npm install" command to install all the needed packages.
* express: httpserver framework, $npm install express
* jade: templates engine, $npm install express
* bower: library management tools, $sudo npm install bower -g
* bootstrap: third-party CSS library, $bower install bootstrap
* fs: filesystem manipulation library, $npm install fs
* http: http request library, $npm install http
* moment: date library, $npm install moment
* body-parse: body parsing middleware, $npm install body-parser
* async: promise asynchronous functions to execute synchronously, $npm install async
* morgan: request log middleware, $npm install morgan
* log: create log files module, $npm install log
* underscore: javascript utility library, $npm install underscore
* grunt: javascript tasker runner
	$npm install grunt -g
	$npm install grunt-cli -g
	$npm install grunt-contrib-watch --save-dev
	$npm install grunt-nodemon --save-dev
	$npm install grunt-concurrent --save-dev

4.Application Directory
4.1 app.js: main entry of application
4.2 app: application directory
	- controller: 
		- api: rest api service functions
		- web: web controller functions
	- views: html view templates
		- includes: share head and header
		- pages: html pages
		- layout.jade: layout html page
4.3 log: log files directory
4.4 public
	- css: css file
	- font: font files
	- img: image files
	- js: javascript files
	- libs: bootstrap and jquery library
4.5 routes: application route configuration files
	- routeAPI.js : rest api service route file
	- routes.js: web route file
4.6 config
	- software configuration file
	stream_timeout: the parameter of twitter stream request timeout
	server_time: the parameter of express server request timeout
	replies_loops: the times of call twitter search api 
	couchdb_url: the IP address of couchdb server,default value is localhost
	couchdb_port: the port of couchdb server,default value is 5984
	couchdb_dbname: the name of database, default value is tweets
	rest_api_url: the IP address of rest api service,default value is localhost
	rest_api_port: the port of rest api service,default value is 8080
	twitter_key: the consumer and secret keys for twitter developer 

5.REST HTTP APIs Reference
5.1 Couchdb REST APIs
(a) GET /api/couchdb/doc/:docid
Return document by the specified docid from the specified database
Parameters: docid - Document ID
Request: 
	curl -X 'GET' http://localhost:8080/api/couchdb/doc/715705960203821056
Response:
	One tweet JSON Object
(b) POST /api/couchdb/doc/new/:docid
create a new document by the specified docid and return the status of document creation
Parameters: docid - Document ID
Request:
	curl -X 'POST' http://localhost:8080/api/couchdb/doc/new/715705960203821056 -H 
	'Content-Type:application/json' -d {json object}
Response:
	{"id":715705960203821056,"ok":true,"rev":....}
(c)	POST /api/couchdb/doc/update/:docid
create a new revision of the existing document
Parameters: docid - Document ID
Request:
	curl -X 'POST' http://localhost:8080/api/couchdb/doc/update/715705960203821056 -H 
	'Content-Type:application/json' -d {json object}
Response:
	{"id":715705960203821056,"ok":true,"rev":....}
(d)	DELETE /api/couchdb/doc/:docid
delete a document by the specified document id
Parameters: docid - Document ID
Request:
	curl -X 'DELETE' http://localhost:8080/api/couchdb/doc/715705960203821056
Response:
	{"id":715705960203821056,"ok":true,"rev":....}
(e)	POST /api/couchdb/doc/_bulk_doc
create bulk of documents and use the _id field as document id
Request:
	curl -X 'POST' http://localhost:8080/api/couchdb/doc/_bulk_doc -d {"docs":[array of tweets]}
Response:
	[{"id":715705960203821056,"ok":true,"rev":....},..]

5.2 Twitter REST APIs
(a) GET /api/twitter/tweet/:id
return a tweet by the specified tweet id
Parameters: id - Tweet ID
Request:
	curl -X 'GET' http://localhost:8080/api/twitter/tweet/id
Response:
	One tweet JSON Object
(b) GET /api/twitter/stream/:topic
return the fixed number of tweets (conversations) which have replies by twitter streaming api
Parameters: topic - streaming track keyword
Query Parameters: limits - the fixed number of conversations which are retrieved
Request:
	curl -X 'GET' http://localhost:8080/api/twitter/stream/topic
Response:
	Array of tweet JSON Objects
(c)	GET /api/twitter/replies/:conversationId
return all the replies of the original tweet by the conversation id
Parameters: conversationId - the id_str of original tweet
Request:
	curl -X 'GET' http://localhost:8080/api/twitter/replies/conversationId
Response:
	Array of tweet JSON Objects

5.3	Conversation REST APIs
(a)	GET /api/conversation/list/All
return the list of all the conversations, including completed conversations and scheduled conversations
Request:
	curl -X 'GET' http://localhost:8080/api/conversations/list/all
Response:
	Array of conversations JSON Objects
(b)	GET /api/conversations/list/schedule
return the list of all the scheduled conversations, which can be used to retrieve replies
Request:
	curl -X 'GET' http://localhost:8000/api/conversations/list/schedule
Response:
	Array of conversations JSON Objects
(c) GET /api/conversations/list/completion
return the list of all the completed conversations
Request:
	curl -X 'GET' http://localhost:8000/api/conversations/list/completion
Response:
	Array of conversations JSON Objects
(d)	GET /api/conversations/show/:topic
return all the conversations by specified topic
Parameters:	topic - the search topic
Request:
	curl -X 'GET' http://localhost:8080//api/conversations/show/:topic
Response:
	Array of conversations JSON Objects
(e) GET /api/conversations/allReplies/:conversationId
return the conversation and all the replies by the specified conversation id
Parameters: conversationId - conversation id 
Request:
	curl -X 'GET' http://localhost:8080//api/conversations/allReplies/:conversationId
Response:
	Array of replies JSON Object

5.4	Topic REST APIs
(a)	GET /api/topics/list
return the list of all topics and contains the sum conversation num of each topic
Request:
	curl -X 'GET' http://localhost:8080/api/topics/list
Response:
	{"rows":[{"key":"china","value":2},{"key":"Donald Trump","value":2},{"key":"happy","value":3},{"key":"melbourne","value":2},{"key":"violence","value":8}]}



















