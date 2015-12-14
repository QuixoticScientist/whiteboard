angular.module('whiteboard.services.shapemanipulation', [])
.factory('ShapeManipulation', function (ShapeBuilder) {

  var pathSmoother = function (tool, pathElement) {
    if (tool === 'path') {
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

  return {
    pathSmoother: pathSmoother
  };

});
