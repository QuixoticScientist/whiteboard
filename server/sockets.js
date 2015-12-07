var socketio = require('socket.io');
var rooms = require('./rooms');

module.exports = function(server) {

  var openSockets = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {

    socket.on('roomId', function (data) {
      rooms.addMember(socket, data.roomId);
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

    // rooms.addMember(socket, roomId);
  });

  return io;

};
