//NOTE: Does not work w/ app as-is, only documenting logic written in codeshare.io
var paper = Raphael(document.getElementById("paper"), 700, 400);
paper.$el = $('#paper svg');

var canvasX = paper.$el.position().left;
var canvasY = paper.$el.position().top;
var endSnaps = [];

//Environment Variables
var snapsEnabled = true;
function toggleSnap () {
  snapsEnabled = !snapsEnabled;
}

//bug-fix for chrome cursor turning to text cursor on drag
document.onselectstart = function () { return false; };

paper.$el.on('mousedown', function (e) {
  startShape(e);
});

//initialize test variables
paper.tool = {
  name: "createCircle",
  fill: "red"
};

$('#tool').on('click', function () {
  if (paper.tool.name === 'createCircle') paper.tool.name = 'createLine';
  else if (paper.tool.name === 'createLine') paper.tool.name = 'createRectangle';
  else if (paper.tool.name === 'createRectangle') paper.tool.name = 'createCircle';
  console.log('Tool selected: ', paper.tool.name);
});
$('#snaptrigger').on('click', toggleSnap);
$('#colortrigger').on('click', toggleColor);

function toggleColor () {
  if (paper.tool.fill === 'red') paper.tool.fill = 'blue';
  else if (paper.tool.fill === 'blue') paper.tool.fill = 'green';
  else if (paper.tool.fill === 'green') paper.tool.fill = 'red';
  console.log('Color selected: ', paper.tool.fill);

}

var startShape = function (e) {
  //clientX/clientY measure from element; compare with screenX/screenY
  var initX = e.clientX - canvasX;
  var initY = e.clientY - canvasY;
  var coords = snapToPoints(endSnaps, initX, initY, 15);
  initX = coords[0];
  initY = coords[1];
  var shape = newShape(initX, initY);
  
  paper.$el.on('mousemove', function (e) {
    var shapeHandlers = {
      'circle': changeCircle,
      'path': changeLine,
      'rect': changeRectangle
    };
    shapeHandlers[shape.type](shape, e.clientX - canvasX, e.clientY - canvasY, initX, initY);
    if (paper.tool.fill) {
      if (shape.type === 'path') {
        shape.attr("stroke", paper.tool.fill);
      } else {
        shape.attr("fill", paper.tool.fill);
      }
    }
  });

  paper.$el.on('mouseup', function () {
    createSnaps(shape);
    paper.$el.off('mousemove');
    paper.$el.off('mouseup');
  });
};

function createSnaps (shape) {
  if (shape.type === 'rect') {
    var x = shape.attr('x');
    var y = shape.attr('y');
    var width = shape.attr('width');
    var height = shape.attr('height');
    var cornerSnaps = [
      [x, y],
      [x + width, y],
      [x, y + height],
      [x + width, y + height]
    ];
    var cardinalSnaps = [
      [x + width / 2, y],
      [x, y + height / 2],
      [x + width, y + height / 2],
      [x + width / 2, y + height],
    ];
    cornerSnaps.forEach(function (snap) {
      endSnaps.push(snap);
    });
    cardinalSnaps.forEach(function (snap) {
      endSnaps.push(snap);
    });
  } else if (shape.type === 'path') {
    var path = shape.attr('path');
    startPoint = [path[0][1], path[0][2]];
    endPoint = [path[1][1], path[1][2]];
    midPoint = [startPoint[0] + (endPoint[0] - startPoint[0]) / 2, startPoint[1] + (endPoint[1] - startPoint[1]) / 2];
    endSnaps.push(startPoint, midPoint, endPoint);
  } else if (shape.type === 'circle') {
    var cx = shape.attr('cx');
    var cy = shape.attr('cy');
    var r = shape.attr('r');
    var centerSnap = [cx, cy];
    cardinalSnaps = [
      [cx + r, cy],
      [cx - r, cy],
      [cx, cy + r],
      [cx, cy - r]
    ];
    endSnaps.push(centerSnap);
    cardinalSnaps.forEach(function (snap) {
      endSnaps.push(snap);
    });
  }
}

function snapToPoints (points, x, y, tol) {
  if (!snapsEnabled) return [x, y];
  for (var i = 0; i < points.length; i++) {
    if (Math.abs(x - points[i][0]) <= tol && Math.abs(y - points[i][1]) <= tol) {
      return points[i];
    }
  }
  return [x, y];
}

function changeLine (shape, x, y, initX, initY) {
  //"M10,20L30,40"
  var coords = snapToPoints(endSnaps, x, y, 15);
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
}

function newShape (initX, initY) {
  // force tool to be createLine for testing
  var shapeConstructors = {
    'createCircle': function (x, y) {
      return paper.circle(x, y, 0);
    },
    'createLine': function (x, y) {
      return paper.path("M" + String(x) + "," + String(y));
    },
    'createRectangle': function (x,y) {
      return paper.rect(x, y, 0, 0);
    }
  };
  
  return shapeConstructors[paper.tool.name](initX, initY);
}
