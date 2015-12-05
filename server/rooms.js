var utils = require('./utils/util');

var rooms = {};

var Room = function () {
  this.boardInProgress = false;
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
  }

}

module.exports = roomsManager;
