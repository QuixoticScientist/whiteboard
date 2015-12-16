angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', 'ShapeEditor', 'ShapeManipulation', 'Snap', function (BoardData, ShapeBuilder, ShapeEditor, ShapeManipulation, Snap) {

  function setSocketID (socketId) {
    BoardData.setSocketID(socketId);
  };

  function createShape (id, socketId, tool, x, y) {
    ShapeBuilder.newShape(id, socketId, tool, x, y);
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

  function grabShape (screenPosition) {
    var x = screenPosition[0];
    var y = screenPosition[1];
    var currentShape = BoardData.getCurrentShape();

    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();

    if (currentShape && currentShape.type === 'text') {
      // !!! boardCtrl.finishShape();
    } else if (currentTool.name === 'eraser') {
      toggleEraser();
    } else if (currentTool.name === 'move') {
      var shape = BoardData.getBoard().getElementByPoint(x, y);
      if (shape) {
        BoardData.setEditorShape(shape);
      }
    }
    console.log('grabbed shape at ', x, ': ', y)
  }

  return {
    setSocketID: setSocketID,
    createShape: createShape,
    editShape: editShape,
    finishShape: finishShape,
    deleteShape: deleteShape,
    moveShape: moveShape,
    grabShape: grabShape
  };
}]);
