angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets, ShapeBuilder, ShapeEditor) {


  Sockets.emit('idRequest', function () {});

  Sockets.on('socketId', function (data) {
    //console.log(data);
    Sockets.id = data.socketId;
    console.log('Sockets (user) id: ', Sockets.id);
  });

  Sockets.on('shapeCreated', function (data) {
    ShapeBuilder.storeOnEditShape(ShapeBuilder.newShape(data.type, data.initCoords.initX, data.initCoords.initY));
  });

  Sockets.on('shapeEdited', function (data) {
    var infoForClient = {
      shape: ShapeBuilder.getOnEditShape(data.shapeId),
      coords: data.coords,
      initCoords: {
        canvasX: data.initCoordX,
        canvasY: data.initCoordY
      },
      fill: data.fill
    };
    var mouseCoords = {
      x: data.mouseX,
      y: data.mouseY
    };

    ShapeEditor.selectShapeEditor(data.tool, infoForClient, mouseCoords);
  });

  Sockets.on('shapeCompleted', function (data) {

  });

  // I don't i should broadcast raphael, we will see
  var newShape = function (type, raphael, initX, initY) {
    Sockets.emit('newShape', {
      shapeId: shapeId,
      type: type,
      initCoords: initCoords
      // initY: initY
    });
  };

  // I don't i should broadcast the board, we will see
  var selectShapeEditor = function (data, mousePosition) {
    data.mouseX = mousePosition.x;
    data.mouseY = mousePosition.y;

    Sockets.emit('editShape', data);
  };

  var completeShape = function () {
    Sockets.emit('shapeCompleted');
  };
  

  return {
    newShape: newShape,
    selectShapeEditor: selectShapeEditor,
    completeShape: completeShape
  };

});
