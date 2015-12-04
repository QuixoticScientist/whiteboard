var express = require('express');
var app = express();
var http = require('http');
var handle = require('./request-handler');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/lib'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getToken', handle.getToken);
app.get('/getBoard', handle.getBoard);

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
var io = require('./sockets')(server);

server.listen(port);

module.exports = app;
