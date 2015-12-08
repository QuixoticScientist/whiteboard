angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets) {

  Sockets.emit('idRequest', function () {

  });

  Sockets.on('socketId', function (data) {
    console.log(data);
  });

  Sockets.on('shapeCreated', function (data) {
    console.log(data);
  });

  Sockets.on('shapeUpdate', function (data) {
    console.log(data);
  });

  Socket.on('completeShape', function (data) {

  });

  // I don't i should broadcast raphael, we will see
  var newShape = function (type, raphael, initX, initY) {
    Sockets.emit('newShape', {
      shapeId: 'xxyy:0123',
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
