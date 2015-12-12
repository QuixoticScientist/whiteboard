angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', function (BoardData, ShapeBuilder) {
  function createShape (id, socketID, tool, x, y) {
    ShapeBuilder.newShape(id, socketID, tool, x, y);
    // ??? ShapeBuilder.storeOnEditShape(Broadcast.getSocketId(), $scope.selectedShape);
  }

  function editShape (x, y) {
  	ShapeEditor.editShape(id, socketID, tool, x, y);
  }

  return {
    createShape: createShape
  };
}]);
