/*
  Author: shuchengc
  Date: 27-March-2016
  Description: index APIs functions
 */
var http = require('http');
var fs = require('fs');
var Log = require('log');
var log = new Log('error',fs.createWriteStream('./log/error.log'));

//index render page function
exports.index = function(req,res){
	var topics;
  var protocol = "http:";
  var host = req.app.locals.rest_api.rest_api_url;
  var port = req.app.locals.rest_api.rest_api_port;
  var url = protocol+"//"+host+":"+port;
	http.get(url+'/api/topics/list',function(response){
		var body = '';
  		response.on('data', function(chunk) {
    		body += chunk;
  		});
  		response.on('error',function(error){
  			log.error('get topics list error:'+error);
  			res.render('index',{
  				message: message
  			});
  		})
  		response.on('end', function() {
  			topics = JSON.parse(body).rows;
  			if (topics.length >0) {
  				res.render('index',{
					topics: topics
				});
  			} else {
  				res.render('index',{
  					message: 'There is no data, please create new one'
  				});
  			}
  		});
	});
};