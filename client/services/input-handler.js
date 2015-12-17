angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData','Snap', 'EventHandler', 'Broadcast', 'Visualizer', 'Zoom', function (BoardData, Snap, EventHandler, Broadcast, Visualizer, Zoom) {
  var toggleAttrs = {};
  function toggle (attr) {
    if (!toggleAttrs[attr]) {
      toggleAttrs[attr] = true;
    } else {
      toggleAttrs[attr] = false;
    }
  }
  function isToggled (attr) {
    return toggleAttrs[attr];
  }

  var actions = {};

  actions.eraser = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        Broadcast.deleteShape(shape.id, shape.data('socketID'));
        EventHandler.deleteShape(shape.id, shape.data('socketID'));
      }
    },
    mouseUp: function (ev) {
    }
  };

  actions.pan = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
      Zoom.pan(ev);
    },
    mouseUp: function (ev) {
      Zoom.resetPan();
    }
  };

  actions.move = {
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
      console.log(editorShape);

      EventHandler.finishShape(editorShape.id, editorShape.data('socketID'), currentTool);
      BoardData.unsetEditorShape();
    }
  };

  actions.text = {
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

  actions.shape = {
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

  actions.noTool = {
    mouseDown: function (ev) {

    },
    mouseHold: function (ev) {
      var mouseXY = getMouseXY(ev);
      Snap.snapToPoints(mouseXY.x, mouseXY.y);
    },
    mouseUp: function (ev) {

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

  var shapeTools = ['line','circle','path','rectangle'];
  function isToolShape (toolName) {
    for (var i = 0; i < shapeTools.length; i++) {
      if (toolName === shapeTools[i]) {
        return true;
      }
    }
  }

  function mouseDown (ev) {
    var toolName = BoardData.getCurrentTool().name;
    if (isToolShape(toolName)) {
      toolName = 'shape';
    }

    if (toolName) {
      toggle(toolName);
    } else {
      tool = 'noName';
    }
    actions[toolName].mouseDown(ev);
  }

  function mouseMove (ev) {
    for (var key in actions) {
      if (isToggled(key)) {
        actions[key].mouseHold(ev);
        return;
      }
    }
    actions.noTool.mouseHold(ev);
  }

  function mouseUp (ev) {
    for (var key in actions) {
      if (isToggled(key)) {
        toggle(key);
        actions[key].mouseUp(ev);
        return;
      }
    }
    actions.noTool.mouseUp(ev);
  }

  function doubleClick (ev) {
    //just in case
  }

  return {
    mousedown: mouseDown,
    mousemove: mouseMove,
    mouseup: mouseUp,
    dblclick: doubleClick
  };
}]);
