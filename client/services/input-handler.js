angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData','Snap', 'EventHandler', 'Broadcast', function (BoardData, Snap, EventHandler, Broadcast) {
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
      // edit text
        // on hit of backspace, allow backspace
        // on hit of other keyboard buttons, edit text
        // on click again, put shape down
      var id = BoardData.generateShapeID();
      var mouseXY = getMouseXY(ev);
      EventHandler.createShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      document.onkeypress = function (ev) {
        console.log('key press')
        var currentShape = BoardData.getCurrentShape();
        if (currentShape.attr('text') === 'Insert Text') {
          currentShape.attr('text', '');
        }
        if (ev.keyCode === 8) {
          currentShape.attr('text', currentShape.attr('text').slice(0, currentShape.attr('text').length - 1));
        } else {
          currentShape.attr('text', currentShape.attr('text') + String.fromCharCode(ev.keyCode));
        }
      }
      document.onkeydown = function (ev) {
        if (ev.which === 8) {
          ev.preventDefault();
          var currentShape = BoardData.getCurrentShape();
          if (currentShape) {
            currentShape.attr('text', currentShape.attr('text').slice(0, currentShape.attr('text').length - 1));
          }
        }
      }
      document.onclick = function (ev) {
        if (currentShape.attr('text') === 'Insert Text') {
          currentShape.attr('text', '');
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

  // var currentSelections = {};
  // var bboxes;
  // function visualizeSelections (ev) {
  //   var mouseXY = getMouseXY(ev);
  //   var board = BoardData.getBoard();
  //   if (!bboxes) {
  //     bboxes = BoardData.getBoard().set();
  //   }

  //   var selections = board.getElementsByPoint(ev.clientX, ev.clientY);
  //   selections.forEach(function (selection) {
  //     if (selection.data('bbox')) return;
  //     var socketID = selection.data('socketID');
  //     var id = selection.id;
  //     if (!(selection in bboxes)) {
  //       var box = selection.getBBox();
  //       var newBBox = board.rect(box.x, box.y, box.width, box.height).data('bbox', true);
  //       bboxes.push(newBBox);
  //     }
  //   });
  // }

  var selectionBox; 
  function visualizeSelection (ev) {
    var mouseXY = getMouseXY(ev);
    var board = BoardData.getBoard();
    var selection = board.getElementByPoint(ev.clientX, ev.clientY);

    if (selection) {
      var box = selection.getBBox();
      selectionBox = board.rect(box.x, box.y, box.width, box.height).attr({'stroke':'blue','stroke-width':'3', 'stroke-dasharray':'-'}).toBack();
    }
  }

  function mouseMove (ev) {
    var currentTool = BoardData.getCurrentTool();
    var socketID = BoardData.getSocketID();
    var id = BoardData.getCurrentShapeID();
    var currentShape = BoardData.getCurrentShape();

    if (currentTool.name === 'move') {
      var currentEditorShape = BoardData.getEditorShape();
      // if (bboxes) {
      //   bboxes.remove();
      // }
      // visualizeSelections(ev);
      if (selectionBox) {
        selectionBox.remove();
      }
      if (!currentEditorShape) {
        visualizeSelection(ev);
      } else {
        var mouseXY = getMouseXY(ev);
        EventHandler.moveShape(currentEditorShape.id, currentEditorShape.data('socketID'), mouseXY.x, mouseXY.y)
      }
    } else if (currentShape) {
      var mouseXY = getMouseXY(ev);
      Broadcast.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      EventHandler.editShape(id, socketID, currentTool, mouseXY.x, mouseXY.y);
      //BROADCAST
    } else if (currentTool.name === 'eraser' && eraserOn) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
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
      //BROADCAST
    } else if (editorShape) {
      EventHandler.finishShape(editorShape.id, editorShape.data('socketID'), currentTool);
      BoardData.unsetEditorShape();
    } else if (currentTool.name === 'eraser') {
      toggleEraser();
    }
    Broadcast.finishShape(id, currentTool);
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
