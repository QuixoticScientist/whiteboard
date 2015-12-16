angular.module('whiteboard.services.visualizer', [])
.factory('Visualizer', ['BoardData', function (BoardData) {
  var selectionGlow;
  var selected;
  function visualizeSelection (mouseXY) {
    var board = BoardData.getBoard();
    var selection = board.getElementByPoint(mouseXY.x, mouseXY.y);
    if (!selection || !(selection === selected)) {
      if (selectionGlow) {
        selectionGlow.remove();
        selectionGlow.clear();
        selected = null;
      }
    }
    if (selection && (!selectionGlow || selectionGlow.items.length === 0)) {
      selected = selection;
      selectionGlow = selection.glow({
        'color': 'blue'
      });
    }
  }

  function clearSelection () {
    if (selectionGlow) {
      selectionGlow.remove();
      selectionGlow.clear();
      selected = null;
    }
  }

  return {
    visualizeSelection: visualizeSelection,
    clearSelection: clearSelection
  }
}]);
