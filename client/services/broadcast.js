angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets) {

  // I don't i should broadcast raphael, we will see
  var newShape = function (type, raphael, initX, initY) {
    Sockets.emit('newShape', {
      type: type,
      //raphael: raphael,
      initX: initX,
      initY: initY
    });
  };

  // I don't i should broadcast the board, we will see
  var selectShapeEditor = function (board, newCoords) {
    Sockets.emit('selectShapeEditor', {
      //board: board,
      newCoords: newCoords
    });
  };

  return {
    newShape: newShape,
    selectShapeEditor: selectShapeEditor
  };

});
