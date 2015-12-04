//NOTE: Does not work w/ app as-is, only documenting logic written in codeshare.io
var paper = Raphael(document.getElementById("paper"), 320, 200);
paper.$el = $('#paper svg');

paper.$el.on('mousedown', function (e) {
  startShape(e);
});
paper.$el.on('mouseup', function () {
  paper.$el.off('mousemove');
});

//initialize test variables
paper.tool = "createCircle";

var startShape = function (e) {
  //clientX/clientY measure from element; compare with screenX/screenY
  var initX = e.clientX;
  var initY = e.clientY;
  var shape = newShape(initX, initY);
  
  paper.$el.on('mousemove', function (e) {
    var shapeHandlers = {
      'circle': changeCircle,
      'path': changeLine,
      'rect': changeRectangle
    };
    shapeHandlers[shape.type](shape, e.clientX, e.clientY, initX, initY);
  })
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
}

function newShape (initX, initY) {
  // force tool to be createLine for testing
  var shapeConstructors = {
    'createCircle': function (x, y) {
      return paper.circle(x,y,0);
    },
    'createLine': function (x, y) {
      return paper.path("M" + String(x) + "," + String(y));
    },
    'createRectangle': function (x,y) {
      return paper.rect(x, y, 0, 0);
    }
  };
  
  return shapeConstructors[paper.tool](initX, initY);
}
