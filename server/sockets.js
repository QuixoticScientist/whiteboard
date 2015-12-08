var socketio = require('socket.io');
var rooms = require('./rooms');
var client = require('./db/config');
var _ = require('underscore');

module.exports = function(server) {

  var board = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {

    socket.on('idRequest', function () {
      board[socket.id] = {};
      socket.emit('socketId', {socketId: socket.id});
    });

    socket.on('newShape', function (data) {
      _.extend(board[socket.id], data);
      socket.to(this.room).emit('shapeCreated', board);
    });

    socket.on('editShape', function (data) {
      console.log(data);
    });

    socket.on('completeShape', function (data) {
      console.log(data);
    });

    socket.on('roomId', function (data) {
      console.log(data);
      rooms.addMember(socket, data.roomId);
    });

    // socket.on('new board', function (data) {
    //   client.set(data.roomId, JSON.stringify(data));
    // });


    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

  });

  return io;

};
