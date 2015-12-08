angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets) {


  Sockets.emit('idRequest', function () {

  });

  Sockets.on('socketId', function (data) {
    console.log(data);
  });

  Sockets.on('shapeCreated', function (data) {
    // console.log(data);
  });

  Sockets.on('shapeEdited', function (data) {
    // console.log(data);
  });

  // I don't think i should broadcast raphael, we will see
  var newShape = function (type, raphael, initX, initY) {
    Sockets.emit('newShape', {
      shapeId: Math.floor(Math.random() * 100000),
      type: type,
      initX: initX,
      initY: initY
    });
  };

  // I don't i should broadcast the board, we will see
  var selectShapeEditor = function (board, newCoords) {
    Sockets.emit('editShape', {
      coords: newCoords
    });
  };

  var completeShape = function () {
    Sockets.emit('completeShape');
  };
  

  return {
    newShape: newShape,
    selectShapeEditor: selectShapeEditor,
    completeShape: completeShape
  };

});
