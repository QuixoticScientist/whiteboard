angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', 'ShapeEditor', function (BoardData, ShapeBuilder, ShapeEditor) {

  function setSocketID (socketId) {
    BoardData.setSocketID(socketId);
  };

  function createShape (id, socketId, tool, x, y) {
    // console.log(tool);
    ShapeBuilder.newShape(id, socketId, tool, x, y);
    BoardData.setCurrentShape();
    // console.log(socketId);
    // ??? ShapeBuilder.storeOnEditShape(Broadcast.getSocketId(), $scope.selectedShape);
  }

  function editShape (id, socketID, tool, x, y) {
  	ShapeEditor.editShape(id, socketID, tool, x, y);
  }

  function finishShape (id, socketID, tool) {
    ShapeEditor.finishShape(id, socketID, tool);
  }

  return {
    setSocketID: setSocketID,
    createShape: createShape,
    editShape: editShape,
    finishShape: finishShape
  };
}]);
