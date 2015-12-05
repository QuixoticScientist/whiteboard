angular.module('whiteboard.services.draw', [])
.factory('Draw', function (Board) {

  //console.log(Draw.tool)
  var startShape = function (e) {
    //clientX/clientY measure from element; compare with screenX/screenY
    console.log('mousedown');

    var initX = e.clientX - Board.canvasX;
    var initY = e.clientY - Board.canvasY;
    var shape = newShape(initX, initY);

    Board.$el.on('mousemove', function (e) {
      var shapeHandlers = {
        'circle': changeCircle,
        'path': changeLine,
        'rect': changeRectangle
      };
      shapeHandlers[shape.type](shape, e.clientX - Board.canvasX, e.clientY - Board.canvasY, initX, initY);
      if (Board.tool.fill) {
        shape.attr("fill", Board.tool.fill);
      }
    });
  };

  var newShape = function (initX, initY) {

    var shapeConstructors = {
      'createCircle': function (x, y) {
        return Board.paper.circle(x,y,0);
      },
      'createLine': function (x, y) {
        return Board.paper.path("M" + String(x) + "," + String(y));
      },
      'createRectangle': function (x,y) {
        return Board.paper.rect(x, y, 0, 0);
      }
    };

    return shapeConstructors[Board.tool.name](initX, initY);
  };

  function changeLine (shape, x, y, initX, initY) {
    //"M10,20L30,40"
    var linePathOrigin = "M" + String(initX) + "," + String(initY);
    var linePathEnd = "L" + String(x) + "," + String(y);
    shape.attr('path', linePathOrigin + linePathEnd);
  };

  function changeCircle (shape, x, y, initX, initY) {
    var deltaX = x - initX;
    var deltaY = y - initY;
    var newRadius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    shape.attr('r', newRadius);
  };

  var changeRectangle = function (shape, cursorX, cursorY, initX, initY) {
    var width = cursorX - initX;
    var height = cursorY - initY;
    if (width < 0) {
      initX = cursorX;
      width = -width;
    }
    if (height < 0) {
      initY = cursorY;
      height = -height;
    }
    shape.attr({
      x: initX,
      y: initY,
      width: width,
      height: height
    });
  }

  return {
    startShape: startShape,
    newShape: newShape,
    changeLine: changeLine,
    changeCircle: changeCircle,
    changeRectangle: changeRectangle
  };
})
