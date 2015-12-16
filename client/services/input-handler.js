angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData','Snap', 'EventHandler', 'Broadcast', 'Visualizer', function (BoardData, Snap, EventHandler, Broadcast, Visualizer) {
  var eraserOn;
  function toggleEraser () {
    eraserOn ? eraserOn = false : eraserOn = true;
  }

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

    if (currentTool.name === 'eraser') {
      toggleEraser();
    } else if (currentTool.name === 'move') {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        BoardData.setEditorShape(shape);
      }
    } else if (currentTool.name ==='text') {
      var id = BoardData.generateShapeID();
      var mouseXY = getMouseXY(ev);
      EventHandler.createShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      var currentShape = BoardData.getCurrentShape();

      document.onkeypress = function (ev) {
        BoardData.setEditorShape(currentShape);
        var editorShape = BoardData.getEditorShape();
        if (editorShape.attr('text') === 'Insert Text') {
          editorShape.attr('text', '');
        }
        if (ev.keyCode === 8) {
          editorShape.attr('text', editorShape.attr('text').slice(0, editorShape.attr('text').length - 1));
        } else {
          editorShape.attr('text', editorShape.attr('text') + String.fromCharCode(ev.keyCode));
        }
      }

      document.onkeydown = function (ev) {
        BoardData.setEditorShape(currentShape);
        var editorShape = BoardData.getEditorShape();
        if (ev.which === 8) {
          ev.preventDefault();
          if (editorShape) {
            editorShape.attr('text', editorShape.attr('text').slice(0, editorShape.attr('text').length - 1));
          }
        }
      }

      document.onclick = function (ev) {
        editorShape = null;
        if (editorShape.attr('text') === 'Insert Text') {
          editorShape.attr('text', '');
        }
      }
    } else {
      // !!! boardCtrl.createShape(ev);
      var id = BoardData.generateShapeID();
      var mouseXY = getMouseXY(ev);

      //this snaps the initial point to any available snapping points
      var coords = Snap.snapToPoints(mouseXY.x, mouseXY.y, 15);

      // broadcast to server
      EventHandler.createShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
    }

  }

  function mouseMove (ev) {
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();
    var id = BoardData.getCurrentShapeID();
    var currentShape = BoardData.getCurrentShape();
    var mouseXY = getMouseXY(ev);

      //moving shape w/ move tool
    if (currentTool.name === 'move') {
      var currentEditorShape = BoardData.getEditorShape();
      if (currentEditorShape) {
        Visualizer.clearSelection();
        EventHandler.moveShape(currentEditorShape.id, currentEditorShape.data('socketID'), mouseXY.x, mouseXY.y)
      } else {
        Visualizer.visualizeSelection(mouseXY);
      }

      //creating shape w/ drag
    } else if (currentShape) {
      var mouseXY = getMouseXY(ev);
      Broadcast.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      EventHandler.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);

      //deleting shapes w/ eraser
    } else if (currentTool.name === 'eraser' && eraserOn) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        Broadcast.deleteShape(shape.id, shape.data('socketID'));
        EventHandler.deleteShape(shape.id, shape.data('socketID'));
      }
    }
  }

  function mouseUp (ev) {
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();
    var id = BoardData.getCurrentShapeID();
    var currentShape = BoardData.getCurrentShape();
    var editorShape = BoardData.getEditorShape();

    if (currentShape && currentShape.type !== 'text') {
      EventHandler.finishShape(id, socketID, currentTool);
      BoardData.unsetCurrentShape();
      Visualizer.clearSnaps();
    } else if (editorShape && currentTool.name !== 'eraser') {
      EventHandler.finishShape(editorShape.id, editorShape.data('socketID'), currentTool);
      BoardData.unsetEditorShape();
    } else if (currentTool.name === 'eraser') {
      toggleEraser();
    } else {
      Broadcast.finishShape(id, currentTool);
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
