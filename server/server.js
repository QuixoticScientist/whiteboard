var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var http = require('http');
var handle = require('./request-handler');
var bodyParser = require('body-parser');
var util = require('./utils/util');

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/lib'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/getToken', handle.getToken);

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
var io = require('./sockets')(server, { serveClient: true });


// setInterval(function () {
//   io.emit('echo');
// }, 500);

app.get('/api/:id', function (req, res) {
  var roomId = req.params.id;
});

var start = function () {
  server.listen(port);
};

var end = function () {
  server.close();
};

start();

exports.start = start;
exports.end = end;
exports.app = app;
