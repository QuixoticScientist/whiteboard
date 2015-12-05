angular.module('whiteboard.services.draw', [])
.factory('Draw', function (Board, Snap) {

  //console.log(Draw.tool)
  var startShape = function (e) {
    //clientX/clientY measure from element; compare with screenX/screenY
    console.log('mousedown');

    var initX = e.clientX - Board.canvasX;
    var initY = e.clientY - Board.canvasY;
    var coords = Snap.snapToPoints(Snap.endSnaps, initX, initY, Snap.tolerance);
    initX = coords[0];
    initY = coords[1];
    var shape = newShape(initX, initY);
    Board.lastShape = shape;

    Board.$el.on('mousemove', function (e) {
      var shapeHandlers = {
        'circle': changeCircle,
        'path': changeLine,
        'rect': changeRectangle,
        'text': changeText
      };
      shapeHandlers[shape.type](shape, e.clientX - Board.canvasX, e.clientY - Board.canvasY, initX, initY);
      
      if (Board.tool.fill) {
        if (shape.type === 'path') {
          shape.attr("stroke", Board.tool.fill);
        } else {
          shape.attr("fill", Board.tool.fill);
        }
      }
    });
  };

  var changeText = function (shape, x, y, initX, initY) {
    shape.attr({
      x: x,
      y: y
    });
  };

  // function createSnaps (shape) {
  //   if (shape.type === 'rect') {
  //     var x = shape.attr('x');
  //     var y = shape.attr('y');
  //     var width = shape.attr('width');
  //     var height = shape.attr('height');
  //     var cornerSnaps = [
  //       [x, y],
  //       [x + width, y],
  //       [x, y + height],
  //       [x + width, y + height]
  //     ];
  //     var cardinalSnaps = [
  //       [x + width / 2, y],
  //       [x, y + height / 2],
  //       [x + width, y + height / 2],
  //       [x + width / 2, y + height],
  //     ];
  //     cornerSnaps.forEach(function (snap) {
  //       endSnaps.push(snap);
  //     });
  //     cardinalSnaps.forEach(function (snap) {
  //       endSnaps.push(snap);
  //     });
  //   } else if (shape.type === 'path') {
  //     var path = shape.attr('path');
  //     startPoint = [path[0][1], path[0][2]];
  //     endPoint = [path[1][1], path[1][2]];
  //     midPoint = [startPoint[0] + (endPoint[0] - startPoint[0]) / 2, startPoint[1] + (endPoint[1] - startPoint[1]) / 2];
  //     endSnaps.push(startPoint, midPoint, endPoint);
  //   } else if (shape.type === 'circle') {
  //     var cx = shape.attr('cx');
  //     var cy = shape.attr('cy');
  //     var r = shape.attr('r');
  //     var centerSnap = [cx, cy];
  //     cardinalSnaps = [
  //       [cx + r, cy],
  //       [cx - r, cy],
  //       [cx, cy + r],
  //       [cx, cy - r]
  //     ];
  //     endSnaps.push(centerSnap);
  //     cardinalSnaps.forEach(function (snap) {
  //       endSnaps.push(snap);
  //     });
  //   }
  // };

  // function snapToPoints (points, x, y, tol) {
  //   if (!snapsEnabled) return [x, y];
  //   for (var i = 0; i < points.length; i++) {
  //     if (Math.abs(x - points[i][0]) <= tol && Math.abs(y - points[i][1]) <= tol) {
  //       return points[i];
  //     }
  //   }
  //   return [x, y];
  // };

  var newShape = function (initX, initY) {

    var shapeConstructors = {
      'createCircle': function (x, y) {
        return Board.paper.circle(x, y, 0);
      },
      'createLine': function (x, y) {
        return Board.paper.path("M" + String(x) + "," + String(y));
      },
      'createRectangle': function (x,y) {
        return Board.paper.rect(x, y, 0, 0);
      },
      'createText': function (x,y) {
        return Board.paper.text(x, y, 'Hello, world!');
      }
    };

    return shapeConstructors[Board.tool.name](initX, initY);
  };

  function changeLine (shape, x, y, initX, initY) {
    //"M10,20L30,40"
    var coords = Snap.snapToPoints(Snap.endSnaps, x, y, Snap.tolerance);
    x = coords[0];
    y = coords[1];

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
