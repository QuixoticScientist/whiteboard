var utils = require('./utils/util');
var client = require('./db/config');

var rooms = {};

// var Room = function () {};

var roomsManager = {

  getRoom: function (roomId) {
    return rooms[roomId];
  },

  handleMemberDisconnect: function (socket) {
    var roomId = socket.room;
    var room = this.getRoom(roomId);

    console.log('Member ' + socket.id + ' is leaving room ' + roomId);
    var roomFilter = function (room, predicate) {
      var filteredMembers = {};

      for (member in room) {
        if (room.hasOwnProperty(member) && member !== socket.id) {
          filteredMembers[member] = room[member];
        }
      }

      return filteredMembers;
    };

    if (room) {
      //remove a player from the room
      var newRoom = roomFilter(room);
      rooms[roomId] = newRoom;
    } else {
      return;
    }
  },

  addMember: function (socket, roomId) {

    // ensure there isn't double counting of roomIds in client side ('/roomId' and 'roomId' emit separately)
    if (roomId[0] === '/') {
      roomId = roomId.slice(1);
    }

    socket.room = roomId;
    socket.join(roomId);

    client.get(roomId, function (err, reply) {
      if (reply) {
        rooms[roomId] = JSON.parse(reply);
      } else {
        client.set(roomId, JSON.stringify({}));
        rooms[roomId] = {};
      }
      // add member to room based on socket id
      var socketId = socket.id;
      var obj = {};
      obj[socketId] = {};
      rooms[roomId][socketId] = {};
    });

    var count = 0;
    // console.log(rooms, 'rooms')
    for (var member in rooms[roomId]) {
      count++;
    }

    console.log('Current room ' + roomId + ' has ' + count + ' members');
  },

  addShape: function (shape, socket) {
    // instantiate shape object within socket id; add type and initCoords properties
    var shapeObj = {};
    shapeObj['type'] = shape.type;
    shapeObj['initCoords'] = shape.initCoords;

    rooms[socket.room][socket.id][shape.shapeId] = shapeObj;
  },

  editShape: function (shape, socket) {
    // add newX and newY properties to shape object
    var newX = shape.coords.initX;
    var newY = shape.coords.initY;

    rooms[socket.room][socket.id][shape.shapeId]['newX'] = newX;
    rooms[socket.room][socket.id][shape.shapeId]['newY'] = newY;
  },

  completeShape: function (socket) {
    client.set(socket.room, JSON.stringify(rooms[socket.room]));
  }

}

module.exports = roomsManager;
