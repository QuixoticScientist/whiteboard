angular.module('whiteboard.services.zoom', [])
.factory('Zoom', ['BoardData', function (BoardData) {
  function zoom (ev) {
    var board = BoardData.getBoard();
    var scalingFactor = BoardData.getScalingFactor();
    var offset = BoardData.getOffset();
    var originalDims = BoardData.getOriginalDims();
    var currentDims = BoardData.getViewBoxDims();

    if (ev) {
      var canvasMargin = BoardData.getCanvasMargin();
      var mousePosition = {
        x: (ev.clientX - canvasMargin.x) * scalingFactor + offset.x,
        y: (ev.clientY - canvasMargin.y) * scalingFactor + offset.y
      };
    }

    var newViewBoxDims = {
      width: originalDims.width * scalingFactor,
      height: originalDims.height * scalingFactor
    };
    BoardData.setViewBoxDims(newViewBoxDims);

    if (ev) {
      newOffset = {
        x: mousePosition.x - newViewBoxDims.width / 2,
        y: mousePosition.y - newViewBoxDims.height / 2
      };
    } else {
      var newOffset = {
        x: offset.x + currentDims.width / 2 - newViewBoxDims.width / 2,
        y: offset.y + currentDims.height / 2 - newViewBoxDims.height / 2
      };
    }
    BoardData.setOffset(newOffset);

    board.setViewBox(newOffset.x, newOffset.y, newViewBoxDims.width, newViewBoxDims.height);
  };

  var startPanCoords;
  var startPanOffset;
  var newOffset;
  function pan (ev) {
    var board = BoardData.getBoard();
    var scalingFactor = BoardData.getScalingFactor();
    var offset = BoardData.getOffset();
    var currentDims = BoardData.getViewBoxDims();
    var canvasMargin = BoardData.getCanvasMargin();

    var mousePosition = {
      x: (ev.clientX - canvasMargin.x) * scalingFactor + offset.x,
      y: (ev.clientY - canvasMargin.y) * scalingFactor + offset.y
    };

    if (!startPanCoords) {
      startPanCoords = mousePosition;
      startPanOffset = offset;
    } else {
      newOffset = {
        x: startPanOffset.x + (startPanCoords.x - mousePosition.x),
        y: startPanOffset.y + (startPanCoords.y - mousePosition.y)
      };

      board.setViewBox(newOffset.x, newOffset.y, currentDims.width, currentDims.height);
    }
  }

  function resetPan () {
    startPanCoords = startPanOffset = null;
    BoardData.setOffset(newOffset);
  }

  return {
    zoom: zoom,
    pan: pan,
    resetPan: resetPan
  }
}]);
