angular.module('whiteboard.services.boarddata', [])
.factory('BoardData', function () {
  //svgWidth/Height are the width and height of the DOM element
  var svgWidth = 1500; //sizeX
  var svgHeight = 1000; //sizeY
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
  var viewBoxWidth;// = svgWidth;
  var viewBoxHeight;// = svgHeight;

  var shapeStorage = {};
  var currentShape;
  var currentShapeID;
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

    ResizeSensorApi.create(document.getElementsByClassName('app-container')[0], handleWindowResize);

    board = Raphael(element[0]);
    board.setViewBox(0, 0, svgWidth, svgHeight, true);
    board.canvas.setAttribute('preserveAspectRatio', 'none');

    $canvas = element.find('svg');
    canvasMarginX = $canvas.position().left;
    canvasMarginY = $canvas.position().top;
  }

  function handleWindowResize (newPageSize) {
    svgWidth = newPageSize.width;
    svgHeight = newPageSize.height;

    viewBoxWidth = svgWidth * scalingFactor;
    viewBoxHeight = svgHeight * scalingFactor;
    var offset = getOffset();
    board.setViewBox(offset.x, offset.y, viewBoxWidth, viewBoxHeight, true);
  }

  function getBoard () {
    return board;
  }

  function setEditorShape (shape) {
    editorShape = shapeStorage[shape.data('socketID')][shape.id];
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
    shapeStorage[socketID][shape.id] = shape;
  }

  function getShapeByID (id, socketID) {
    return shapeStorage[socketID][id];
  }

  function getCurrentShape () {
    return currentShape;
  }

  function setCurrentShape (id) {
    currentShape = shapeStorage[socketID][id];
  }

  function unsetCurrentShape () {
    currentShape = null;
  }

  function getCurrentShapeID () {
    return currentShapeID;
  }

  function generateShapeID () {
    currentShapeID = Raphael._oid;
    return currentShapeID;
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
    getShapeByID: getShapeByID,
    getCurrentTool: getCurrentTool,
    generateShapeID: generateShapeID,
    getCurrentShapeID: getCurrentShapeID,
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
