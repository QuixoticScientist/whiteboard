angular.module('whiteboard.services.zoom', [])
.factory('Zoom', ['BoardData', function (BoardData) {
  var last;
  function zoom (ev, mouseXY) {
    var board = BoardData.getBoard();
    var scalingFactor = BoardData.getZoomScale();
    var offset = BoardData.getOffset();
    var originalDims = BoardData.getOriginalDims();
    var currentDims = BoardData.getViewBoxDims();

    if (mouseXY) {
      if (last) {
        var up;
        if (ev.clientY > last) {
          up = 1.05;
        } else if (ev.clientY < last) {
          up = 0.95;
        } else {
          up = 1;
        }
        scalingFactor = scalingFactor * up;
        BoardData.setZoomScale(1 / scalingFactor);
      }
      last = ev.clientY;
    }

    var newViewBoxDims = {
      width: originalDims.width * scalingFactor,
      height: originalDims.height * scalingFactor
    };
    BoardData.setViewBoxDims(newViewBoxDims);

    if (mouseXY) {
      var newOffset = {
        x: offset.x,
        y: offset.y
        // x: mouseXY.x - newViewBoxDims.width / 2,
        // y: mouseXY.y - newViewBoxDims.height / 2
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

  function resetZoom () {
    last = null;
  }

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
    resetZoom: resetZoom,
    pan: pan,
    resetPan: resetPan
  }
}]);
