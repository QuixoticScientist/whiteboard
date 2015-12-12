angular.module('whiteboard.services.boarddata', [])
.factory('BoardData', function () {
  //svgWidth/Height are the width and height of the DOM element
  var svgWidth = 400; //sizeX
  var svgHeight = 400; //sizeY
  //offsetX/Y measure the top-left point of the viewbox
  var offsetX = 0;
  var offsetY = 0;
  //scalingFactor is the level of zooming relative to the start
  var scalingFactor = 1;

  var board;
  var $canvas;
  //canvasMarginX/Y are the left and top margin of the SVG in the browser
  var canvasMarginX; //canvasX
  var canvasMarginY; //canvasY
  //viewBoxWidth/Height are needed for zooming
  var viewBoxWidth;
  var viewBoxHeight;

  var shapeStorage = {};

  var tool = {
    name: 'path',
    colors: {
      fill: 'transparent',
      stroke: '#000000'
    }
  };

  function createBoard (element) {
    board = Raphael(element, svgWidth, svgHeight);
    $canvas = element.find('svg');
    canvasMarginX = $canvas.position().left;
    canvasMarginY = $canvas.position().top;
    viewBoxWidth = svgWidth;
    viewBoxHeight = svgHeight;
  }

  function pushToStorage (id, socketID, shape) {
    shapeStorage[socketID][id] = shape;
  }

  function getShapeByID (id, socketID) {
    return shapeStorage[socketID][id];
  }

  function getCurrentShape () {
    // !!! return shapeStorage.thisUser[_counter]);
    // change thisUser to this user's socket ID
  }

  var _counter = 0;
  function getCurrentShapeID () {
    return _counter - 1;
  }

  function generateShapeID () {
    return _counter++;
  }

  function getCurrentTool () {
    return tool;
  }

  function setColors (fill, stroke) {
    colors.fill = fill;
    colors.stroke = stroke; 
  }

  function setZoomScale (scale) {
    scalingFactor = 1 / scale;
  };

  return {
    createBoard: createBoard,
    getCurrentShape: getCurrentShape,
    getCurrentTool: getCurrentTool,
    generateShapeID: generateShapeID,
    setColors: setColors,
    setZoomScale: setZoomScale
  }
}
