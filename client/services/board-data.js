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
  var viewBoxWidth = svgWidth;
  var viewBoxHeight = svgHeight;

  var shapeStorage = {};
  var currentShape;
  var editorShape;
  var socketID;

  var tool = {
    name: 'path',
    colors: {
      fill: 'transparent',
      stroke: '#000000'
    }
  };

  function createBoard (element) {
    board = Raphael(element[0], svgWidth, svgHeight);
    $canvas = element.find('svg');
    canvasMarginX = $canvas.position().left;
    canvasMarginY = $canvas.position().top;
    viewBoxWidth = svgWidth;
    viewBoxHeight = svgHeight;
  }

  function getBoard () {
    return board;
  }

  function setEditorShape (shape) {
    editorShape = shapeStorage[socketID][shape.id];
  }

  function unsetEditorShape () {
    editorShape = null;
  }

  function getEditorShape () {
    return editorShape;
  }

  function getViewBoxDims () {
    return {
      width: viewBoxWidth,
      height: viewBoxHeight
    };
  }

  function setViewBoxDims (newViewBoxDims) {
    viewBoxWidth = newViewBoxDims.width;
    viewBoxHeight = newViewBoxDims.height;
  }

  function getOriginalDims () {
    return {
      width: svgWidth,
      height: svgHeight
    };
  }

  function getCanvasMargin () {
    return {
      x: canvasMarginX,
      y: canvasMarginY
    };
  }

  function getScalingFactor () {
    return scalingFactor;
  }

  function getOffset () {
    return {
      x: offsetX,
      y: offsetY
    }
  }

  function setOffset (newOffset) {
    offsetX = newOffset.x;
    offsetY = newOffset.y;
  }

  function getCanvas () {
    return $canvas;
  }

  function setSocketID (id) {
    socketID = id;
  }

  function getSocketID () {
    return socketID;
  }

  function pushToStorage (id, socketID, shape) {
    if (!shapeStorage[socketID]) {
      shapeStorage[socketID] = {};
    }
    if (socketID === undefined) {
      console.log(id, ' id');
      console.log(shape);
    }
    shapeStorage[socketID][id] = shape;
  }

  function getShapeByID (id, socketID) {
    //console.log('shapeStorage: ', shapeStorage);
    return shapeStorage[socketID][id];
  }

  function getCurrentShape () {
    return currentShape;
  }

  function setCurrentShape () {
    // if (shapeStorage[socketID]) {
      currentShape = shapeStorage[socketID][_counter - 1];
    // } else {
    //   console.log(shapeStorage);
    // }
  }

  function unsetCurrentShape () {
    currentShape = null;
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

  function setCurrentToolName (name) {
    tool.name = name;
  }

  function setColors (fill, stroke) {
    tool.colors.fill = fill;
    tool.colors.stroke = stroke; 
  }

  function setZoomScale (scale) {
    scalingFactor = 1 / scale;
  };

  function getZoomScale () {
    return scalingFactor;
  }

  return {
    createBoard: createBoard,
    getCurrentShape: getCurrentShape,
    getCurrentShapeID: getCurrentShapeID,
    getShapeByID: getShapeByID,
    getCurrentTool: getCurrentTool,
    generateShapeID: generateShapeID,
    setColors: setColors,
    setZoomScale: setZoomScale,
    getZoomScale: getZoomScale,
    getCanvas: getCanvas,
    setSocketID: setSocketID,
    getSocketID: getSocketID,
    setCurrentToolName: setCurrentToolName,
    getBoard: getBoard,
    getScalingFactor: getScalingFactor,
    getOffset: getOffset,
    getCanvasMargin: getCanvasMargin,
    pushToStorage: pushToStorage,
    setCurrentShape: setCurrentShape,
    unsetCurrentShape: unsetCurrentShape,
    getViewBoxDims: getViewBoxDims,
    setViewBoxDims: setViewBoxDims,
    setOffset: setOffset,
    getOriginalDims: getOriginalDims,
    setEditorShape: setEditorShape,
    unsetEditorShape: unsetEditorShape,
    getEditorShape: getEditorShape
  }
});
