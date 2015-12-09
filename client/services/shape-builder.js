angular.module('whiteboard.services.shapebuilder', [])
.factory('ShapeBuilder', function (Snap) {
  
  var idStore = [];
  var shapeStore = {};

  var generateShapeId = function () {
    var id = 0; 

    if (idStore.length) {
      id = idStore[idStore.length - 1] + 1;
    }

    idStore.push(id);
    return id;
  };

  var storeOnEditShape = function (shape) {
    shapeStore[shape.id] = shape;
  };

  var getOnEditShape = function (id) {
    return shapeStore[id];
  };

  var setShape = function (paper, mousePosition, Broadcast) {
    //clientX/clientY measure from element; compare with screenX/screenY
    var initX = mousePosition.x;
    var initY = mousePosition.y;

    var coords = Snap.snapToPoints(initX, initY, 5);
    initX = coords[0];
    initY = coords[1];

    return {
      initX: initX,
      initY: initY
    };
  };

  var newShape = function (type, initX, initY, color) {
    var self = this;

    var shapeConstructors = {
      'circle': function (x, y) {
        return self.raphael.circle(x, y, 0);
      },
      'line': function (x, y) {
        return self.raphael.path("M" + String(x) + "," + String(y));
      },
      'path': function (x, y) {
        return self.raphael.path("M" + String(x) + "," + String(y));
      },
      'rectangle': function (x,y) {
        return self.raphael.rect(x, y, 0, 0);
      },
      'text': function (x,y) {
        return self.raphael.text(x, y, 'Insert Text');
      }
    };

    var newShape = shapeConstructors[type](initX, initY);
    if (newShape.type === 'path') {
      newShape.attr("stroke", color);
    } else {
      newShape.attr("fill", color);
    }

    return newShape;
  };

  return {
    setShape: setShape,
    newShape: newShape,
    storeOnEditShape: storeOnEditShape,
    getOnEditShape: getOnEditShape, 
    generateShapeId: generateShapeId
  };
  
});
