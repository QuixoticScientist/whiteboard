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
// app.get('/getBoard', handle.getBoard);

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
var io = require('./sockets')(server, { serveClient: true });

// setInterval(function () {
//   io.emit('echo');
// }, 500);
io.on('connection', function (socket) {
  io.on('echo', function (data) {
    socket.emit('echo', data);
  });

  io.on('echo-ack', function (data, callback) {
    callback(data);
  });
});

app.get('/:id', handle.getBoard, function (req, res) {
  var board = req.board;
  // emit board to socket
  io.of(board.endpoint).on('connection', function (socket) {
    socket.emit('getBoard', board);
  });

  res.status(200).send('Board emitted to socket');
});

var start = function () {
  server.listen(port);
};

var end = function () {
  server.close();
};

exports.start = start;
exports.end = end;
exports.app = app;
