var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var fs = require('fs');
var requestLogStream = fs.createWriteStream('./log/request.log',{flags:'a'});
var jsonfile = require('jsonfile');
var file = './config/app.json';

app.locals = jsonfile.readFileSync(file);
	
app.use(morgan('combined',{stream:requestLogStream}));
app.use(bodyParser.urlencoded({ extended: true,limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));
app.set('views','./app/views/pages');
app.use(express.static(__dirname +'/public'));
app.set('view engine', 'jade');
console.log("server is starting");
require('./routes/routeAPI')(app);
require('./routes/routes')(app);
var server = app.listen(8080);
server.timeout = 900000;
console.log(server.timeout);
