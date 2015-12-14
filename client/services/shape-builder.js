angular.module('whiteboard.services.shapebuilder', [])
.factory('ShapeBuilder', ['BoardData', function (BoardData) {

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
        return BoardData.getBoard().circle(x, y, 0);
      },
      'line': function (x, y) {
        return BoardData.getBoard().path("M" + String(x) + "," + String(y));
      },
      'path': function (x, y) {
        var path = BoardData.getBoard().path("M" + String(x) + "," + String(y));
        // Do we wanna change this?
        path.pathDProps = '';
        return path;
      },
      'rectangle': function (x,y) {
        return BoardData.getBoard().rect(x, y, 0, 0);
      },
      'text': function (x,y) {
        return BoardData.getBoard().text(x, y, 'Insert Text');
      }
    };
    var shape = shapeConstructors[tool.name](x, y);
    shape.initX = x;
    shape.initY = y;
    setColor(shape, tool.colors);
    BoardData.pushToStorage(id, socketID, shape);
  };

  return {
    newShape: newShape
  };
  
}]);
