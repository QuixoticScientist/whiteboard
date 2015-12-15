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
      //console.log('idRequest is requestin');
      socket.emit('socketId', {socketId: socket.id});
    });

    socket.on('roomId', function (data) {
      rooms.addMember(socket, data.roomId);
      socket.to(this.room).emit('layerList');
      socket.emit('layerList');
    });

    socket.on('newShape', function (data) {
      // data['socketId'] = socket.id;
      // _.extend(board[socket.id], data);
      console.log('Sockets.newShape ', data);
      socket.to(this.room).emit('shapeCreated', data);
      //socket.emit('shapeCreated', board[socket.id]);
      rooms.addShape(data, socket);

    });

    socket.on('editShape', function (data) {
      // data['socketId'] = socket.id;
      // console.log(data);
      // board[socket.id].newX = data.mouseX;
      // board[socket.id].newY = data.mouseY;
      socket.to(this.room).emit('shapeEdited', data);
      //socket.emit('shapeEdited', data);
      rooms.editShape(data, socket);
    });

    socket.on('shapeCompleted', function (data) {
      socket.to(this.room).emit('shapeCompleted', {
        socketId: socket.id,
        shapeId: data.shapeId,
        tool: data.tool
      });
      // socket.emit('shapeCompleted', {
      //   socketId: socket.id,
      //   shapeId: data.shapeId,
      //   tool: data.tool
      // });
      rooms.completeShape(socket);
      socket.to(this.room).emit('layerList');
      socket.emit('layerList');
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

  });

  return io;

};
