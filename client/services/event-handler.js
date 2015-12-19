angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', 'ShapeEditor', 'ShapeManipulation', 'Snap', function (BoardData, ShapeBuilder, ShapeEditor, ShapeManipulation, Snap) {

  function setSocketId (socketId) {
    BoardData.setSocketId(socketId);
  };

  function createShape (id, socketId, tool, x, y) {
    ShapeBuilder.newShape(id, socketId, tool, x, y);
  }

  function editShape (id, socketId, tool, x, y) {
  	ShapeEditor.editShape(id, socketId, tool, x, y);
  }

  function finishShape (shape) {
    ShapeEditor.finishShape(shape.id, shape.socketId, shape.tool);
  }

  function deleteShape (id, socketId) {
    ShapeEditor.deleteShape(id, socketId);
  }

  function moveShape (shape, x, y) {
    ShapeManipulation.moveShape(shape.id, shape.socketId, x, y);
  }

  function finishMovingShape (id, socketId) {
    ShapeManipulation.finishMovingShape (id, socketId);
  }

  function drawExistingPath (shape) {
    ShapeBuilder.drawExistingPath(shape);
  }

  function cursor (screenPosition) {
    var cursor = BoardData.getCursor() || BoardData.setCursor();
    BoardData.moveCursor(screenPosition);
  }

  function grabShape (screenPosition) {
    var x = Math.floor(screenPosition[0]);
    var y = Math.floor(screenPosition[1]);

    var currentEditorShape;

    currentEditorShape = BoardData.getEditorShape();

    if (!currentEditorShape) {
      var shape = BoardData.getBoard().getElementByPoint(x, y);
      if (shape) {
        BoardData.setEditorShape(shape);
        currentEditorShape = BoardData.getEditorShape();
      }
    } else {
      moveShape(currentEditorShape, x, y);
    }
  }

  return {
    cursor: cursor,
    setSocketId: setSocketId,
    createShape: createShape,
    editShape: editShape,
    finishShape: finishShape,
    deleteShape: deleteShape,
    moveShape: moveShape,
    finishMovingShape: finishMovingShape,
    drawExistingPath: drawExistingPath,
    grabShape: grabShape
  };
}]);
