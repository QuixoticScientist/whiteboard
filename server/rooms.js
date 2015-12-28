var utils = require('./utils/util');
var client = require('./db/config');
var _ = require('underscore');

var rooms = {};

var roomsManager = {

  getRoom: function (roomId) {
    return rooms[roomId];
  },

  handleMemberDisconnect: function (socket) {
    var roomId = socket.room;
    // var room = this.getRoom(roomId);

    console.log('Member ' + socket.id + ' is leaving room ' + roomId);
    // var roomFilter = function (room, predicate) {
    //   var filteredMembers = {};

    //   for (member in room) {
    //     if (room.hasOwnProperty(member) && member !== socket.id) {
    //       filteredMembers[member] = room[member];
    //     }
    //   }

    //   return filteredMembers;
    // };

    // if (room) {
    //   //remove a player from the room
    //   var newRoom = roomFilter(room);
    //   rooms[roomId] = newRoom;
    // } else {
    //   return;
    // }
  },
  
  addMember: function (socket, roomId) {

    // ensure there isn't double counting of roomIds in client side ('/roomId' and 'roomId' emit separately)
    if (roomId[0] === '/') {
      roomId = roomId.slice(1);
    }

    socket.room = roomId;
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }

    client.get(roomId, function (err, reply) {
      if (reply) {
        storedRoom = JSON.parse(reply);
        _.extend(rooms[roomId], storedRoom);
      } else {
        client.set(roomId, JSON.stringify({}));
        rooms[roomId] = {};
      }
      
      if (!rooms[roomId]) {
        rooms[roomId] = {};
      }

      // add member to room based on socket id
      console.log(rooms[roomId]);
      var socketId = socket.id;
      rooms[roomId][socketId] = {};
      socket.emit('showExisting', rooms[roomId]);
      //console.log(rooms[roomId]);
      
      var count = 0;
      for (var member in rooms[roomId]) {
        count++;
      }
      console.log('Current room ' + roomId + ' has ' + count + ' members');
    });
  },

  addShape: function (shape, socket) {
    rooms[socket.room][shape.socketId][shape.id] = shape;
  },

  editShape: function (shape, socket) {
    rooms[socket.room][shape.socketId][shape.id]['mouseX'] = shape.mouseX;
    rooms[socket.room][shape.socketId][shape.id]['mouseY'] = shape.mouseY;   
  },

  moveShape: function (shape, socket) {
    // console.log(shape);
    // var deltaX = shape.mouseX - shape.initX;
    // var deltaY = shape.mouseY - shape.initY;
    // rooms[socket.room][shape.socketId][shape.id]['initX'] = shape.initX;
    // rooms[socket.room][shape.socketId][shape.id]['initY'] = shape.initY;
    // rooms[socket.room][shape.socketId][shape.id]['mouseX'] = shape.mouseX + deltaX;
    // rooms[socket.room][shape.socketId][shape.id]['mouseY'] = shape.mouseY + deltaY;
    rooms[socket.room][shape.socketId][shape.id].attr = shape.attr;
  },

  completePath: function (shape, socket) {
    rooms[socket.room][socket.id][shape.id]['pathDProps'] = shape.pathDProps;
    client.set(socket.room, JSON.stringify(rooms[socket.room]));
  },

  completeShape: function (shape, socket) {
    if (shape.tool.text) {
      rooms[socket.room][socket.id][shape.id]['tool']['text'] = shape.tool.text;
    }
    client.set(socket.room, JSON.stringify(rooms[socket.room]));
  },

  deleteShape: function (shape, socket) {
    delete rooms[socket.room][shape.socketId][shape.id];
  }

}

module.exports = roomsManager;
