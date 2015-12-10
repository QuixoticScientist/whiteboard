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

  var createUserStore = function (userId) {
    shapeStore[userId] = {};
  };

  var storeOnEditShape = function (userId, shape) {
    if (!shapeStore[userId]) {
      createUserStore(userId);
    }
    
    shapeStore[userId][shape.id] = shape;
  };

  var getOnEditShape = function (userId, shapeid) {
    return shapeStore[userId][shapeid];
  };

  var removeOnEditShape = function (userId, shapeid) {
    //delete shapeStore[userId][shapeid];
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

  var newShape = function (type, initX, initY, colors) {
    var self = this;

    var shapeConstructors = {
      'circle': function (x, y) {
        return self.raphael.circle(x, y, 0);
      },
      'line': function (x, y) {
        return self.raphael.path("M" + String(x) + "," + String(y));
      },
      'path': function (x, y) {
        var path = self.raphael.path("M" + String(x) + "," + String(y));
        path.pathDProps = '';
        return path;
      },
      'rectangle': function (x,y) {
        return self.raphael.rect(x, y, 0, 0);
      },
      'text': function (x,y) {
        return self.raphael.text(x, y, 'Insert Text');
      }
    };

    console.log(colors)
    var newShape = shapeConstructors[type](initX, initY);
    if (newShape.type === 'path') {
      newShape.attr('stroke', colors.stroke);
    } else {
      newShape.attr('stroke', colors.stroke);
      newShape.attr('fill', colors.fill);
    }

    return newShape;
  };

  return {
    setShape: setShape,
    newShape: newShape,
    storeOnEditShape: storeOnEditShape,
    getOnEditShape: getOnEditShape,
    removeOnEditShape: removeOnEditShape,
    generateShapeId: generateShapeId
  };
  
});
