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

  var displayedSnaps;
  function visualizeSnaps (snaps) {
    var board = BoardData.getBoard();
    if (!displayedSnaps) {
      displayedSnaps = BoardData.getBoard().set();
    } else {
      displayedSnaps.remove();
      displayedSnaps.clear();
    }
    for (var snap in snaps) {
      displayedSnaps.push(board.circle(snaps[snap].x, snaps[snap].y, 5).attr({'stroke':'red'}));
    }
  }

  function clearSnaps () {
    if (displayedSnaps) {
      displayedSnaps.remove();
      displayedSnaps.clear();
    }
  }

  return {
    visualizeSelection: visualizeSelection,
    visualizeSnaps: visualizeSnaps,
    clearSelection: clearSelection,
    clearSnaps: clearSnaps
  }
}]);
