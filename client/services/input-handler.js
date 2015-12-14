angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData','Snap', 'EventHandler', function (BoardData, Snap, EventHandler) {
  function getMouseXY (ev) {
    var canvasMarginXY = BoardData.getCanvasMargin();
    var scalingFactor = BoardData.getScalingFactor();
    var offsetXY = BoardData.getOffset();
    return {
      x: (ev.clientX - canvasMarginXY.x) * scalingFactor + offsetXY.x,
      y: (ev.clientY - canvasMarginXY.y) * scalingFactor + offsetXY.y
    };
  }

  function mouseDown (ev) {
    var currentShape = BoardData.getCurrentShape();
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();

    if (currentShape && currentShape.type === 'text') {
      // !!! boardCtrl.finishShape();
    } else if (currentTool.name === 'eraser') {
      // !!! var el = ShapeBuilder.raphael.getElementByPoint(ev.clientX, ev.clientY);
      // !!! if (el) el.remove();
    } else {
      // !!! boardCtrl.createShape(ev);
      var id = BoardData.generateShapeID();
      var mouseXY = getMouseXY(ev);

      //this snaps the initial point to any available snapping points
      var coords = Snap.snapToPoints(mouseXY.x, mouseXY.y, 15);
      EventHandler.createShape(id, socketID, currentTool, coords[0], coords[1]);
      BoardData.setCurrentShape();

      // broadcast to server
      // !!! Broadcast.newShape($scope.selectedShape.id, $scope.tool.name, coords, $scope.tool.colors);
    }

  }

  function mouseMove (ev) {
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();
    var id = BoardData.getCurrentShapeID();
    var currentShape = BoardData.getCurrentShape();
    if (currentShape) {
      var mouseXY = getMouseXY(ev);
      EventHandler.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      //BROADCAST
    }
  }

  function mouseUp (ev) {
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();
    var id = BoardData.getCurrentShapeID();
    var currentShape = BoardData.getCurrentShape();
    
    if (currentShape && currentShape.type !== 'text') {
      EventHandler.finishShape(id, socketID, currentTool);
      BoardData.unsetCurrentShape();
      //BROADCAST
    }
  }

  function doubleClick (ev) {
    // !!! boardCtrl.zoom(ev);
  }

  return {
    mousedown: mouseDown,
    mousemove: mouseMove,
    mouseup: mouseUp,
    dblclick: doubleClick
  };
}]);
