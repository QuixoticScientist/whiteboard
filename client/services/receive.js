angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets, EventHandler) {
  Sockets.on('showExisting', function (data) {

    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (shapeId in data[socketId]) {
          // var thisShape = data[socketId][shapeId];

          // var newShape = {
          //   el: ShapeBuilder.newShape(thisShape.type, thisShape.initCoords.initX, thisShape.initCoords.initY, thisShape.colors),
          //   id: shapeId,
          //   coords: thisShape.initCoords,
          //   type: thisShape.type          
          // };

          // ShapeBuilder.storeOnEditShape(socketId, newShape);

          // var infoForClient = {
          //   shape: ShapeBuilder.getOnEditShape(socketId, shapeId).el,
          //   coords: thisShape.initCoords,
          //   initCoords: {
          //     canvasX: thisShape.initCoords.initX,
          //     canvasY: thisShape.initCoords.initY
          //   }
          // };

          // var mouseCoords = {
          //   x: thisShape.newX,
          //   y: thisShape.newY
          // };

          // ShapeEditor.selectShapeEditor(thisShape.type, infoForClient, mouseCoords);

          // var shapeWithoutSnaps = ShapeBuilder.getOnEditShape(socketId, shapeId);

          // Snap.createSnaps(shapeWithoutSnaps.el);
          // ShapeManipulation.pathSmoother(shapeWithoutSnaps.type, shapeWithoutSnaps.el);
          // ShapeBuilder.removeOnEditShape(socketId, shapeId);

        }
      }
    }
  });

  Sockets.on('socketId', function (data) {
    // saveSocketId(data.socketId);
    EventHandler.setSocketID(data.socketId);
    // console.log('Sockets (user) id: ', getSocketId());
  });

  Sockets.on('shapeEdited', function (data) {
    // console.log(data);
    EventHandler.editShape(data.shapeId, data.socketId, data.tool, data.mouseX, data.mouseY);
    // id, socketID, tool, x, y
    //console.log(data);
    // var infoForClient = {
      // shape: ShapeBuilder.getOnEditShape(data.socketId, data.shapeId).el,
      // coords: data.coords,
      // initCoords: {
      //   canvasX: data.initCoordX,
      //   canvasY: data.initCoordY
      // }
      //fill: data.fill
    // };
    // var mouseCoords = {
    //   x: data.mouseX,
    //   y: data.mouseY
    // };
    // This ternary operator is only for dev purposes
    // it runs the throttled version of the change path function
    // data.tool = data.tool === 'path' ? 'pathThrottle' : data.tool;

    // ShapeEditor.selectShapeEditor(data.tool, infoForClient, mouseCoords);
  });

  Sockets.on('shapeCompleted', function (data) {
    //console.log('Completed shape:', data);
    // var shape = ShapeBuilder.getOnEditShape(data.socketId, data.shapeId);
    // Snap.createSnaps(shape.el);
    // ShapeManipulation.pathSmoother(shape.type, shape.el);
    // ShapeBuilder.removeOnEditShape(data.socketId, data.shapeId);
  });

  Sockets.on('shapeCreated', function (data) {
    var tool = {};
    tool.name = data.type;
    tool.colors = data.colors;
    EventHandler.createShape(data.shapeId, data.socketId, tool, data['initCoords'][0], data['initCoords'][1]);
    // var newShape = {
    //   el: ShapeBuilder.newShape(data.type, data.initCoords.initX, data.initCoords.initY, data.colors),
    //   id: data.shapeId,
    //   coords: data.initCoords,
    //   type: data.type
    // };

    //ShapeBuilder.storeOnEditShape(data.socketId, newShape);

  });

  Sockets.on('shapeUpdate', function (data) {
    // console.log(data);
  });

  return {};

});
