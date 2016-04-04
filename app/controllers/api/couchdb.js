/*
	Author:shuchengc
	Date: 27-March-2016
	Description: couchdb APIs functions
 */
var http = require('http');
var _ = require('underscore');
var fs = require('fs');
var Log = require('log');
var log = new Log('error',fs.createWriteStream('./log/error.log'));

//Get one document by ID
exports.getDocById = function(req,res){
	var docid = req.params.docid;
	var protocol = "http:";
	var host = req.app.locals.couchdb.couchdb_url;
	var path = "/"+req.app.locals.couchdb.couchdb_dbname+"/";
	var port = req.app.locals.couchdb.couchdb_port;
	var url =  protocol + "//" + host + ":" + port + path + docid;
	http.get(url,function(response){
		var body = '';
		response.on('data',function(chunk){
			body += chunk;
		});
		response.on('error',function(error){
			log.error('getDocById '+docid+':'+error);
			res.json({error:error});
		})
		response.on('end',function(){
			var result = JSON.parse(body);
			res.json(result);
		});
	});
};

//Create a new document by specific ID
exports.newOneDoc = function(req,res){
	var docid = req.params.docid;
	var postData = req.body;
	var protocol = "http:";
	var host = req.app.locals.couchdb.couchdb_url;
	var port = req.app.locals.couchdb.couchdb_port;
	var path = "/"+req.app.locals.couchdb.couchdb_dbname+"/"
	var options = {
		protocol: protocol,
		host: host,
		port: port,
		path: path + docid,
		method: 'PUT'
	}
	var request = http.request(options,function(response){
		var body = '';
		response.on('data',function(chunk){
			body += chunk;
		});
		response.on('error',function(error){
			log.error('newOneDoc '+docid+':'+error);
			res.json({error:error});
		});
		response.on('end',function(){
			var result = JSON.parse(body);
			res.json(result);
		});
	});
	request.on("error",function(error){
		log.error('newOneDoc '+docid+':'+error);
		res.json({error:error});
	});
	request.write(JSON.stringify(postData));
	request.end();
};

//update a doc by id
exports.updateById = function(req,res){
	var docid = req.params.docid;
	var _obj = req.body;
	var obj;
	var protocol ='http:';
	var host = req.app.locals.couchdb.couchdb_url;
	var port = req.app.locals.couchdb.couchdb_port;
	var path = "/"+req.app.locals.couchdb.couchdb_dbname+"/";
	var url = protocol +"//" + host + ":" + port + path + docid;
	http.get(url,function(response){
		var body = '';
		response.on('data',function(chunk){
			body += chunk;
		});
		response.on('error',function(error){
			log.error('updateById '+docid+':'+error);
			res.json({error:error});
		})
		response.on('end',function(){
			obj = JSON.parse(body);
			var postObj = _.extend(obj,_obj);
			var options = {
				protocol: protocol,
				host: host,
				port: port,
				path: path + docid,
				method: 'PUT'
			}
			var request = http.request(options,function(response){
				var body = '';
				response.on('data',function(chunk){
					body += chunk;
				});
				response.on('error',function(error){
					log.error('updateById '+docid+':'+error);
					res.json({error:error});
				});
				response.on('end',function(){
					var result = JSON.parse(body);
					res.json(result);
				});
			});
			request.on("error",function(error){
				log.error('updateById '+docid+':'+error);
				res.json({error:error});
			});
			request.write(JSON.stringify(postObj));
			request.end();
		});
	});
};

//delete a doc by id
exports.deleteById = function(req,res){
	var docid = req.params.docid;
	console.log("docid:",docid);
	var protocol ="http:"
	var host = req.app.locals.couchdb.couchdb_url;
	var port = req.app.locals.couchdb.couchdb_port;
	var path = "/"+req.app.locals.couchdb.couchdb_dbname+"/";
	var url = protocol +"//" + host + ":" + port + path + docid;
	http.get(url,function(response){
		var body = '';
		response.on('data',function(chunk){
			body += chunk;
		});
		response.on('error',function(error){
			log.error('deleteById get'+docid+":"+error);
			res.json({error:error});
		})
		response.on('end',function(){
			var tweet = JSON.parse(body);
			var _rev = tweet._rev;
			console.log('_rev:',_rev);
			var options = {
				protocol: protocol,
				host: host,
				port: port,
				path: path + docid+'?rev='+_rev,
				method: 'DELETE'
			}
			console.log(options);
			var request = http.request(options,function(response){
				var body = '';
				response.on('data',function(chunk){
					body += chunk;
				});
				response.on('error',function(error){
					log.error('deleteById '+docid+":"+error);
					res.json({error:error});
				});
				response.on('end',function(){
					var result = JSON.parse(body);
					res.json(result);
				});
			});
			request.on("error",function(error){
				log.error('deleteById '+docid+":"+error);
				res.json({error:error});
			});
			request.end();
		});
	});
};

//save bulk docs
exports.saveBulkDocs = function(req,res){
	var postData = req.body;
	var protocol = "http:";
	var host = req.app.locals.couchdb.couchdb_url;
	var port = req.app.locals.couchdb.couchdb_port;
	var path = "/"+req.app.locals.couchdb.couchdb_dbname+"/";
	var options = {
		protocol: protocol,
		host: host,
		port: port,
		path: path+'_bulk_docs',
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		}
	}
	console.log(postData);
	console.log(options);
	var request = http.request(options,function(response){
		var body = '';
		response.on('data',function(chunk){
			body += chunk;
		});
		response.on('error',function(error){
			log.error('saveBulkDocs:'+error);
			res.json({error:error});
		});
		response.on('end',function(){
			var result = JSON.parse(body);
			res.json(result);
		});
	});
		request.on("error",function(error){
			log.error('saveBulkDocs:'+error);
			res.json({error:error});
		});
		request.write(JSON.stringify(postData));
		request.end();
}