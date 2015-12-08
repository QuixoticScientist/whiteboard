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
      data['socketId'] = socket.id;
      _.extend(board[socket.id], data);
      socket.to(this.room).emit('shapeCreated', board[socket.id]);
    });

    socket.on('editShape', function (data) {
      data['socketId'] = socket.id;
      board[socket.id].newX = data.coords.initX;
      board[socket.id].newY = data.coords.initY;
      socket.to(this.room).emit('shapeEdited', data);
    });

    socket.on('shapeCompleted', function (data) {
      client.lrange(socket.id, 0, -1, function (reply) {
        client.rpush([socket.id, JSON.stringify(board[socket.id])]);
      });
    });

    socket.on('roomId', function (data) {
      rooms.addMember(socket, data.roomId);
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

  });

  return io;

};
