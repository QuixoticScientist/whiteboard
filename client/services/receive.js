angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets, EventHandler) {
  Sockets.on('showExisting', function (data) {
    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (shapeId in data[socketId]) {
          var thisShape = data[socketId][shapeId];
          console.log('thisShape: ', thisShape)
          if (thisShape.initX && thisShape.initY) {
            console.log('Receive.showExisting: ', thisShape);
            EventHandler.createShape(shapeId, socketId, thisShape.tool, thisShape.initX, thisShape.initY);
            EventHandler.editShape(shapeId, socketId, thisShape.tool, thisShape.mouseX, thisShape.mouseY);
            EventHandler.finishShape(shapeId, socketId, thisShape.tool);
          }
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
    EventHandler.setSocketID(data.socketId);
  });

  Sockets.on('shapeEdited', function (data) {
    //console.log('Sockets.shapeEdited: ', data);
    EventHandler.editShape(data.shapeId, data.socketId, data.tool, data.mouseX, data.mouseY);
  });

  Sockets.on('shapeCompleted', function (data) {
    EventHandler.finishShape(data.shapeId, data.socketId, data.tool);
  });

  Sockets.on('shapeCreated', function (data) {
    //console.log('Sockets.shapeCreated: ', data)
    EventHandler.createShape(data.shapeId, data.socketId, data.tool, data.initX, data.initY);

  });

  Sockets.on('shapeUpdate', function (data) {
    // console.log(data);
  });

  return {};

});
