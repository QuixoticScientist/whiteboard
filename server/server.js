var express = require('express');
var app = express();
var io = require('socket.io').listen(4000);
var handle = require('./request-handler');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/lib'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getToken', handle.getToken);
app.get('/getBoard', handle.getBoard);

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Server is listening')
});

io.on('connection', function (socket) {
  var room = socket.handshake['query']['r_var'];

  socket.join(room);
  console.log('user joined room #'+room);

  socket.on('disconnect', function() {
    socket.leave(room)
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    io.to(room).emit('chat message', msg);
  });
});
