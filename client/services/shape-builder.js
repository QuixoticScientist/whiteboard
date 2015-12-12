angular.module('whiteboard.services.shapebuilder', [])
.factory('ShapeBuilder', ['BoardData', function (BoardData) {
  // var storeOnEditShape = function (userId, shape) {
  //   if (!shapeStore[userId]) {
  //     createUserStore(userId);
  //   }
    
  //   shapeStore[userId][shape.id] = shape;
  // };

  // var getOnEditShape = function (userId, shapeid) {
  //   return shapeStore[userId][shapeid];
  // };

  // var removeOnEditShape = function (userId, shapeid) {
  //   //delete shapeStore[userId][shapeid];
  // };
  function setColor (shape, colors) {
    if (shape.type === 'path') {
      shape.attr('stroke', colors.stroke);
    } else {
      shape.attr('stroke', colors.stroke);
      shape.attr('fill', colors.fill);
    }
  }

  function newShape (id, socketID, tool, x, y) {
    //old args: type, initX, initY, colors
    var shapeConstructors = {
      'circle': function (x, y) {
        return BoardData.board.circle(x, y, 0);
      },
      'line': function (x, y) {
        return BoardData.board.path("M" + String(x) + "," + String(y));
      },
      'path': function (x, y) {
        var path = BoardData.board.path("M" + String(x) + "," + String(y));
        // Do we wanna change this?
        path.pathDProps = '';
        return path;
      },
      'rectangle': function (x,y) {
        return BoardData.board.rect(x, y, 0, 0);
      },
      'text': function (x,y) {
        return BoardData.board.text(x, y, 'Insert Text');
      }
    };
    var shape = shapeConstructors[tool.name](x, y);
    setColor(shape, tool.colors);
    BoardData.pushToStorage(id, socketID, shape);
  };

  return {
    newShape: newShape
  };
  
}]);
