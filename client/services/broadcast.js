angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets) {

  var socketUserId;

  var getSocketId = function () {
    return socketUserId;
  };

  var saveSocketId = function (id) {
    socketUserId = id;
  };

  Sockets.emit('idRequest');

  var newShape = function (id, socketID, tool, mouseX, mouseY) {
    Sockets.emit('newShape', {
      shapeId: id,
      socketId: socketID,
      tool: tool,
      initX: mouseX,
      initY: mouseY
    });
  };

  var editShape = function (id, socketID, currentTool, mouseX, mouseY) {
    var data = {};
    data.mouseX = mouseX;
    data.mouseY = mouseY;
    data.shapeId = id;
    data.socketId = socketID;
    data.tool = currentTool;
    Sockets.emit('editShape', data);
  };

  var finishShape = function (shapeId, currentTool) {
    Sockets.emit('shapeCompleted', {
      shapeId: shapeId,
      tool: currentTool
    });
  };

  var deleteShape = function (shapeId, socketId) {
    Sockets.emit('deleteShape', {
      shapeId: shapeId,
      socketId: socketId
    })
  };

  var moveShape = function (shapeId, socketId, x, y) {
    Sockets.emit('moveShape', {
      shapeId: shapeId,
      socketId: socketId,
      mouseX: x,
      mouseY: y
    })
  };

  return {
    getSocketId: getSocketId,
    saveSocketId: saveSocketId,
    newShape: newShape,
    editShape: editShape,
    finishShape: finishShape,
    deleteShape: deleteShape,
    moveShape: moveShape
  };

});
