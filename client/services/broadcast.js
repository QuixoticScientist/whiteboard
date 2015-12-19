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

  var newShape = function (id, socketId, tool, mouseX, mouseY) {
    Sockets.emit('newShape', {
      id: id,
      socketId: socketId,
      tool: tool,
      initX: mouseX,
      initY: mouseY
    });
  };

  var editShape = function (id, socketId, currentTool, mouseX, mouseY) {
    var data = {};
    data.mouseX = mouseX;
    data.mouseY = mouseY;
    data.id = id;
    data.socketId = socketId;
    data.tool = currentTool;
    Sockets.emit('editShape', data);
  };

  var finishPath = function (id, currentTool, pathDProps) {
    Sockets.emit('pathCompleted', {
      id: id,
      tool: currentTool,
      pathDProps: pathDProps
    })
  };

  var finishShape = function (id, currentTool) {
    Sockets.emit('shapeCompleted', {
      id: id,
      tool: currentTool
    });
  };

  var deleteShape = function (id, socketId) {
    Sockets.emit('deleteShape', {
      id: id,
      socketId: socketId
    })
  };

  var moveShape = function (shape, x, y) {
    Sockets.emit('moveShape', {
      id: shape.id,
      socketId: shape.socketId,
      initX: x,
      initY: y,
      attr: shape.attr()
    })
  };

  var finishMovingShape = function (shape) {
    Sockets.emit('finishMovingShape', {
      id: shape.id,
      socketId: shape.socketId,
      attr: shape.attr()
    })
  }

  return {
    getSocketId: getSocketId,
    saveSocketId: saveSocketId,
    newShape: newShape,
    editShape: editShape,
    finishPath: finishPath,
    finishShape: finishShape,
    deleteShape: deleteShape,
    finishMovingShape: finishMovingShape,
    moveShape: moveShape
  };

});
