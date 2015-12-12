angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData','Snap', 'EventHandler', function (BoardData, Snap, EventHandler) {
  function getMouseXY (ev) {
    return {
      x: (ev.clientX - BoardData.canvasMarginX) * BoardData.scalingFactor + BoardData.offsetX,
      y: (ev.clientY - BoardData.canvasMarginY) * BoardData.scalingFactor + BoardData.offsetY
    };
  }

  function mouseDown (ev) {
    var currentShape = BoardData.getCurrentShape();
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();

    if (currentShape && currentShape.type === 'text')
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
      // broadcast to server
      // !!! Broadcast.newShape($scope.selectedShape.id, $scope.tool.name, coords, $scope.tool.colors);

    }

  }

  function mouseMove (ev) {
    //var currentShape = BoardData.getCurrentShape();
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();
    var id = BoardData.getCurrentShapeID();

    if (id) {
      var mouseXY = getMouseXY(ev);
      EventHandler.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
    }
  }

  function mouseUp (ev) {
    var currentShape = BoardData.getCurrentShape();
    
    if (currentShape && currentShape.type !== 'text') {
      // !!! boardCtrl.finishShape();
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
