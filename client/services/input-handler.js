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
        Broadcast.deleteShape(shape.myid, shape.socketId);
        EventHandler.deleteShape(shape.myid, shape.socketId);
      }
    },
    mouseUp: function (ev) {
    },
    mouseOver: function (ev) {
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
    },
    mouseOver: function (ev) {
    }
  };

  actions.move = {
    mouseDown: function (ev) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        BoardData.setEditorShape(shape);
      } else {
        toggle('move');
      }
    },
    mouseHold: function (ev) {
      var currentEditorShape = BoardData.getEditorShape();
      var mouseXY = getMouseXY(ev);

      Visualizer.clearSelection();
      Broadcast.moveShape(currentEditorShape, mouseXY.x, mouseXY.y);
      EventHandler.moveShape(currentEditorShape, mouseXY.x, mouseXY.y);
    },
    mouseUp: function (ev) {
      var editorShape = BoardData.getEditorShape();
      var currentTool = BoardData.getCurrentTool();

      Broadcast.finishMovingShape(editorShape);
      EventHandler.finishMovingShape(editorShape.myid, editorShape.socketId);
      BoardData.unsetEditorShape();
    },
    mouseOver: function (ev) {
      Visualizer.visualizeSelection(ev);
    }
  };

  actions.text = {
    mouseDown: function (ev) {
      var id = BoardData.generateShapeID();
      var mouseXY = getMouseXY(ev);
      var socketId = BoardData.getSocketID();
      var currentTool = BoardData.getCurrentTool();
      currentTool.text = 'Insert Text';

      EventHandler.createShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
      var currentShape = BoardData.getCurrentShape();

      document.onkeypress = function (ev) {
        BoardData.setEditorShape(currentShape);
        var editorShape = BoardData.getEditorShape();
        if (editorShape.attr('text') === 'Insert Text') {
          editorShape.attr('text', '');
          currentTool.text = '';
        }
        
        if (ev.keyCode === 13) {
          // enter key
          Broadcast.finishShape(id, currentTool);
          editorShape = null;
        } else {
          // typing text
          editorShape.attr('text', editorShape.attr('text') + String.fromCharCode(ev.keyCode));
          currentTool.text = editorShape.attr('text');
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

    },
    mouseHold: function (ev) {
    },
    mouseUp: function (ev) {
    },
    mouseOver: function (ev) {
    }
  };

  actions.shape = {
    mouseDown: function (ev) {
      var id = BoardData.generateShapeID();
      var socketId = BoardData.getSocketID();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);
      var coords = Snap.snapToPoints(mouseXY.x, mouseXY.y);

      EventHandler.createShape(id, socketId, currentTool, coords[0], coords[1]);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketId, currentTool, coords[0], coords[1]);
    },
    mouseHold: function (ev) {
      var id = BoardData.getCurrentShapeID();
      var socketId = BoardData.getSocketID();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);

      Broadcast.editShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
      EventHandler.editShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
    },
    mouseUp: function (ev) {
      var id = BoardData.getCurrentShapeID();
      var socketId = BoardData.getSocketID();
      var currentTool = BoardData.getCurrentTool();
      var shape = BoardData.getCurrentShape();
      shape.tool = currentTool;
      EventHandler.finishShape(shape);
      BoardData.unsetCurrentShape();
      Visualizer.clearSnaps();

      if (currentTool.name === 'path') {
        Broadcast.finishPath(id, currentTool, shape.pathDProps);
      } else {
        Broadcast.finishShape(id, currentTool);
      }
    },
    mouseOver: function (ev) {
      var mouseXY = getMouseXY(ev);
      Snap.snapToPoints(mouseXY.x, mouseXY.y);
    }
  };

  actions.noTool = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
    },
    mouseUp: function (ev) {
    },
    mouseOver: function (ev) {
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
  function parseToolName (toolName) {
    for (var i = 0; i < shapeTools.length; i++) {
      if (toolName === shapeTools[i]) {
        toolName = 'shape';
      }
    }
    if (!toolName) {
      toolName = 'noName';
    }
    return toolName;
  }

  function mouseDown (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name)

    toggle(toolName);
    actions[toolName].mouseDown(ev);
  }

  function mouseMove (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name)

    if (isToggled(toolName)) {
      actions[toolName].mouseHold(ev);
    } else {
      actions[toolName].mouseOver(ev);
    }
  }

  function mouseUp (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name)

    if (isToggled(toolName)) {
      toggle(toolName);
      actions[toolName].mouseUp(ev);
    }
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
