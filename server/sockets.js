var socketio = require('socket.io');
var rooms = require('./rooms');
var client = require('./db/config');

module.exports = function(server) {

  var openSockets = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {

    socket.on('roomId', function (data) {
      rooms.addMember(socket, data.roomId);
    });

    socket.on('new board', function (data) {
      client.set(data.roomId, JSON.stringify(data));
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

  });

  return io;

};
