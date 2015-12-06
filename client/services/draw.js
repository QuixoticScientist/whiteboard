angular.module('whiteboard.services.draw', [])
.factory('Draw', function (Board, Snap) {
  var shapeHandlers = {
    'circle': changeCircle,
    'path': changeLine,
    'rect': changeRectangle,
    'text': changeText
  };

  var throttleEnabled = true;
  var throttleDelay = 100;
  var incrementer = 0;

  //unique id, fetched from server
  var clientID = 'TESTUSER';
  var drawnShapes = {};

  if (throttleEnabled) {
    shapeHandlers = _.mapObject(shapeHandlers, function (fn) {
      return _.throttle(fn, throttleDelay);
    });
  }

  //console.log(Draw.tool)
  var drawShape = function (e) {
    var initX = e.clientX - Board.canvasX;
    var initY = e.clientY - Board.canvasY;
    var coords = Snap.snapToPoints(Snap.endSnaps, initX, initY, Snap.tolerance);
    initX = coords[0];
    initY = coords[1];
    var id = clientID + ':' + incrementer++;
    Board.lastShapeId = id;
    createShape(Board.tool.name, initX, initY, id);
  };

  var newShape = function (tool, initX, initY) {
    var shapeConstructors = {
      'createCircle': function (x, y) {return Board.paper.circle(x, y, 0);},
      'createLine': function (x, y) {return Board.paper.path("M" + String(x) + "," + String(y));},
      'createRectangle': function (x,y) {return Board.paper.rect(x, y, 0, 0);},
      'createText': function (x,y) {return Board.paper.text(x, y, 'Hello, world!');}
    };
    return shapeConstructors[tool](initX, initY);
  };

  var createShape = function (tool, initX, initY, uniqueId) {
    //clientX/clientY measure from element; compare with screenX/screenY
    var shape = newShape(tool, initX, initY);
    drawnShapes[uniqueId] = shape;
    shape.uniqueId = uniqueId;
    shape.initX = initX;
    shape.initY = initY;

    Board.$el.on('mousemove', function (e) {
      mouseMove(uniqueId, e.clientX, e.clientY, initX, initY);
    });
  };

  function mouseMove (shapeId, x, y, initX, initY) {
    var shape = drawnShapes[shapeId];
    shapeHandlers[shape.type](shape, x - Board.canvasX, y - Board.canvasY, initX, initY);
      
    if (Board.tool.fill) {
      if (shape.type === 'path') {
        shape.attr("stroke", Board.tool.fill);
      } else {
        shape.attr("fill", Board.tool.fill);
      }
      shape.attr("stroke-width", 5);
    }
  }

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

  function changeRectangle (shape, cursorX, cursorY, initX, initY) {
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
  };

  function changeText (shape, x, y, initX, initY) {
    shape.attr({
      x: x,
      y: y
    });
  };

  return {
    drawShape: drawShape,
    createShape: createShape,
    newShape: newShape,
    changeLine: changeLine,
    changeCircle: changeCircle,
    changeRectangle: changeRectangle,
    changeText: changeText
  };
})
