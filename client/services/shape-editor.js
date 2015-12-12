angular.module('whiteboard.services.shapeeditor', [])
.factory('ShapeEditor', ['BoardData', function (BoardData) {

  var changeCircle = function (shape, x, y, initX, initY) {
    var coords = Snap.snapToPoints(x, y)
    x = coords[0];
    y = coords[1];
    var deltaX = x - initX;
    var deltaY = y - initY;
    var newRadius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    shape.attr('r', newRadius);
  };

  var changeLine = function (shape, x, y, initX, initY) {
    //"M10,20L30,40"
    var coords = Snap.snapToPoints(x, y)
    x = coords[0];
    y = coords[1];

    var linePathOrigin = "M" + String(initX) + "," + String(initY);
    var linePathEnd = "L" + String(x) + "," + String(y);
    shape.attr('path', linePathOrigin + linePathEnd);
  };

  // var pathDOM = undefined;
  // var pathAttr = '';

  // var cleanTempCachedData = function () {
  //   pathAttr = '';
  // }

  var changePath = function (shape, x, y, initX, initY) {
    //"M10,20L30,40"
    //pathDOM = pathDOM !== undefined ? pathDOM : $('path');
    //console.log('Called changePath', initX, initY);
    // var newPath = shape.attr('path').toString().concat('L' + x + ',' + y)
    // shape.attr('path', newPath);
    shape.pathDProps += shape.pathDProps !== '' ? 'L' + x + ',' + y : 'M' + initX + ',' + initY + 'L' + x + ',' + y;
    // pathAttr += pathAttr !== '' ? 'L' + x + ',' + y : 'M' + initX + ',' + initY + 'L' + x + ',' + y;
    // pathDOM.attr('d', pathAttr);
    
    shape.customSetPathD(shape.pathDProps);
    //console.log(pathAttr)

    console.log('Called changePath', initX, initY);
  };

  //var changePathThrottle = _.throttle(changePath, 50);

  var changeRectangle = function (shape, cursorX, cursorY, initX, initY) {
    var coords = Snap.snapToPoints(cursorX, cursorY);
    var left, top;
    
    if (cursorX < initX && cursorY < initY) {
      left = coords[0];
      top = coords[1];
      width = initX - left;
      height = initY - top;
    } else if (cursorX < initX) {
      left = coords[0];
      top = initY;
      width = initX - left;
      height = coords[1] - initY;
    } else if (cursorY < initY) {
      left = shape.attr('x');
      top = coords[1];
      width = coords[0] - initX;
      height = initY - top;
    } else {
      left = shape.attr('x');
      top = shape.attr('y');
      width = coords[0] - initX;
      height = coords[1] - initY;
    }
    shape.attr({
      x: left,
      y: top,
      width: width,
      height: height
    });
  }

  var changeText = function (shape, x, y, initX, initY ) {
    shape.attr({
      x: x,
      y: y
    });
  };

  var selectShapeEditor = function (id, socketID, tool, x, y) {

    var shapeHandlers = {
      'circle': changeCircle,
      'path': changePath,
      'line': changeLine,
      'rectangle': changeRectangle,
      'text': changeText
    };
    var shape = BoardData.getShapeByID(id, socketID);
    
    // !!! Previously we were passing the initial X/Y, now we are not. So we need to update all the functions to deal with that.
    shapeHandlers[tool](shape, x, y);
  };

  return {
    selectShapeEditor: selectShapeEditor
  };

}]);
