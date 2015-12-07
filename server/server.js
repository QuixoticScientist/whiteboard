var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var http = require('http');
var handle = require('./request-handler');
var bodyParser = require('body-parser');
var util = require('./utils/util');

// app.get('/', function (req, res) {
//   res.redirect(301, '/room');
// });

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/lib'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/getToken', handle.getToken);
// app.get('/getBoard', handle.getBoard);

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
var io = require('./sockets')(server, { serveClient: true });

// setInterval(function () {
//   io.emit('echo');
// }, 500);

// app.get('/:id', handle.getBoard, function (req, res) {
//   var board = req.board;
//   // emit board to socket
//   // io.of(board.endpoint).on('connection', function (socket) {
//   //   socket.emit('getBoard', board);
//   // });

//   res.json(board);
// });

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
