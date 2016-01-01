angular.module('whiteboard.services.shapebuilder', [])
.factory('ShapeBuilder', ['BoardData', 'Snap', function (BoardData, Snap) {

  function setColor (shape, colors) {
    if (shape.type === 'path') {
      shape.attr('stroke', colors.stroke);
    } else if (shape.type === 'text' && shape.attr('text') === 'Start Typing...') {
      shape.attr('stroke', '#b3b3b3');
      shape.attr('fill', '#b3b3b3');
      shape.trueColors = {
        stroke: colors.stroke,
        fill: colors.fill
      };
    } else {
      shape.attr('stroke', colors.stroke);
      shape.attr('fill', colors.fill);
    }
  }

  function setWidth (shape, width) {
    shape.attr('stroke-width', width);
  }

  function drawExistingPath (shape) {
    newShape(shape.myid, shape.socketId, shape.tool, shape.initX, shape.initY);
    var existingPath = BoardData.getShapeById(shape.myid, shape.socketId);
    existingPath.customSetPathD(shape.pathDProps);
    existingPath.pathDProps = shape.pathDProps;
    BoardData.pushToStorage(shape.myid, shape.socketId, existingPath);
  }

  function newShape (id, socketId, tool, x, y) {
    var shapeConstructors = {
      'circle': function (x, y) {
        return BoardData.getBoard().circle(x, y, 0);
      },
      'line': function (x, y) {
        return BoardData.getBoard().path("M" + String(x) + "," + String(y))
          .attr({
            'stroke-linecap': 'round'
          });
      },
      'path': function (x, y) {
        var path = BoardData.getBoard().path("M" + String(x) + "," + String(y))
          .attr({
            'stroke-linecap': 'round'
          });
        path.pathDProps = '';
        return path;
      },
      'rectangle': function (x,y) {
        return BoardData.getBoard().rect(x, y, 0, 0);
      },
      'text': function (x, y, text) {
        return BoardData.getBoard().text(x, y, text)
          .attr({
            'font-size': 18,
            'font-family': "San Francisco"
          });
      },
      'arrow': function (x, y) {
        var arrow = BoardData.getBoard().path("M" + String(x) + ',' + String(y));
        arrow.attr('arrow-end', 'classic-wide-long');
        return arrow;
      }
    };
    var shape = !!tool.text ? shapeConstructors[tool.name](x, y, tool.text) : shapeConstructors[tool.name](x, y);
    shape.initX = x;
    shape.initY = y;
    shape.tool = tool;
    setColor(shape, tool.colors);
    shape.myid = id;
    shape.socketId = socketId;
    if (tool.name === 'path') Snap.createSnaps(shape);
    if (tool.name !== 'arrow' && tool.name !== 'text') setWidth(shape, tool['stroke-width']);
    BoardData.pushToStorage(id, socketId, shape);
  };

  return {
    newShape: newShape,
    drawExistingPath: drawExistingPath
  };
  
}]);
