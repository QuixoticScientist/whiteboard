angular.module('whiteboard.services.shapebuilder', [])
.factory('ShapeBuilder', function (Snap) {

  var setShape = function (paper, mousePosition, Broadcast) {
    //clientX/clientY measure from element; compare with screenX/screenY
    var initX = mousePosition.x - paper.canvasX;
    var initY = mousePosition.y - paper.canvasY;

    var coords = Snap.snapToPoints(initX, initY);
    initX = coords[0];
    initY = coords[1];

    return {
      initX: initX,
      initY: initY
    };
  };

  var newShape = function (type, raphael, initX, initY) {

    var shapeConstructors = {
      'circle': function (x, y) {
        return raphael.circle(x, y, 0);
      },
      'line': function (x, y) {
        return raphael.path("M" + String(x) + "," + String(y));
      },
      'path': function (x, y) {
        return raphael.path("M" + String(x) + "," + String(y));
      },
      'rectangle': function (x,y) {
        return raphael.rect(x, y, 0, 0);
      },
      'text': function (x,y) {
        return raphael.text(x, y, 'Hello, world!');
      }
    };

    return shapeConstructors[type](initX, initY);
  };

  return {
    setShape: setShape,
    newShape: newShape
  };
  
});
