angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData', 'Snap', 'EventHandler', 'Broadcast', 'Visualizer', 'Zoom', function (BoardData, Snap, EventHandler, Broadcast, Visualizer, Zoom) {
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

  function getClosestElementByArea (ev) {
    var paper = BoardData.getBoard();
    var width = height = 5;
    var bbox = {
      x: ev.clientX - width / 2,
      y: ev.clientY - height / 2,
      x2: ev.clientX + width / 2,
      y2: ev.clientY + height / 2,
      width: width,
      height: height
    };
    var bboxCenter = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};
    // var set = this.set();
    var closest = null;
    var closestDist;
    paper.forEach(function (el) {
      var elBBox = el.getBBox();
      if (!(el.type === 'set') && Raphael.isBBoxIntersect(elBBox, bbox)) {
        var elBBoxCenter = {x: elBBox.x + elBBox.width / 2, y: elBBox.y + elBBox.height / 2};
        var dist = Math.sqrt(Math.pow(elBBoxCenter.x - bboxCenter.x, 2) + Math.pow(elBBoxCenter.y - bboxCenter.y, 2));
        if (!closestDist || dist < closestDist) {
          closest = el;
          closestDist = dist;
        }
      }
    });
    return closest;
  };

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
      var mouseXY = getMouseXY(ev);

      Visualizer.clearSelection();
      var target = getClosestElementByArea(ev);

      if (target) {
        BoardData.setEditorShape(target);
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
      Visualizer.clearSelection();
      var selection = getClosestElementByArea(ev);
      Visualizer.visualizeSelection(selection);
    }
  };

  actions.copy = {
    mouseDown: function (ev) {
      //
    },
    mouseHold: function (ev) {
      //
    },
    mouseUp: function (ev) {
      //
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
      
      console.log(BoardData.getShapeStorage());
    },
    mouseHold: function (ev) {
      var id = BoardData.getCurrentShapeId();
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);
      var coords = Snap.snapToPoints(mouseXY.x, mouseXY.y);

      Broadcast.editShape(id, socketId, currentTool, coords[0], coords[1]);
      EventHandler.editShape(id, socketId, currentTool, coords[0], coords[1]);
    },
    mouseUp: function (ev) {
      var id = BoardData.getCurrentShapeId();
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var shape = BoardData.getCurrentShape();

      var currentToolCopy = {};
      currentToolCopy.name = currentTool.name;
      currentToolCopy['stroke-width'] = currentTool['stroke-width'];
      currentToolCopy.colors = {};
      currentToolCopy.colors.fill = currentTool.colors.fill;
      currentToolCopy.colors.stroke = currentTool.colors.stroke;

      shape.tool = currentToolCopy;

      EventHandler.finishShape(id, socketId, currentToolCopy);
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
