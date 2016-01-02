var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var util = require('./utils/util');
var rooms = require('./rooms');
var client = require('./db/config');
var fs = require('fs');
var compression = require('compression');

app.use(compression());
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/lib'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
var io = require('./sockets')(server);

app.get('/:id', function (req, res) {
  res.sendfile('./client/index.html');
});

app.get('/:id/screenShot', function (req, res) {
  webshot('localhost:3000/' + req.params.id, req.params.id + '.png', function(err) {
    res.sendfile(req.params.id + '.png');
  });
})

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
