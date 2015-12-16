angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets, EventHandler) {
  Sockets.on('showExisting', function (data) {
    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (shapeId in data[socketId]) {
          var thisShape = data[socketId][shapeId];
          if (thisShape.initX && thisShape.initY) {
            console.log('Receive.showExisting: ', thisShape);
            EventHandler.createShape(shapeId, socketId, thisShape.tool, thisShape.initX, thisShape.initY);
            EventHandler.editShape(shapeId, socketId, thisShape.tool, thisShape.mouseX, thisShape.mouseY);
            EventHandler.finishShape(shapeId, socketId, thisShape.tool);
          }
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
    EventHandler.createShape(data.shapeId, data.socketId, data.tool, data.initX, data.initY);
  });

  Sockets.on('shapeMoved', function (data) {
    EventHandler.moveShape(data.shapeId, data.socketId, data.mouseX, data.mouseY);
  });

  Sockets.on('shapeDeleted', function (data) {
    EventHandler.deleteShape(data.shapeId, data.socketId);
  });

  return {};

});
