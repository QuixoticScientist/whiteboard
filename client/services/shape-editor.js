angular.module('whiteboard.services.shapeeditor', [])
.factory('ShapeEditor', ['BoardData', 'Snap', 'ShapeManipulation', function (BoardData, Snap, ShapeManipulation) {

  var changeCircle = function (shape, x, y) {
    var coords = Snap.snapToPoints(x, y)
    x = coords[0];
    y = coords[1];
    var deltaX = x - shape.initX;
    var deltaY = y - shape.initY;
    var newRadius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    shape.attr('r', newRadius);
  };

  var changeLine = function (shape, x, y) {
    //"M10,20L30,40"
    var deltaX = x - shape.initX;
    var deltaY = y - shape.initY;

    if (Math.abs(deltaY / deltaX) < 0.05) {
      y = shape.initY;
    } else if (Math.abs(deltaX / deltaY) < 0.05) {
      x = shape.initX;
    }
    
    var coords = Snap.snapToPoints(x, y)
    x = coords[0];
    y = coords[1];

    var linePathOrigin = "M" + String(shape.initX) + "," + String(shape.initY);
    var linePathEnd = "L" + String(x) + "," + String(y);
    shape.attr('path', linePathOrigin + linePathEnd);
  };

  var changePath = function (shape, x, y) {
    //"M10,20L30,40"
    shape.pathDProps += shape.pathDProps === '' ? 'M' + shape.initX + ',' + shape.initY + 'L' + x + ',' + y : 'L' + x + ',' + y;
    //this custom function is in raphael
    shape.customSetPathD(shape.pathDProps);
  };

  var changeRectangle = function (shape, x, y) {
    var coords = Snap.snapToPoints(x, y);
    var left, top;
    
    if (x < shape.initX && y < shape.initY) {
      left = coords[0];
      top = coords[1];
      width = shape.initX - left;
      height = shape.initY - top;
    } else if (x < shape.initX) {
      left = coords[0];
      top = shape.initY;
      width = shape.initX - left;
      height = coords[1] - shape.initY;
    } else if (y < shape.initY) {
      left = shape.attr('x');
      top = coords[1];
      width = coords[0] - shape.initX;
      height = shape.initY - top;
    } else {
      left = shape.attr('x');
      top = shape.attr('y');
      width = coords[0] - shape.initX;
      height = coords[1] - shape.initY;
    }
    
    shape.attr({
      x: left,
      y: top,
      width: width,
      height: height
    });
  }

  var changeText = function (shape, x, y) {
    shape.attr({
      x: x,
      y: y
    });
  };

  function editShape (id, socketID, tool, x, y) {
    var shapeHandlers = {
      'circle': changeCircle,
      'path': changePath,
      'line': changeLine,
      'rectangle': changeRectangle,
      'text': changeText
    };
    var shape = BoardData.getShapeByID(id, socketID);
    shapeHandlers[tool.name](shape, x, y);
  };

  function finishShape (id, socketID, tool) {
    var shape = BoardData.getShapeByID(id, socketID);

    Snap.createSnaps(shape);
    shape.socketId = socketID;
    if (shape.id && tool.name === 'path') ShapeManipulation.pathSmoother(tool, shape);
  };

  function deleteShape (id, socketID) {
    var shape = BoardData.getShapeByID(id, socketID);

    Snap.deleteSnaps(shape);
    shape.remove();
  }

  return {
    editShape: editShape,
    finishShape: finishShape,
    deleteShape: deleteShape
  };

}]);
