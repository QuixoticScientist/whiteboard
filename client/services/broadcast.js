angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets) {
/*
        var infoForServer = {
          shapeId: $scope.selectedShape.id,
          tool: $scope.tool.name,
          coords: $scope.selectedShape.coords,
          initCoordX: $scope.paper.canvasX,
          initCoordY: $scope.paper.canvasY
        };*/
  var socketUserId;

  var getSocketId = function () {
    return socketUserId;
  };

  var saveSocketId = function (id) {
    socketUserId = id;
  };

  Sockets.emit('idRequest');

  var newShape = function (shapeId, type, initCoords, colors) {
    Sockets.emit('newShape', {
      shapeId: shapeId,
      type: type,
      initCoords: initCoords,
      colors: colors
    });
  };

  var editShape = function (id, socketID, currentTool, mouseX, mouseY) {
    var data = {};
    data.mouseX = mouseX;
    data.mouseY = mouseY;
    data.shapeId = id;
    data.socketId = socketID;
    data.tool = currentTool;
    // console.log(data);
    Sockets.emit('editShape', data);
  };

  var finishShape = function (shapeId) {
    Sockets.emit('shapeCompleted', {
      shapeId: shapeId
    });
  };
  

  return {
    getSocketId: getSocketId,
    saveSocketId: saveSocketId,
    newShape: newShape,
    editShape: editShape,
    finishShape: finishShape
  };

});
