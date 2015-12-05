var socketio = require('socket.io');
var rooms = require('./rooms');

module.exports = function(server) {

  var openSockets = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {

    socket.on('disconnect', function () {
      rooms.handlePlayerDisconnect(socket);
    });

    // send socket rooms ready for handling
    socket.on('ready', function () {
      rooms.addMember(socket);
    });

    rooms.addMember(socket);
  });

  return io;

};

