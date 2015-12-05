var utils = require('./utils/util');

var rooms = {};

var Room = function () {
  this.board = null;
  this.members = [];
};

var currentRoomName = null;

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

  addMember: function (socket) {
    if (!currentRoomName) {
      currentRoomName = utils.generateRandomId(5);
      rooms[currentRoomName] = new Room();
    }

    socket.room = currentRoomName;
    socket.join(currentRoomName);
    rooms[currentRoomName].members.push(socket.id);
    console.log('Current room has ' + rooms[currentRoomName].members.length + ' members');
  },

  getMemberIndex: function (socket) {
    return this.getRoom(socket.room).members.indexOf(socket.id);
  }

}

module.exports = roomsManager;
