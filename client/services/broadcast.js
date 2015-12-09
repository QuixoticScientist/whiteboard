angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets, ShapeBuilder, ShapeEditor, Snap) {

  var socketUserId;

  var getSocketId = function () {
    return socketUserId;
  };

  var saveSocketId = function (id) {
    socketUserId = id;
  };

  Sockets.emit('idRequest', function () {});

  Sockets.on('socketId', function (data) {
    saveSocketId(data.socketId);
    console.log('Sockets (user) id: ', getSocketId());
  });

  Sockets.on('shapeCreated', function (data) {
    var newShape = {
      el: ShapeBuilder.newShape(data.type, data.initCoords.initX, data.initCoords.initY),
      id: data.shapeId,
      coords: data.initCoords
    };

    ShapeBuilder.storeOnEditShape(data.socketId, newShape);
  });

  Sockets.on('shapeEdited', function (data) {
    console.log('Edit path:', data.mouseX, data.mouseY);
    
    var infoForClient = {
      shape: ShapeBuilder.getOnEditShape(data.socketId, data.shapeId).el,
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
    // This ternary operato is only for dev purposes
    // it runs the throttled version of the change path function
    // data.tool = data.tool === 'path' ? 'pathThrottle' : data.tool;

    ShapeEditor.selectShapeEditor(data.tool, infoForClient, mouseCoords);
  });

  Sockets.on('shapeCompleted', function (data) {
    console.log('Completed shape:', data);
    Snap.createSnaps(ShapeBuilder.getOnEditShape(data.socketId, data.shapeId).el);
    ShapeBuilder.removeOnEditShape(data.socketId, data.shapeId);
  });

  // I don't think i should broadcast raphael, we will see
  var newShape = function (shapeId, type, initCoords) {
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

  var completeShape = function (shapeId) {
    //console.log(shapeId)
    Sockets.emit('shapeCompleted', {
      shapeId: shapeId
    });
  };
  

  return {
    getSocketId: getSocketId,
    newShape: newShape,
    selectShapeEditor: selectShapeEditor,
    completeShape: completeShape
  };

});
