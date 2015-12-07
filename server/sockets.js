var socketio = require('socket.io');
var rooms = require('./rooms');
// var Board = require('./db/models/board');
var client = require('./db/config');

module.exports = function(server) {

  var openSockets = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {

    socket.on('roomId', function (data) {
      rooms.addMember(socket, data.roomId);
    });

    socket.on('new board', function (data) {
      client.set('board', JSON.stringify(data));
      // var newBoard = new Board(data);
      // newBoard.save(function (err, board) {
      //   if (err) {
      //     throw new Error(err);
      //   } else {
      //     console.log(board);
      //   }
      // });
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

    // rooms.addMember(socket, roomId);
  });

  return io;

};
