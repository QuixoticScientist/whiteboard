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
      board[socket.id].coords = [];
      socket.to(this.room).emit('shapeCreated', board);
    });

    socket.on('editShape', function (data) {
      board[socket.id].coords.push(data.coords);
      socket.to(this.room).emit('shapeUpdate', board);
    });

    socket.on('completeShape', function (data) {
      console.log(board[socket.id]);
      client.lrange(socket.id, 0, -1, function (reply) {
        client.rpush([socket.id, JSON.stringify(board[socket.id])]);
      });
    });

    socket.on('roomId', function (data) {
      console.log(data);
      rooms.addMember(socket, data.roomId);
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

  });

  return io;

};
