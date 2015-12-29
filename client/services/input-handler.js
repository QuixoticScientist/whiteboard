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
        console.log('Shape found!')
        BoardData.setEditorShape(shape);
      } else {
        toggle('move');
      }
    },
    mouseHold: function (ev) {
      var currentEditorShape = BoardData.getEditorShape();
      var mouseXY = getMouseXY(ev);

      Visualizer.clearSelection();
      EventHandler.moveShape(currentEditorShape, mouseXY.x, mouseXY.y);
      Broadcast.moveShape(currentEditorShape, mouseXY.x, mouseXY.y);
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
      var id = BoardData.generateShapeId();
      var mouseXY = getMouseXY(ev);
      var socketId = BoardData.getSocketId();
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
          // enter key to complete text insertion process
          editorShape.tool = currentTool;
          Broadcast.finishShape(id, currentTool);
          EventHandler.finishShape(id, socketId, currentTool);
          editorShape = null;
        } else {
          // typing text
          editorShape.attr('text', editorShape.attr('text') + String.fromCharCode(ev.keyCode));
          currentTool.text = editorShape.attr('text');
          Broadcast.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
          EventHandler.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
        }
      }

      document.onkeydown = function (ev) {
        BoardData.setEditorShape(currentShape);
        var editorShape = BoardData.getEditorShape();
        if (ev.which === 8) {
          ev.preventDefault();
          if (editorShape) {
            editorShape.attr('text', editorShape.attr('text').slice(0, editorShape.attr('text').length - 1));
            currentTool.text = editorShape.attr('text');
            Broadcast.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
            EventHandler.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
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
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);
      var coords = Snap.snapToPoints(mouseXY.x, mouseXY.y);
      var id = BoardData.generateShapeId();

      EventHandler.createShape(id, socketId, currentTool, coords[0], coords[1]);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketId, currentTool, coords[0], coords[1]);
    },
    mouseHold: function (ev) {
      var id = BoardData.getCurrentShapeId();
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);

      Broadcast.editShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
      EventHandler.editShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
    },
    mouseUp: function (ev) {
      var id = BoardData.getCurrentShapeId();
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var shape = BoardData.getCurrentShape();
      shape.tool = currentTool;

      EventHandler.finishShape(id, socketId, currentTool);
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

  actions.magnify = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
      var mouseXY = getMouseXY(ev);

      Zoom.zoom(ev, mouseXY);
    },
    mouseUp: function (ev) {
      Zoom.resetZoom();
    },
    mouseOver: function (ev) {
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

  var shapeTools = ['line','circle','path','rectangle','arrow'];
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
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    toggle(toolName);
    actions[toolName].mouseDown(ev);
  }

  function mouseMove (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    if (isToggled(toolName)) {
      actions[toolName].mouseHold(ev);
    } else {
      actions[toolName].mouseOver(ev);
    }
  }

  function mouseUp (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    if (isToggled(toolName)) {
      toggle(toolName);
      actions[toolName].mouseUp(ev);
    }
  }

  function doubleClick (ev) {
    //just in case
  }

  function keyPress (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    if (toolName !== 'text') {
      // keycode value for lowercase m
      if (ev.keyCode === 109) {
        console.log('m has been typed');
      }
    }
  }

  return {
    mousedown: mouseDown,
    mousemove: mouseMove,
    mouseup: mouseUp,
    dblclick: doubleClick,
    keypress: keyPress
  };
}]);
