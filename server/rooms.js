var utils = require('./utils/util');
var client = require('./db/config');

var rooms = {};

var Room = function () {
  this.members = {};
};

var roomsManager = {

  getRoom: function (roomId) {
    return rooms[roomId];
  },

  handleMemberDisconnect: function (socket) {
    var roomId = socket.room;
    var room = this.getRoom(roomId);

    console.log('Member ' + socket.id + ' is leaving room ' + roomId);
    if (room) {
      //remove a player from the room
      room.members = room.members.filter(function(member) {
        return member !== socket.id;
      });
    } else {
      return;
    }
  },

  addMember: function (socket, roomId) {
    // create board if it hasn't already been created
    if (roomId[0] === '/') {
      roomId = roomId.slice(1);
    }

    if (!rooms[roomId]) {
      rooms[roomId] = new Room();
    }

    socket.room = roomId;
    socket.join(roomId);

    var socketId = socket.id;
    var obj = {};
    obj[socketId] = {};
    rooms[roomId]['members'][socketId] = {};

    var count = 0;
    console.log(rooms, 'rooms')
    for (var member in rooms[roomId]['members']) {
      count++;
    }
    console.log('Current room ' + roomId + ' has ' + count + ' members');
  },

  getMemberIndex: function (socket) {
    return this.getRoom(socket.room).members.indexOf(socket.id);
  },

  addShape: function (shape, socket) {
    rooms[socket.room]['members'][socket.id][shape.shapeId] = shape;
    // console.log(rooms[socket.room]['members']);
  },

  editShape: function (shapeId, socket) {
    //
  }

}

module.exports = roomsManager;
