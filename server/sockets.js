var socketio = require('socket.io');
var rooms = require('./rooms');
var client = require('./db/config');
var _ = require('underscore');

module.exports = function(server) {

  var room = {};
  var board = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {

    socket.on('layerChange', function (data) {
      // console.log(data);
    });

    socket.on('idRequest', function () {
      socket.emit('socketId', {socketId: socket.id});
    });

    socket.on('roomId', function (data) {
      rooms.addMember(socket, data.roomId);
      socket.to(this.room).emit('layerList');
      socket.emit('layerList');
    });

    socket.on('newShape', function (data) {
      console.log('Sockets.newShape ', data);
      socket.to(this.room).emit('shapeCreated', data);
      rooms.addShape(data, socket);

    });

    socket.on('editShape', function (data) {
      socket.to(this.room).emit('shapeEdited', data);
      rooms.editShape(data, socket);
    });

    socket.on('shapeCompleted', function (data) {
      socket.to(this.room).emit('shapeCompleted', {
        socketId: socket.id,
        shapeId: data.shapeId,
        tool: data.tool
      });
      rooms.completeShape(socket);
    });

    socket.on('moveShape', function (data) {
      console.log(data, 'moveShape')
      rooms.editShape(data, socket);
      socket.to(this.room).emit('shapeMoved', data);
    });

    socket.on('deleteShape', function (data) {
      rooms.deleteShape(data, socket);
      socket.to(this.room).emit('shapeDeleted', {shapeId: data.shapeId, socketId: data.socketId});
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

  });

  return io;

};
