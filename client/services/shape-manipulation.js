angular.module('whiteboard.services.shapemanipulation', [])
.factory('ShapeManipulation', ['BoardData', 'ShapeBuilder', 'Snap', function (BoardData, ShapeBuilder, Snap) {

  var pathSmoother = function (tool, pathElement) {
    var path = pathElement.attr('path');
    var interval = 5;
    var newPath = path.reduce(function (newPathString, currentPoint, index, path) {
      if (!(index % interval) || index === (path.length - 1)) {
        return newPathString += currentPoint[1] + ',' + currentPoint[2] + ' ';
      } else {
        return newPathString;
      }
    }, path[0][0] + path[0][1] + ',' + path[0][2] + ' ' + "R");
    pathElement.attr('path', newPath);
  };

  var grabPoint;
  var origin;
  function moveCircle (shape, x, y) {
    var deltaX = x - grabPoint.x;
    var deltaY = y - grabPoint.y;
    var circleProps = shape.attr();
    shape.attr({
      cx: origin.cx + deltaX,
      cy: origin.cy + deltaY
    });
  }

  function moveRectangle (shape, x, y) {
    console.log(shape.attr());
    var deltaX = x - grabPoint.x;
    var deltaY = y - grabPoint.y;
    shape.attr({
      x: origin.x + deltaX,
      y: origin.y + deltaY
    });
  }

  function moveShape (id, socketId, x, y) {
    var shapeHandlers = {
      'circle': moveCircle,
      // 'path': movePath,
      // 'line': moveLine,
      'rect': moveRectangle
      // 'text': moveText
    };
    var shape = BoardData.getShapeByID(id, socketId).toFront();
    if (!grabPoint) {
      grabPoint = {x: x, y: y};
      origin = shape.attr();
    }
    shapeHandlers[shape.type](shape, x, y);
  }

  function finishMovingShape (id, socketId) {
    grabPoint = null;
    origin = null;

    var shape = BoardData.getShapeById(id, socketId);
    Snap.createSnaps(shape);
  }

  return {
    pathSmoother: pathSmoother,
    moveShape: moveShape,
    finishMovingShape: finishMovingShape
  };

}]);
