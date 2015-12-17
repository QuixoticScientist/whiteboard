angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData','Snap', 'EventHandler', 'Broadcast', 'Visualizer', 'Zoom', function (BoardData, Snap, EventHandler, Broadcast, Visualizer, Zoom) {
  var eraserOn;
  var panOn;
  function toggleEraser () {
    eraserOn ? eraserOn = false : eraserOn = true;
  }
  function togglePan () {
    panOn ? panOn = false : panOn = true;
  }

  var eraser = {
    mouseDown: function (ev) {
      toggleEraser();
    },
    mouseHold: function (ev) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        Broadcast.deleteShape(shape.id, shape.data('socketID'));
        EventHandler.deleteShape(shape.id, shape.data('socketID'));
      }
    },
    mouseUp: function (ev) {
      toggleEraser();
    }
  };

  var pan = {
    mouseDown: function (ev) {
      togglePan();
    },
    mouseHold: function (ev) {
      Zoom.pan(ev);
    },
    mouseUp: function (ev) {
      togglePan();
      Zoom.resetPan();
    }
  };

  var move = {
    mouseDown: function (ev) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        BoardData.setEditorShape(shape);
      }
    },
    mouseHold: function (ev) {
      var currentEditorShape = BoardData.getEditorShape();
      var mouseXY = getMouseXY(ev);

      if (currentEditorShape) {
        Visualizer.clearSelection();
        Broadcast.moveShape(currentEditorShape.id, currentEditorShape.data('socketID'), mouseXY.x, mouseXY.y);
        EventHandler.moveShape(currentEditorShape.id, currentEditorShape.data('socketID'), mouseXY.x, mouseXY.y);
      } else {
        Visualizer.visualizeSelection(mouseXY);
      }
    },
    mouseUp: function (ev) {
      var editorShape = BoardData.getEditorShape();
      var currentTool = BoardData.getCurrentTool();

      EventHandler.finishShape(editorShape.id, editorShape.data('socketID'), currentTool);
      BoardData.unsetEditorShape();
    }
  };

  var text = {
    mouseDown: function (ev) {
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
    },
    mouseHold: function (ev) {
    },
    mouseUp: function (ev) {
    }
  };

  var shape = {
    mouseDown: function (ev) {
      var id = BoardData.generateShapeID();
      var socketID = BoardData.getSocketID();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);
      var coords = Snap.snapToPoints(mouseXY.x, mouseXY.y);

      EventHandler.createShape(id, socketID, currentTool, coords[0], coords[1]);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketID, currentTool, coords[0], coords[1]);
    },
    mouseHold: function (ev) {
      var id = BoardData.getCurrentShapeID();
      var socketID = BoardData.getSocketID();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);

      Broadcast.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      EventHandler.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
    },
    mouseUp: function (ev) {
      var id = BoardData.getCurrentShapeID();
      var socketID = BoardData.getSocketID();
      var currentTool = BoardData.getCurrentTool();

      EventHandler.finishShape(id, socketID, currentTool);
      BoardData.unsetCurrentShape();
      Visualizer.clearSnaps();
      Broadcast.finishShape(id, currentTool);
    }
  };

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
      eraser.mouseDown(ev);
    } else if (currentTool.name === 'pan') {
      pan.mouseDown(ev);
    } else if (currentTool.name === 'move') {
      move.mouseDown(ev);
    } else if (currentTool.name ==='text') {
      text.mouseDown(ev);
    } else {
      shape.mouseDown(ev);
    }

  }

  function mouseMove (ev) {
    var currentTool = BoardData.getCurrentTool();
    var currentShape = BoardData.getCurrentShape();
    var editorShape = BoardData.getEditorShape();
    var mouseXY = getMouseXY(ev);

    if (currentTool.name === 'move') {
      move.mouseHold(ev);
    } else if (currentTool.name === 'pan' && panOn) {
      pan.mouseHold(ev);
      //creating shape w/ drag
    } else if (currentShape) {
      shape.mouseHold(ev);
      //deleting shapes w/ eraser
    } else if (currentTool.name === 'eraser' && eraserOn) {
      eraser.mouseHold(ev);
    } else {
      Snap.snapToPoints(mouseXY.x, mouseXY.y);
    }
  }

  function mouseUp (ev) {
    var currentTool = BoardData.getCurrentTool();
    var currentShape = BoardData.getCurrentShape();
    var editorShape = BoardData.getEditorShape();
    var mouseXY = getMouseXY(ev);

    if (currentShape && currentShape.type !== 'text') {
      shape.mouseUp(ev);
    } else if (editorShape && currentTool.name !== 'eraser') {
      move.mouseUp(ev);
    } else if (currentTool.name === 'eraser') {
      eraser.mouseUp(ev);
    } else if (currentTool.name === 'pan') {
      pan.mouseUp(ev);
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
