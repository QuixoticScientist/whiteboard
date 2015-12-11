angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets, ShapeBuilder, ShapeEditor, ShapeManipulation, Snap) {

  var socketUserId;

  var getSocketId = function () {
    return socketUserId;
  };

  var saveSocketId = function (id) {
    socketUserId = id;
  };

  Sockets.emit('idRequest', function () {});

  Sockets.on('showExisting', function (data) {

    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (shapeId in data[socketId]) {
          var thisShape = data[socketId][shapeId];

          var newShape = {
            el: ShapeBuilder.newShape(thisShape.type, thisShape.initCoords.initX, thisShape.initCoords.initY, thisShape.colors),
            id: shapeId,
            coords: thisShape.initCoords,
            type: thisShape.type          
          };

          ShapeBuilder.storeOnEditShape(socketId, newShape);

          var infoForClient = {
            shape: ShapeBuilder.getOnEditShape(socketId, shapeId).el,
            coords: thisShape.initCoords,
            initCoords: {
              canvasX: thisShape.initCoords.initX,
              canvasY: thisShape.initCoords.initY
            }
          };

          var mouseCoords = {
            x: thisShape.newX,
            y: thisShape.newY
          };

          ShapeEditor.selectShapeEditor(thisShape.type, infoForClient, mouseCoords);

          var shapeWithoutSnaps = ShapeBuilder.getOnEditShape(socketId, shapeId);

          Snap.createSnaps(shapeWithoutSnaps.el);
          ShapeManipulation.pathSmoother(shapeWithoutSnaps.type, shapeWithoutSnaps.el);
          ShapeBuilder.removeOnEditShape(socketId, shapeId);

        }
      }
    }
  });

  Sockets.on('socketId', function (data) {
    saveSocketId(data.socketId);
    console.log('Sockets (user) id: ', getSocketId());
  });

  Sockets.on('shapeCreated', function (data) {
    console.log(data);
    var newShape = {
      el: ShapeBuilder.newShape(data.type, data.initCoords.initX, data.initCoords.initY, data.colors),
      id: data.shapeId,
      coords: data.initCoords,
      type: data.type
    };

    ShapeBuilder.storeOnEditShape(data.socketId, newShape);

  });

  Sockets.on('shapeEdited', function (data) {
    
    var infoForClient = {
      shape: ShapeBuilder.getOnEditShape(data.socketId, data.shapeId).el,
      coords: data.coords,
      initCoords: {
        canvasX: data.initCoordX,
        canvasY: data.initCoordY
      }
      //fill: data.fill
    };
    var mouseCoords = {
      x: data.mouseX,
      y: data.mouseY
    };
    // This ternary operator is only for dev purposes
    // it runs the throttled version of the change path function
    // data.tool = data.tool === 'path' ? 'pathThrottle' : data.tool;

    ShapeEditor.selectShapeEditor(data.tool, infoForClient, mouseCoords);
  });

  Sockets.on('shapeCompleted', function (data) {
    console.log('Completed shape:', data);
    var shape = ShapeBuilder.getOnEditShape(data.socketId, data.shapeId);
    // console.log(shape);
    Snap.createSnaps(shape.el);
    ShapeManipulation.pathSmoother(shape.type, shape.el);
    ShapeBuilder.removeOnEditShape(data.socketId, data.shapeId);
  });

  Sockets.on('boardData', function (data) {
    saveBoardData(data);
  });

  var getBoardData = function () {
    Sockets.emit('getBoardData');
  };

  var saveBoardData = function (data) {
    console.log(data);
  };

  // I don't think i should broadcast raphael, we will see
  var newShape = function (shapeId, type, initCoords, colors) {
    Sockets.emit('newShape', {
      shapeId: shapeId,
      type: type,
      initCoords: initCoords,
      colors: colors
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
