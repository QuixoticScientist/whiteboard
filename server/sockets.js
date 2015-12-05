var socketio = require('socket.io');

module.exports = function(server) {

  var openSockets = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {
    var room = socket.handshake['query']['board'];

    socket.join(room);
    console.log('user joined room #'+room);

    socket.on('disconnect', function() {
      socket.leave(room);
      console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
      io.to(room).emit('chat message', msg);
    });
  });

  return io;

};
