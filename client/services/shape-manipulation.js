angular.module('whiteboard.services.shapemanipulation', [])
.factory('ShapeManipulation', ['BoardData', 'ShapeBuilder', function (BoardData, ShapeBuilder) {

  var pathSmoother = function (tool, pathElement) {
    if (tool.name === 'path') {
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
    }
  };

  function moveCircle (shape, x, y) {
    shape.attr({
      cx: x,
      cy: y
    });
  }

  function moveRectangle (shape, cursorX, cursorY) {
    shape.attr({
      x: cursorX - shape.attr('width') / 2,
      y: cursorY - shape.attr('height') / 2
    });
  }

  function moveShape (id, socketID, x, y) {
    var shapeHandlers = {
      'circle': moveCircle,
      // 'path': movePath,
      // 'line': moveLine,
      'rect': moveRectangle
      // 'text': moveText
    };
    var shape = BoardData.getShapeByID(id, socketID);
    shapeHandlers[shape.type](shape, x, y);
  }

  return {
    pathSmoother: pathSmoother,
    moveShape: moveShape
  };

}]);
