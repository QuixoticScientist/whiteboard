angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets, EventHandler) {
  Sockets.on('showExisting', function (data) {

    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (shapeId in data[socketId]) {
          var thisShape = data[socketId][shapeId];
          if (thisShape.initCoords) {
            console.log(shapeId);
            var tool = {};
            tool.name = thisShape.type;
            tool.colors = thisShape.colors;
            console.log(socketId, ' socketId');
            EventHandler.createShape(shapeId, socketId, tool, thisShape.initCoords[0], thisShape.initCoords[1]);
            EventHandler.editShape(shapeId, socketId, tool, thisShape.newX, thisShape.newY);
            EventHandler.finishShape(shapeId, socketId, tool);
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
    EventHandler.editShape(data.shapeId, data.socketId, data.tool, data.mouseX, data.mouseY);
  });

  Sockets.on('shapeCompleted', function (data) {
    EventHandler.finishShape(data.shapeId, data.socketId, data.tool);
  });

  Sockets.on('shapeCreated', function (data) {
    var tool = {};
    tool.name = data.type;
    tool.colors = data.colors;
    EventHandler.createShape(data.shapeId, data.socketId, tool, data['initCoords'][0], data['initCoords'][1]);

  });

  Sockets.on('shapeUpdate', function (data) {
    // console.log(data);
  });

  return {};

});
