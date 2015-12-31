angular.module('whiteboard.services.shapeeditor', [])
.factory('ShapeEditor', ['BoardData', 'Snap', 'ShapeManipulation', function (BoardData, Snap, ShapeManipulation) {

  var changeCircle = function (shape, x, y) {
    // var coords = Snap.snapToPoints(x, y);
    // if (!(shape.initX === coords[0] && shape.initY === coords[1])) {
    //   x = coords[0];
    //   y = coords[1];
    // }
    var deltaX = x - shape.initX;
    var deltaY = y - shape.initY;
    var newRadius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    shape.attr('r', newRadius);
  };

  var changeLine = function (shape, x, y) {
    //"M10,20L30,40"
    var deltaX = x - shape.initX;
    var deltaY = y - shape.initY;

    if (Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2)) > 20) {
      if (Math.abs(deltaY) < 5) {
        y = shape.initY;
      } else if (Math.abs(deltaX) < 5) {
        x = shape.initX;
      }
    }

    // var coords = Snap.snapToPoints(x, y);
    // if (!(shape.initX === coords[0] && shape.initY === coords[1])) {
    //   x = coords[0];
    //   y = coords[1];
    // }

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
    // var coords = Snap.snapToPoints(x, y);
    var left, top;
    
    if (x < shape.initX && y < shape.initY) {
      left = x;
      top = y;
      width = shape.initX - left;
      height = shape.initY - top;
    } else if (x < shape.initX) {
      left = x;
      top = shape.initY;
      width = shape.initX - left;
      height = y - shape.initY;
    } else if (y < shape.initY) {
      left = shape.attr('x');
      top = y;
      width = x - shape.initX;
      height = shape.initY - top;
    } else {
      left = shape.attr('x');
      top = shape.attr('y');
      width = x - shape.initX;
      height = y - shape.initY;
    }
    
    shape.attr({
      x: left,
      y: top,
      width: width,
      height: height
    });
  }

  var changeText = function (shape, x, y, tool) {
    shape.attr({
      x: x,
      y: y,
      text: tool.text
    });
  };

  function editShape (id, socketId, tool, x, y) {
    var shapeHandlers = {
      'circle': changeCircle,
      'path': changePath,
      'line': changeLine,
      'arrow': changeLine,
      'rectangle': changeRectangle,
      'text': changeText
    };
    var shape = BoardData.getShapeById(id, socketId);
    
    if (tool.name !== 'text') {
      shape.mouseX = x;
      shape.mouseY = y;
    }
    
    // optional tool argument for text change
    shapeHandlers[tool.name](shape, x, y, tool);
  };

  function finishShape (id, socketId, tool) {
    var shape = BoardData.getShapeById(id, socketId);

    if (shape.type === 'text') {
      shape.attr({
        text: tool.text
      });
    }

    if (shape.pathDProps !== undefined) {
      var path = shape.pathDProps;
      var lastPoint = path.slice(path.lastIndexOf('L') + 1).split(',').map(Number);
      if (lastPoint[0] === shape.initX && lastPoint[1] === shape.initY) {
        shape.pathDProps = path + 'Z';
        shape.attr('fill', tool.colors.fill);
      } else {
        ShapeManipulation.pathSmoother(shape);
      }
      shape.attr('path', shape.pathDProps);
    }
    
    Snap.createSnaps(shape);
  };

  function finishCopiedPath (id, socketId, tool, pathDProps) {
    var shape = BoardData.getShapeById(id, socketId);
    shape.pathDProps = pathDProps;
    shape.attr('path', shape.pathDProps);
    if ((shape.myid || shape.myid === 0) && tool.name === 'path') {
      ShapeManipulation.pathSmoother(shape);
    }
  }

  function deleteShape (id, socketId) {
    var shape = BoardData.getShapeById(id, socketId);

    Snap.deleteSnaps(shape);
    shape.remove();
  };

  return {
    editShape: editShape,
    finishShape: finishShape,
    finishCopiedPath: finishCopiedPath,
    deleteShape: deleteShape
  };

}]);
