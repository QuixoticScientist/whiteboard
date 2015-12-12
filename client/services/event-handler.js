angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', function (BoardData, ShapeBuilder) {
  function createShape (id, socketID, tool, x, y) {
    ShapeBuilder.newShape(id, socketID, tool, x, y);

    // broadcast to server
    Broadcast.newShape($scope.selectedShape.id, $scope.tool.name, coords, $scope.tool.colors);

    $scope.selectedShape.coords = coords;

    ShapeBuilder.storeOnEditShape(Broadcast.getSocketId(), $scope.selectedShape);
  }

  return {
    createShape: createShape
  };
}]);
