angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', 'ShapeEditor', 'ShapeManipulation', 'Snap', function (BoardData, ShapeBuilder, ShapeEditor, ShapeManipulation, Snap) {

  function setSocketID (socketId) {
    BoardData.setSocketID(socketId);
  };

  function createShape (id, socketId, tool, x, y) {
    ShapeBuilder.newShape(id, socketId, tool, x, y);
    BoardData.setCurrentShape();  //Why is this here and not in Input Handler?
  }

  function editShape (id, socketID, tool, x, y) {
  	ShapeEditor.editShape(id, socketID, tool, x, y);
  }

  function finishShape (id, socketID, tool) {
    ShapeEditor.finishShape(id, socketID, tool);
  }

  function deleteShape (id, socketID) {
    ShapeEditor.deleteShape(id, socketID);
  }

  function moveShape (id, socketID, x, y) {
    ShapeManipulation.moveShape(id, socketID, x, y);
  }

  return {
    setSocketID: setSocketID,
    createShape: createShape,
    editShape: editShape,
    finishShape: finishShape,
    deleteShape: deleteShape,
    moveShape: moveShape
  };
}]);
