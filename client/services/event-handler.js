angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', 'ShapeEditor', function (BoardData, ShapeBuilder, ShapeEditor) {
  function createShape (id, socketID, tool, x, y) {
    ShapeBuilder.newShape(id, socketID, tool, x, y);
    // ??? ShapeBuilder.storeOnEditShape(Broadcast.getSocketId(), $scope.selectedShape);
  }

  function editShape (id, socketID, tool, x, y) {
  	ShapeEditor.editShape(id, socketID, tool, x, y);
  }

  function finishShape (id, socketID, tool) {
    ShapeEditor.finishShape(id, socketID, tool);
  }

  return {
    createShape: createShape,
    editShape: editShape,
    finishShape: finishShape
  };
}]);
