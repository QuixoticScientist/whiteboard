var utils = require('./utils/util');
var client = require('./db/config');

var rooms = {};

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

    var storedRoom;
    client.get(roomId, function (err, reply) {
      if (reply) {
        // deal with returning reply to board for new member
        storedRoom = JSON.parse(reply);
        // console.log(storedRoom, 'storedRoom');
      } else {
        client.set(roomId, JSON.stringify({}));
        rooms[roomId] = {};
      }
      
      if (!rooms[roomId]) {
        rooms[roomId] = {};
      }

      // add member to room based on socket id
      var socketId = socket.id;
      rooms[roomId][socketId] = {};
      console.log(rooms[roomId], 'rooms[roomId]');

      socket.emit('showExisting', rooms[roomId]);
      
      var count = 0;
      for (var member in rooms[roomId]) {
        count++;
      }
      console.log('Current room ' + roomId + ' has ' + count + ' members');
    });
  },

  addShape: function (shape, socket) {
    // instantiate shape object within socket id; add type, initCoords, colors properties
    console.log(shape);
    var shapeObj = {};
    shapeObj['type'] = shape.type;
    shapeObj['initCoords'] = shape.initCoords;
    shapeObj['colors'] = shape.colors;

    rooms[socket.room][socket.id][shape.shapeId] = shapeObj;
  },

  editShape: function (shape, socket) {
    // add newX and newY properties to shape object
    var newX = shape.mouseX;
    var newY = shape.mouseY;

    rooms[socket.room][socket.id][shape.shapeId]['newX'] = newX;
    rooms[socket.room][socket.id][shape.shapeId]['newY'] = newY;
  },

  completeShape: function (socket) {
    client.set(socket.room, JSON.stringify(rooms[socket.room]));
  }

}

module.exports = roomsManager;
