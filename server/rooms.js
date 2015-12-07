var utils = require('./utils/util');
var client = require('./db/config');

var rooms = {};

var Room = function () {
  this.board = null;
  this.members = [];
};

var roomsManager = {

  getRoom: function (roomName) {
    return rooms[roomName];
  },

  deleteBoard: function (roomName) {
    delete rooms[roomName];
  },

  handleMemberDisconnect: function (socket) {
    var roomName = socket.room;
    var room = this.getRoom(roomName);

    if (room) {
      //remove a player from the room if the game has not started.
      room.members = room.members.filter(function(member) {
        return member !== socket.id;
      });
    } else {
      return;
    }
  },

  addMember: function (socket, roomId) {
    // create board if it hasn't already been created
    if (!rooms[roomId]) {
      rooms[roomId] = new Room();
    }

    socket.room = roomId;
    socket.join(roomId);
    rooms[roomId].members.push(socket.id);
    console.log('Current room ' + roomId + ' has ' + rooms[roomId].members.length + ' members');
  },

  getMemberIndex: function (socket) {
    return this.getRoom(socket.room).members.indexOf(socket.id);
  }

}

module.exports = roomsManager;
