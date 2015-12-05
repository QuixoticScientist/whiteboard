var socketio = require('socket.io');
var rooms = require('./rooms');

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



// // function to apply behavior to socket communication
// module.exports = function (socket) {
//   socket.on('disconnect', function () {
//     rooms.handlePlayerDisconnect(socket);
//   });
 
//   //When a player tries to turn, find the right room and player and call the changeDir method in that game.
//   socket.on('turn', function (data) {
//     var room = rooms.getRoom(this.room);
//     if (room && room.gameInProgress) {
//       var playerIndex = rooms.getPlayerIndex(socket);
//       room.game.changeDir(playerIndex, data.direction);
//     }
//   });

//   //Send the socket to rooms for handling.
//   socket.on('ready', function () {
//     rooms.placePlayer(socket);
//   });

//   rooms.placePlayer(socket);
// };
